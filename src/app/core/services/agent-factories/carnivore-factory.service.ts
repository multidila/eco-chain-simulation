import { inject, Injectable, InjectionToken } from '@angular/core';

import { AgentType } from '../../enums';
import { Action, AgentFactory, LivingAgent } from '../../models';
import { ActionChainBehaviorStrategy } from '../behavior-strategies';
import { LivingEnergyStrategy } from '../energy-strategies/living-energy-strategy';
import {
	EnergyThresholdReproductionStrategy,
	EnergyThresholdReproductionStrategyConfig,
} from '../reproduction-strategies';

const CARNIVORE_CONFIG = new InjectionToken<CarnivoreConfig>('CARNIVORE_CONFIG');

export interface CarnivoreConfig {
	energy: {
		value: number;
		maxValue: number;
		metabolismRate: number;
	};
	behavior: {
		actions: Action<LivingAgent>;
	};
	reproduction: EnergyThresholdReproductionStrategyConfig;
}

@Injectable()
export class CarnivoreFactory extends AgentFactory<LivingAgent> {
	private static _counter = 0;

	private readonly _config = inject(CARNIVORE_CONFIG);

	public create(): LivingAgent {
		return {
			id: `carnivore-${CarnivoreFactory._counter++}`,
			type: AgentType.Carnivore,
			generation: 0,
			energyStrategy: new LivingEnergyStrategy(
				this._config.energy.value,
				this._config.energy.maxValue,
				this._config.energy.metabolismRate,
			),
			behaviorStrategy: new ActionChainBehaviorStrategy(this._config.behavior.actions),
			reproductionStrategy: new EnergyThresholdReproductionStrategy(this._config.reproduction),
		};
	}
}
