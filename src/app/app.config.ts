import { APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';

import { APP_ROUTES } from './app.routes';
import { AgentType } from './core/enums';
import { AgentFactory, Environment, Sensor } from './core/models';
import { GridEnvironmentService, GridSensorService, SimulationEngine } from './core/services';
import { NoneAction } from './core/services/actions';
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
				(plantConfig: PlantConfig, herbivoreConfig: HerbivoreConfig, carnivoreConfig: CarnivoreConfig) =>
				() => {
					plantConfig.set({ behavior: { actions: new NoneAction() } });
					herbivoreConfig.set({ behavior: { actions: new NoneAction() } });
					carnivoreConfig.set({ behavior: { actions: new NoneAction() } });
				},
			deps: [PLANT_CONFIG, HERBIVORE_CONFIG, CARNIVORE_CONFIG],
			multi: true,
		},
	],
};
