import { inject, Injectable, InjectionToken } from '@angular/core';

import { LivingAgent, ReproductionStrategy } from '../../models';
import { AGENT_FACTORIES } from '../../tokens';

export const ENERGY_THRESHOLD_REPRODUCTION_STRATEGY_CONFIG =
	new InjectionToken<EnergyThresholdReproductionStrategyConfig>('ENERGY_THRESHOLD_REPRODUCTION_STRATEGY_CONFIG');

export interface EnergyThresholdReproductionStrategyConfig {
	shareRate: number;
	threshold: number;
}

@Injectable()
export class EnergyThresholdReproductionStrategy<TAgent extends LivingAgent = LivingAgent>
	implements ReproductionStrategy<TAgent>
{
	private readonly _config = inject(ENERGY_THRESHOLD_REPRODUCTION_STRATEGY_CONFIG);
	private readonly _agentFactories = inject(AGENT_FACTORIES);

	public reproduce(parent: TAgent): TAgent | null {
		const energyStrategy = parent.energyStrategy;
		const currentEnergy = energyStrategy.energy;
		const reproductionEnergyThreshold = energyStrategy.maxEnergy * this._config.threshold;
		if (currentEnergy < reproductionEnergyThreshold) {
			return null;
		}

		const childEnergy = currentEnergy * this._config.shareRate;
		const remainingEnergy = currentEnergy - childEnergy;
		energyStrategy.consumeEnergy(remainingEnergy);

		const offspringAgent = this._agentFactories.get(parent.type)?.create() as TAgent | null;
		if (!offspringAgent) {
			return null;
		}
		offspringAgent.generation = parent.generation + 1;
		offspringAgent.energyStrategy.consumeEnergy(offspringAgent.energyStrategy.energy);
		offspringAgent.energyStrategy.addEnergy(childEnergy);
		return offspringAgent;
	}
}
