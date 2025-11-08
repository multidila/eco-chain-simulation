import { Agent } from '../agents';

export interface SimulationState {
	agents: Map<string, Agent>;
	iteration: number;
}
