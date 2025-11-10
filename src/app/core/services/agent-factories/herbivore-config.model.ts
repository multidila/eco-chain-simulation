import { Injectable, InjectionToken } from '@angular/core';

import { Action, LivingAgent } from '../../models';
import { EnergyThresholdReproductionStrategyConfig } from '../reproduction-strategies';

@Injectable({ providedIn: 'root' })
export class HerbivoreConfig {
	private static _instance: HerbivoreConfig;

	public energy!: {
		value: number;
		maxValue: number;
		metabolismRate: number;
	};

	public behavior!: {
		actions: Action<LivingAgent>;
	};

	public reproduction!: EnergyThresholdReproductionStrategyConfig;

	private constructor() {}

	public static get instance(): HerbivoreConfig {
		if (!HerbivoreConfig._instance) {
			HerbivoreConfig._instance = new HerbivoreConfig();
		}
		return HerbivoreConfig._instance;
	}

	public set(config: Partial<Pick<HerbivoreConfig, 'energy' | 'behavior' | 'reproduction'>>): void {
		if (config.energy) {
			this.energy = { ...this.energy, ...config.energy };
		}
		if (config.behavior) {
			this.behavior = { ...this.behavior, ...config.behavior };
		}
		if (config.reproduction) {
			this.reproduction = { ...this.reproduction, ...config.reproduction };
		}
	}
}

export const HERBIVORE_CONFIG = new InjectionToken<HerbivoreConfig>('HERBIVORE_CONFIG', {
	providedIn: 'root',
	factory: () => HerbivoreConfig.instance,
});
