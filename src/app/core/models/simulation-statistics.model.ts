import { AgentType } from '../enums';

export interface PopulationData {
	iteration: number;
	plantCount: number;
	herbivoreCount: number;
	carnivoreCount: number;
}

export interface AgentTypeStatistics {
	maxAge: number;
	reproductionCount: number;
}

export interface SimulationStatistics {
	currentIteration: number;
	populationHistory: PopulationData[];
	statistics: Map<AgentType, AgentTypeStatistics>;
}
