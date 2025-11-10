import { APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';

import { APP_ROUTES } from './app.routes';
import { LEFT_ROTATION, RIGHT_ROTATION } from './core/constants';
import { ActionType, AgentType } from './core/enums';
import { Action, AgentFactory, Environment, NeuralNetwork, Sensor } from './core/models';
import { GridEnvironmentService, GridSensorService, SimulationEngine } from './core/services';
import {
	DieAction,
	EatAction,
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
					// Initialize nutrition values from default params
					herbivoreConfig.set({
						nutrition: {
							[AgentType.Plant]: 20,
							[AgentType.Herbivore]: 0,
							[AgentType.Carnivore]: 0,
						},
					});
					carnivoreConfig.set({
						nutrition: {
							[AgentType.Plant]: 0,
							[AgentType.Herbivore]: 30,
							[AgentType.Carnivore]: 0,
						},
					});

					// Food chain configuration: who can eat whom
					const foodChain = new Map<AgentType, Set<AgentType>>();
					foodChain.set(AgentType.Herbivore, new Set([AgentType.Plant]));
					foodChain.set(AgentType.Carnivore, new Set([AgentType.Herbivore]));

					// Agent type mapping for neural network
					const agentMapping = [AgentType.Plant, AgentType.Herbivore, AgentType.Carnivore];

					// Plant: Respawn when dead
					const plantRespawn = new RespawnAction(environment, agentFactories);
					plantConfig.set({ behavior: { actions: plantRespawn } });

					// Herbivore: Metabolize → NeuralNetworkDecision → Reproduce → Die
					const herbivoreMetabolize = new MetabolizeAction();
					const herbivoreReproduce = new ReproduceAction(environment);
					const herbivoreDie = new DieAction(environment);

					// Create actions map for herbivore neural network
					const herbivoreActions = new Map<ActionType, Action>();
					herbivoreActions.set(ActionType.MoveForward, new MoveForwardAction(environment));
					herbivoreActions.set(ActionType.RotateLeft, new RotateAction(environment, LEFT_ROTATION));
					herbivoreActions.set(ActionType.RotateRight, new RotateAction(environment, RIGHT_ROTATION));

					// Convert nutrition Record to Map for EatAction
					const herbivoreEnergyValues = new Map<AgentType, number>(
						Object.entries(herbivoreConfig.nutrition).map(([key, value]) => [key as AgentType, value]),
					);
					herbivoreActions.set(ActionType.Eat, new EatAction(environment, foodChain, herbivoreEnergyValues));

					const herbivoreActionMapping = [
						ActionType.MoveForward,
						ActionType.RotateLeft,
						ActionType.RotateRight,
						ActionType.Eat,
					];

					// Create empty neural network (will be initialized with weights later)
					const herbivoreNeuralNetwork: NeuralNetwork = {
						inputs: [],
						outputs: [],
						weights: [],
						biases: [],
					};

					const herbivoreDecision = new NeuralNetworkDecisionAction(
						herbivoreActions,
						agentMapping,
						herbivoreActionMapping,
						herbivoreNeuralNetwork,
						sensor,
						environment,
					);

					herbivoreMetabolize.setNext(herbivoreDecision);
					herbivoreDecision.setNext(herbivoreReproduce);
					herbivoreReproduce.setNext(herbivoreDie);

					herbivoreConfig.set({ behavior: { actions: herbivoreMetabolize } });

					// Carnivore: Metabolize → NeuralNetworkDecision → Reproduce → Die
					const carnivoreMetabolize = new MetabolizeAction();
					const carnivoreReproduce = new ReproduceAction(environment);
					const carnivoreDie = new DieAction(environment);

					// Create actions map for carnivore neural network
					const carnivoreActions = new Map<ActionType, Action>();
					carnivoreActions.set(ActionType.MoveForward, new MoveForwardAction(environment));
					carnivoreActions.set(ActionType.RotateLeft, new RotateAction(environment, LEFT_ROTATION));
					carnivoreActions.set(ActionType.RotateRight, new RotateAction(environment, RIGHT_ROTATION));

					// Convert nutrition Record to Map for EatAction
					const carnivoreEnergyValues = new Map<AgentType, number>(
						Object.entries(carnivoreConfig.nutrition).map(([key, value]) => [key as AgentType, value]),
					);
					carnivoreActions.set(ActionType.Eat, new EatAction(environment, foodChain, carnivoreEnergyValues));

					const carnivoreActionMapping = [
						ActionType.MoveForward,
						ActionType.RotateLeft,
						ActionType.RotateRight,
						ActionType.Eat,
					];

					// Create empty neural network (will be initialized with weights later)
					const carnivoreNeuralNetwork: NeuralNetwork = {
						inputs: [],
						outputs: [],
						weights: [],
						biases: [],
					};

					const carnivoreDecision = new NeuralNetworkDecisionAction(
						carnivoreActions,
						agentMapping,
						carnivoreActionMapping,
						carnivoreNeuralNetwork,
						sensor,
						environment,
					);

					carnivoreMetabolize.setNext(carnivoreDecision);
					carnivoreDecision.setNext(carnivoreReproduce);
					carnivoreReproduce.setNext(carnivoreDie);

					carnivoreConfig.set({ behavior: { actions: carnivoreMetabolize } });
				},
			deps: [PLANT_CONFIG, HERBIVORE_CONFIG, CARNIVORE_CONFIG, Environment, Sensor, AGENT_FACTORIES],
			multi: true,
		},
	],
};
