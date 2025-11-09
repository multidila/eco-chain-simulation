import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';

import { APP_ROUTES } from './app.routes';
import { Environment, Sensor } from './core/models';
import { GridEnvironmentService, GridSensorService, SimulationEngine } from './core/services';
import { GridEnvironmentPositionGenerator } from './core/services/environment/grid/grid-environment-position-generator.service';
import { RandomPositionGenerator } from './core/services/environment/grid/random-position-generator.service';
import { AGENT_FACTORIES } from './core/tokens';

export const APP_CONFIG: ApplicationConfig = {
	providers: [
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(APP_ROUTES),
		provideAnimationsAsync(),
		SimulationEngine,
		{
			provide: Environment,
			useClass: GridEnvironmentService,
		},
		{
			provide: Sensor,
			useClass: GridSensorService,
		},
		{
			provide: GridEnvironmentPositionGenerator,
			useClass: RandomPositionGenerator,
		},
		{
			provide: AGENT_FACTORIES,
			useValue: new Map(),
		},
	],
};
