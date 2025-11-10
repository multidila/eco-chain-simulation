import { inject, Injectable, InjectionToken, Injector } from '@angular/core';

import { AgentType } from '../../enums';
import { Action, AgentFactory, LivingAgent } from '../../models';
import { ActionChainBehaviorStrategy } from '../behavior-strategies';
import { LivingEnergyStrategy } from '../energy-strategies/living-energy-strategy';
import {
	EnergyThresholdReproductionStrategy,
	EnergyThresholdReproductionStrategyConfig,
} from '../reproduction-strategies';

export const HERBIVORE_CONFIG = new InjectionToken<HerbivoreConfig>('HERBIVORE_CONFIG');

export interface HerbivoreConfig {
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
export class HerbivoreFactory extends AgentFactory<LivingAgent> {
	private static _counter = 0;

	private readonly _config = inject(HERBIVORE_CONFIG);
	private readonly _injector = inject(Injector);

	public create(): LivingAgent {
		return {
			id: `herbivore-${HerbivoreFactory._counter++}`,
			type: AgentType.Herbivore,
			generation: 0,
			energyStrategy: new LivingEnergyStrategy(
				this._config.energy.value,
				this._config.energy.maxValue,
				this._config.energy.metabolismRate,
			),
			behaviorStrategy: new ActionChainBehaviorStrategy(this._config.behavior.actions),
			reproductionStrategy: new EnergyThresholdReproductionStrategy(this._config.reproduction, this._injector),
		};
	}
}
