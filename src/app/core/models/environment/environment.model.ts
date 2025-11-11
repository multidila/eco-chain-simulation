import { Injectable } from '@angular/core';

import type { DirectionType } from '../../enums';
import type { Agent } from '../agents/agent.model';

@Injectable()
export abstract class Environment<TConfig = unknown> {
	public abstract init(config: TConfig): void;
	public abstract getAllAgents(): Agent[];
	public abstract getAgentsAhead(agentId: string): Agent[];
	public abstract getAgentDirection(agentId: string): DirectionType | null;
	public abstract addAgent(agent: Agent, direction?: DirectionType): void;
	public abstract moveAgent(agentId: string): void;
	public abstract removeAgent(agentId: string): void;
	public abstract rotateAgent(agentId: string, direction: DirectionType): void;
}
