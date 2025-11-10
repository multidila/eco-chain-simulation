import { inject, Injectable, Injector } from '@angular/core';

import { AgentType } from '../../enums';
import { AgentFactory, LivingAgent } from '../../models';
import { ActionChainBehaviorStrategy } from '../behavior-strategies';
import { LivingEnergyStrategy } from '../energy-strategies/living-energy-strategy';
import { EnergyThresholdReproductionStrategy } from '../reproduction-strategies';
import { CarnivoreConfig } from './carnivore-config.model';

@Injectable()
export class CarnivoreFactory extends AgentFactory<LivingAgent> {
	private static _counter = 0;

	private readonly _injector = inject(Injector);

	public create(): LivingAgent {
		const config = CarnivoreConfig.instance;
		return {
			id: `carnivore-${CarnivoreFactory._counter++}`,
			type: AgentType.Carnivore,
			generation: 0,
			energyStrategy: new LivingEnergyStrategy(
				config.energy.value,
				config.energy.maxValue,
				config.energy.metabolismRate,
			),
			behaviorStrategy: new ActionChainBehaviorStrategy(config.behavior.actions),
			reproductionStrategy: new EnergyThresholdReproductionStrategy(config.reproduction, this._injector),
		};
	}
}
