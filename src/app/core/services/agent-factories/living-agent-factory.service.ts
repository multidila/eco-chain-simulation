import { AgentFactory, LivingAgent, NeuralNetwork } from '../../models';

export abstract class LivingAgentFactory extends AgentFactory<LivingAgent> {
	protected createRandomNeuralNetwork(): NeuralNetwork {
		const numInputs = 12; // 3 agent types × 4 regions
		const numOutputs = 4; // 4 actions
		return {
			inputs: [],
			outputs: [],
			weights: Array.from({ length: numOutputs }, () =>
				Array.from({ length: numInputs }, () => Math.random() * 2 - 1),
			),
			biases: Array.from({ length: numOutputs }, () => Math.random() * 2 - 1),
		};
	}
}
