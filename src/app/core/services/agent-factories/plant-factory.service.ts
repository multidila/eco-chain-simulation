import { inject, Injectable, InjectionToken } from '@angular/core';

import { ActionType, AgentType } from '../../enums';
import { AgentFactory, LivingAgent } from '../../models';
import { NoneAction } from '../actions/none-action';
import { StaticBehaviorStrategy } from '../behavior-strategies/static-behavior-strategy';
import { ConstantEnergyStrategy } from '../energy-strategies/constant-energy-strategy';

const PLANT_CONFIG = new InjectionToken<PlantConfig>('PLANT_CONFIG');

export interface PlantConfig {
	energy: {
		value: number;
	};
}

@Injectable()
export class PlantFactory extends AgentFactory<LivingAgent> {
	private static _counter = 0;

	private readonly _config = inject(PLANT_CONFIG);

	public create(): LivingAgent {
		const noneAction = new NoneAction();
		const actionsMap = new Map([[ActionType.None, noneAction]]);
		const behaviorStrategy = new StaticBehaviorStrategy(actionsMap, ActionType.None);

		return {
			id: `plant-${PlantFactory._counter++}`,
			type: AgentType.Plant,
			generation: 0,
			energyStrategy: new ConstantEnergyStrategy(this._config.energy.value),
			behaviorStrategy,
		};
	}
}
