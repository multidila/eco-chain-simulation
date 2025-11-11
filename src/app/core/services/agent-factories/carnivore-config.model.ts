import { Injectable, InjectionToken } from '@angular/core';

import { AgentType } from '../../enums';
import { Action, LivingAgent } from '../../models';
import { EnergyThresholdReproductionStrategyConfig } from '../reproduction-strategies';

@Injectable({ providedIn: 'root' })
export class CarnivoreConfig {
	private static _instance: CarnivoreConfig;

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

	public static get instance(): CarnivoreConfig {
		if (!CarnivoreConfig._instance) {
			CarnivoreConfig._instance = new CarnivoreConfig();
		}
		return CarnivoreConfig._instance;
	}

	public set(config: Partial<Pick<CarnivoreConfig, 'energy' | 'behavior' | 'reproduction' | 'nutrition'>>): void {
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

export const CARNIVORE_CONFIG = new InjectionToken<CarnivoreConfig>('CARNIVORE_CONFIG', {
	providedIn: 'root',
	factory: () => CarnivoreConfig.instance,
});
