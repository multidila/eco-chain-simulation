import { AgentType } from '../../enums';
import { BehaviorStrategy } from '../strategies';

export interface Agent {
	readonly id: string;
	readonly type: AgentType;
	readonly behaviorStrategy: BehaviorStrategy;
}
