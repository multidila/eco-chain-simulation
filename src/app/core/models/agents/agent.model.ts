import { AgentType } from '../../enums';
import { BehaviorStrategy, EnergyStrategy } from '../strategies';

export class Agent {
	constructor(
		public readonly id: string,
		public readonly type: AgentType,
		public readonly age: number,
		public readonly generation: number,
		public readonly energyStrategy: EnergyStrategy,
		public readonly behaviorStrategy: BehaviorStrategy,
	) {}

	public isDead(): boolean {
		return this.energyStrategy.energy <= 0;
	}
}
