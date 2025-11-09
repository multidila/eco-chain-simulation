export interface SimulationConfigParams {
	iterations: number;
}

export interface EnvironmentParams {
	gridSize: number;
	seed: number;
}

export interface AgentEnergyParams {
	initial: number;
	max: number;
	metabolismRate: number;
}

export interface AgentReproductionParams {
	threshold: number;
	shareRate: number;
}

export interface PlantParams {
	count: number;
	energy: Omit<AgentEnergyParams, 'metabolismRate'>;
}

export interface HerbivoreParams {
	count: number;
	energy: AgentEnergyParams;
	reproduction: AgentReproductionParams;
}

export interface CarnivoreParams {
	count: number;
	energy: AgentEnergyParams;
	reproduction: AgentReproductionParams;
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
