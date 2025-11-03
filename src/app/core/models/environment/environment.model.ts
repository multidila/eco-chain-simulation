import type { DirectionType } from '../../enums';
import type { Agent } from '../agents/agent.model';

export interface Environment {
	getAgentAhead(agentId: string): Agent | null;
	getAgentDirection(agentId: string): DirectionType | null;
	moveAgent(agentId: string): void;
	removeAgent(agentId: string): void;
	rotateAgent(agentId: string, direction: DirectionType): void;
}
