import { AgentType } from '../../enums';
// eslint-disable-next-line import/no-cycle
import { BehaviorStrategy } from '../strategies/';

export interface Agent {
	readonly id: string;
	readonly type: AgentType;
	readonly behaviorStrategy: BehaviorStrategy;
}
