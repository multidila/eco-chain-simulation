import { NeuralNetwork } from '../neural-network.model';
import { EnergyStrategy, ReproductionStrategy } from '../strategies';
import { Agent } from './agent.model';

export interface LivingAgent extends Agent {
	age: number;
	generation: number;
	neuralNetwork?: NeuralNetwork;
	readonly energyStrategy: EnergyStrategy;
	readonly reproductionStrategy?: ReproductionStrategy;
}
