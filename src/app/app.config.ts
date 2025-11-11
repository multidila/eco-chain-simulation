import { APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';

import { APP_ROUTES } from './app.routes';
import { LEFT_ROTATION, RIGHT_ROTATION } from './core/constants';
import { ActionType, AgentType } from './core/enums';
import { Action, AgentFactory, Environment, Sensor } from './core/models';
import {
	GRID_SENSOR_SERVICE_CONFIG,
	GridEnvironmentService,
	GridSensorService,
	SimulationEngine,
} from './core/services';
import {
	DieAction,
	EatAction,
	GrowthAction,
	MetabolizeAction,
	MoveForwardAction,
	NeuralNetworkDecisionAction,
	ReproduceAction,
	RespawnAction,
	RotateAction,
} from './core/services/actions';
import {
	CARNIVORE_CONFIG,
	CarnivoreConfig,
	CarnivoreFactory,
	HERBIVORE_CONFIG,
	HerbivoreConfig,
	HerbivoreFactory,
	PLANT_CONFIG,
	PlantConfig,
	PlantFactory,
} from './core/services/agent-factories';
import { GridEnvironmentPositionGenerator } from './core/services/environment/grid/grid-environment-position-generator.service';
import { RandomPositionGenerator } from './core/services/environment/grid/random-position-generator.service';
import { AGENT_FACTORIES } from './core/tokens';

export const APP_CONFIG: ApplicationConfig = {
	providers: [
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(APP_ROUTES),
		provideAnimationsAsync(),
		SimulationEngine,
		GridSensorService,
		GridEnvironmentService,
		RandomPositionGenerator,
		PlantFactory,
		HerbivoreFactory,
		CarnivoreFactory,
		{
			provide: GRID_SENSOR_SERVICE_CONFIG,
			useValue: {
				agentTypes: [AgentType.Plant, AgentType.Herbivore, AgentType.Carnivore],
				visionRange: 2,
			},
		},
		{
			provide: Environment,
			useExisting: GridEnvironmentService,
		},
		{
			provide: Sensor,
			useExisting: GridSensorService,
		},
		{
			provide: GridEnvironmentPositionGenerator,
			useExisting: RandomPositionGenerator,
		},
		{
			provide: AGENT_FACTORIES,
			useFactory: (
				plantFactory: PlantFactory,
				herbivoreFactory: HerbivoreFactory,
				carnivoreFactory: CarnivoreFactory,
			) => {
				const factories = new Map<AgentType, AgentFactory>();
				factories.set(AgentType.Plant, plantFactory);
				factories.set(AgentType.Herbivore, herbivoreFactory);
				factories.set(AgentType.Carnivore, carnivoreFactory);
				return factories;
			},
			deps: [PlantFactory, HerbivoreFactory, CarnivoreFactory],
		},
		{
			provide: APP_INITIALIZER,
			useFactory:
				(
					plantConfig: PlantConfig,
					herbivoreConfig: HerbivoreConfig,
					carnivoreConfig: CarnivoreConfig,
					environment: Environment,
					sensor: Sensor,
					agentFactories: Map<AgentType, AgentFactory>,
				) =>
				() => {
					// Food chain configuration: who can eat whom
					const foodChain = new Map<AgentType, Set<AgentType>>();
					foodChain.set(AgentType.Herbivore, new Set([AgentType.Plant]));
					foodChain.set(AgentType.Carnivore, new Set([AgentType.Herbivore]));

					// Agent type mapping for neural network
					const agentMapping = [AgentType.Plant, AgentType.Herbivore, AgentType.Carnivore];

					// Plant: Respawn when dead
					const plantRespawn = new RespawnAction(environment, agentFactories);

					// Herbivore: Growth → Metabolize → NeuralNetworkDecision → Reproduce → Die
					const herbivoreGrowth = new GrowthAction();
					const herbivoreMetabolize = new MetabolizeAction();
					const herbivoreReproduce = new ReproduceAction(environment);
					const herbivoreDie = new DieAction(environment);

					// Create actions map for herbivore neural network
					const herbivoreActions = new Map<ActionType, Action>();
					herbivoreActions.set(ActionType.MoveForward, new MoveForwardAction(environment));
					herbivoreActions.set(ActionType.RotateLeft, new RotateAction(environment, LEFT_ROTATION));
					herbivoreActions.set(ActionType.RotateRight, new RotateAction(environment, RIGHT_ROTATION));

					// Create getter function that reads current nutrition values
					herbivoreActions.set(
						ActionType.Eat,
						new EatAction(environment, foodChain, (agentType) => herbivoreConfig.nutrition[agentType] ?? 0),
					);

					const herbivoreActionMapping = [
						ActionType.MoveForward,
						ActionType.RotateLeft,
						ActionType.RotateRight,
						ActionType.Eat,
					];

					const herbivoreDecision = new NeuralNetworkDecisionAction(
						herbivoreActions,
						agentMapping,
						herbivoreActionMapping,
						sensor,
						environment,
					);

					// Carnivore: Growth → Metabolize → NeuralNetworkDecision → Reproduce → Die
					const carnivoreGrowth = new GrowthAction();
					const carnivoreMetabolize = new MetabolizeAction();
					const carnivoreReproduce = new ReproduceAction(environment);
					const carnivoreDie = new DieAction(environment);

					// Create actions map for carnivore neural network
					const carnivoreActions = new Map<ActionType, Action>();
					carnivoreActions.set(ActionType.MoveForward, new MoveForwardAction(environment));
					carnivoreActions.set(ActionType.RotateLeft, new RotateAction(environment, LEFT_ROTATION));
					carnivoreActions.set(ActionType.RotateRight, new RotateAction(environment, RIGHT_ROTATION));

					// Create getter function that reads current nutrition values
					carnivoreActions.set(
						ActionType.Eat,
						new EatAction(environment, foodChain, (agentType) => carnivoreConfig.nutrition[agentType] ?? 0),
					);

					const carnivoreActionMapping = [
						ActionType.MoveForward,
						ActionType.RotateLeft,
						ActionType.RotateRight,
						ActionType.Eat,
					];

					const carnivoreDecision = new NeuralNetworkDecisionAction(
						carnivoreActions,
						agentMapping,
						carnivoreActionMapping,
						sensor,
						environment,
					);

					herbivoreGrowth
						.setNext(herbivoreMetabolize)
						.setNext(herbivoreDecision)
						.setNext(herbivoreReproduce)
						.setNext(herbivoreDie);
					carnivoreGrowth
						.setNext(carnivoreMetabolize)
						.setNext(carnivoreDecision)
						.setNext(carnivoreReproduce)
						.setNext(carnivoreDie);
					plantConfig.set({
						behavior: {
							actions: plantRespawn,
						},
					});
					herbivoreConfig.set({
						behavior: {
							actions: herbivoreGrowth,
						},
					});
					carnivoreConfig.set({
						behavior: {
							actions: carnivoreGrowth,
						},
					});
				},
			deps: [PLANT_CONFIG, HERBIVORE_CONFIG, CARNIVORE_CONFIG, Environment, Sensor, AGENT_FACTORIES],
			multi: true,
		},
	],
};
