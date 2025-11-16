import { AgentFactory, LivingAgent, NeuralNetwork } from '../../models';

export abstract class LivingAgentFactory extends AgentFactory<LivingAgent> {
	/**
	 * Generates random weight using Box-Muller transform for Gaussian distribution
	 * μ = 0, σ = 0.1
	 *
	 * @returns Random weight from Gaussian distribution
	 */
	private _generateGaussianWeight(): number {
		// Box-Muller transform to generate Gaussian random numbers
		const u1 = Math.random();
		const u2 = Math.random();
		const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
		// Scale to desired mean (0) and stddev (0.1)
		return z0 * 0.1;
	}

	protected createRandomNeuralNetwork(): NeuralNetwork {
		const numInputs = 12; // 3 agent types × 4 regions
		const numOutputs = 4; // 4 actions
		return {
			inputs: [],
			outputs: [],
			weights: Array.from({ length: numOutputs }, () =>
				Array.from({ length: numInputs }, () => this._generateGaussianWeight()),
			),
			biases: Array.from({ length: numOutputs }, () => 0),
		};
	}
}
