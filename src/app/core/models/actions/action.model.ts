import type { Agent } from '../agents';

export interface Action {
	execute(agent: Agent): void;
}
