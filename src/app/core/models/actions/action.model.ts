import type { Agent } from '../agents';

export interface Action<TAgent extends Agent = Agent> {
	execute(agent: TAgent): void;
}
