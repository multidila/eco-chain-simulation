import { Injectable } from '@angular/core';

import { Agent } from './agent.model';

@Injectable()
export abstract class AgentFactory<TAgent extends Agent = Agent> {
	public abstract create(): TAgent;
}
