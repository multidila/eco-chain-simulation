import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
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
			provide: PLANT_CONFIG,
			useValue: {
				energy: { value: 100 },
				behavior: { actions: new NoneAction() },
			} as PlantConfig,
		},
		{
			provide: HERBIVORE_CONFIG,
			useValue: {
				energy: { value: 50, maxValue: 100, metabolismRate: 2 },
				behavior: { actions: new NoneAction() },
				reproduction: { threshold: 0.9, shareRate: 0.5 },
			} as HerbivoreConfig,
		},
		{
			provide: CARNIVORE_CONFIG,
			useValue: {
				energy: { value: 75, maxValue: 150, metabolismRate: 1 },
				behavior: { actions: new NoneAction() },
				reproduction: { threshold: 0.9, shareRate: 0.5 },
			} as CarnivoreConfig,
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
	],
};
