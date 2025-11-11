import { Injectable } from '@angular/core';

import { AgentType } from '../../enums';
import { AgentFactory, LivingAgent } from '../../models';
import { ActionChainBehaviorStrategy } from '../behavior-strategies';
import { PlantConfig } from './plant-config.model';
import { ConstantEnergyStrategy } from '../energy-strategies/constant-energy-strategy';

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
			energyStrategy: new ConstantEnergyStrategy(config.energy.value),
			behaviorStrategy: new ActionChainBehaviorStrategy(config.behavior.actions),
		};
	}
}
