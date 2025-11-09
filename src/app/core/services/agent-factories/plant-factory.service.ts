import { inject, Injectable, InjectionToken } from '@angular/core';

import { AgentType } from '../../enums';
import { Action, AgentFactory, LivingAgent } from '../../models';
import { ActionChainBehaviorStrategy } from '../behavior-strategies';
import { ConstantEnergyStrategy } from '../energy-strategies/constant-energy-strategy';

const PLANT_CONFIG = new InjectionToken<PlantConfig>('PLANT_CONFIG');

export interface PlantConfig {
	energy: {
		value: number;
	};
	behavior: {
		actions: Action;
	};
}

@Injectable()
export class PlantFactory extends AgentFactory<LivingAgent> {
	private static _counter = 0;

	private readonly _config = inject(PLANT_CONFIG);

	public create(): LivingAgent {
		return {
			id: `plant-${PlantFactory._counter++}`,
			type: AgentType.Plant,
			generation: 0,
			energyStrategy: new ConstantEnergyStrategy(this._config.energy.value),
			behaviorStrategy: new ActionChainBehaviorStrategy(this._config.behavior.actions),
		};
	}
}
