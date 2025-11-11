import { Injectable, InjectionToken } from '@angular/core';

import { AgentType } from '../../enums';
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

	public nutrition!: Partial<Record<AgentType, number>>;

	private constructor() {}

	public static get instance(): HerbivoreConfig {
		if (!HerbivoreConfig._instance) {
			HerbivoreConfig._instance = new HerbivoreConfig();
		}
		return HerbivoreConfig._instance;
	}

	public set(config: Partial<Pick<HerbivoreConfig, 'energy' | 'behavior' | 'reproduction' | 'nutrition'>>): void {
		if (config.energy) {
			this.energy = { ...this.energy, ...config.energy };
		}
		if (config.behavior) {
			this.behavior = { ...this.behavior, ...config.behavior };
		}
		if (config.reproduction) {
			this.reproduction = { ...this.reproduction, ...config.reproduction };
		}
		if (config.nutrition) {
			this.nutrition = { ...this.nutrition, ...config.nutrition };
		}
	}
}

export const HERBIVORE_CONFIG = new InjectionToken<HerbivoreConfig>('HERBIVORE_CONFIG', {
	providedIn: 'root',
	factory: () => HerbivoreConfig.instance,
});
