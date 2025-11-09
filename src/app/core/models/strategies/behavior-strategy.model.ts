import { Injectable } from '@angular/core';

// eslint-disable-next-line import/no-cycle
import { Agent } from '../agents/agent.model';

@Injectable()
export abstract class BehaviorStrategy<TAgent extends Agent = Agent> {
	protected agent!: TAgent;

	public setAgent(agent: TAgent): void {
		this.agent = agent;
	}

	public abstract act(): void;
}
