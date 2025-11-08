import { EnergyStrategy, ReproductionStrategy } from '../strategies';
import { Agent } from './agent.model';

export interface LivingAgent extends Agent {
	generation: number;
	readonly energyStrategy: EnergyStrategy;
	readonly reproductionStrategy: ReproductionStrategy;
}
