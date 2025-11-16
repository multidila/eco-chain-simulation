import { Injectable } from '@angular/core';

import { AgentType } from '../../enums';
import { AgentFactory, LivingAgent } from '../../models';
import { ActionChainBehaviorStrategy } from '../behavior-strategies';
import { PlantConfig } from './plant-config.model';
import { LivingEnergyStrategy } from '../energy-strategies';

@Injectable()
export class PlantFactory extends AgentFactory<LivingAgent> {
	private static _counter = 0;

	public create(): LivingAgent {
		const config = PlantConfig.instance;
		return {
			id: `plant-${PlantFactory._counter++}`,
			type: AgentType.Plant,
			age: 0,
			generation: 0,
			energyStrategy: new LivingEnergyStrategy(
				config.energy.value,
				config.energy.maxValue,
				config.energy.metabolismRate,
			),
			behaviorStrategy: new ActionChainBehaviorStrategy(config.behavior.actions),
		};
	}
}
