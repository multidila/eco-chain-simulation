import { Inject, Injectable, InjectionToken, Injector } from '@angular/core';

import { AgentType } from '../../enums';
import { AgentFactory, LivingAgent, NeuralNetwork, ReproductionStrategy } from '../../models';
import { AGENT_FACTORIES } from '../../tokens';

export const ENERGY_THRESHOLD_REPRODUCTION_STRATEGY_CONFIG =
	new InjectionToken<EnergyThresholdReproductionStrategyConfig>('ENERGY_THRESHOLD_REPRODUCTION_STRATEGY_CONFIG');

export interface EnergyThresholdReproductionStrategyConfig {
	shareRate: number;
	threshold: number;
	mutationRate: number;
	mutationStrength: number;
}

@Injectable()
export class EnergyThresholdReproductionStrategy<TAgent extends LivingAgent = LivingAgent>
	implements ReproductionStrategy<TAgent>
{
	private _agentFactoriesCache?: Map<AgentType, AgentFactory>;

	constructor(
		@Inject(ENERGY_THRESHOLD_REPRODUCTION_STRATEGY_CONFIG)
		private readonly _config: EnergyThresholdReproductionStrategyConfig,
		private readonly _injector: Injector,
	) {}

	private get _agentFactories(): Map<AgentType, AgentFactory> {
		return (this._agentFactoriesCache ??= this._injector.get(AGENT_FACTORIES));
	}

	private _generateGaussian(mean: number, sigma: number): number {
		const u1 = Math.random();
		const u2 = Math.random();
		const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
		return mean + z0 * sigma;
	}

	private _mutateNeuralNetwork(neuralNetwork: NeuralNetwork): NeuralNetwork {
		const mutationRate = this._config.mutationRate;
		const mutationStrength = this._config.mutationStrength;
		const mutatedWeights = neuralNetwork.weights.map((outputWeights) =>
			outputWeights.map((weight) => {
				if (Math.random() < mutationRate) {
					const mutation = this._generateGaussian(0, mutationStrength);
					return weight + mutation;
				}
				return weight;
			}),
		);
		const mutatedBiases = neuralNetwork.biases.map((bias) => {
			if (Math.random() < mutationRate) {
				const mutation = this._generateGaussian(0, mutationStrength);
				return bias + mutation;
			}
			return bias;
		});
		return {
			inputs: [],
			outputs: [],
			weights: mutatedWeights,
			biases: mutatedBiases,
		};
	}

	public reproduce(parent: TAgent): TAgent | null {
		const energyStrategy = parent.energyStrategy;
		const currentEnergy = energyStrategy.energy;
		const reproductionEnergyThreshold = energyStrategy.maxEnergy * this._config.threshold;
		if (currentEnergy < reproductionEnergyThreshold) {
			return null;
		}

		const childEnergy = Math.floor(currentEnergy * this._config.shareRate);
		const remainingEnergy = currentEnergy - childEnergy;
		energyStrategy.consumeEnergy(remainingEnergy);

		const offspringAgent = this._agentFactories.get(parent.type)?.create() as TAgent | null;
		if (!offspringAgent) {
			return null;
		}
		offspringAgent.generation = parent.generation + 1;

		// Inherit and mutate parent's neural network (Lamarckian evolution)
		if (parent.neuralNetwork) {
			offspringAgent.neuralNetwork = this._mutateNeuralNetwork(parent.neuralNetwork);
		}

		offspringAgent.energyStrategy.consumeEnergy(offspringAgent.energyStrategy.energy);
		offspringAgent.energyStrategy.addEnergy(childEnergy);
		return offspringAgent;
	}
}
