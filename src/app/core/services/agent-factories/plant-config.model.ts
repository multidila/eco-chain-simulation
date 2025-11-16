import { Injectable, InjectionToken } from '@angular/core';

import { Action } from '../../models';

@Injectable({ providedIn: 'root' })
export class PlantConfig {
	private static _instance: PlantConfig;

	public energy!: {
		value: number;
		maxValue: number;
		metabolismRate: number;
	};

	public behavior!: {
		actions: Action;
	};

	private constructor() {}

	public static get instance(): PlantConfig {
		if (!PlantConfig._instance) {
			PlantConfig._instance = new PlantConfig();
		}
		return PlantConfig._instance;
	}

	public set(config: Partial<Pick<PlantConfig, 'energy' | 'behavior'>>): void {
		if (config.energy) {
			this.energy = { ...this.energy, ...config.energy };
		}
		if (config.behavior) {
			this.behavior = { ...this.behavior, ...config.behavior };
		}
	}
}

export const PLANT_CONFIG = new InjectionToken<PlantConfig>('PLANT_CONFIG', {
	providedIn: 'root',
	factory: () => PlantConfig.instance,
});
