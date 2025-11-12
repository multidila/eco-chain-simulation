import { Agent } from '../../core';

export class AgentView {
	public readonly id: string;
	public readonly type: string;

	constructor(agent: Agent) {
		this.id = agent.id;
		this.type = agent.type;
	}
}
