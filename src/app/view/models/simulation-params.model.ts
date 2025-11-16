import { AgentType } from '../../core/enums';

export interface SimulationConfigParams {
	iterations: number;
	delay: number;
}

export interface EnvironmentParams {
	gridSize: number;
}

export interface AgentEnergyParams {
	initial: number;
	max: number;
	metabolismRate: number;
}

export interface AgentReproductionParams {
	threshold: number;
	shareRate: number;
	mutationRate: number;
	mutationStrength: number;
}

export type AgentNutritionParams = Partial<Record<AgentType, number>>;

export interface PlantParams {
	count: number;
	energy: AgentEnergyParams;
}

export interface HerbivoreParams {
	count: number;
	energy: AgentEnergyParams;
	reproduction: AgentReproductionParams;
	nutrition: AgentNutritionParams;
}

export interface CarnivoreParams {
	count: number;
	energy: AgentEnergyParams;
	reproduction: AgentReproductionParams;
	nutrition: AgentNutritionParams;
}

export interface AgentsParams {
	plant: PlantParams;
	herbivore: HerbivoreParams;
	carnivore: CarnivoreParams;
}

export interface SimulationParams {
	simulation: SimulationConfigParams;
	environment: EnvironmentParams;
	agents: AgentsParams;
}
