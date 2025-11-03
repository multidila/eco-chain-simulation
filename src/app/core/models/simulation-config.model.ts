export interface SimulationConfig {
	gridSize: number;
	initialPlantCount: number;
	initialHerbivoreCount: number;
	initialCarnivoreCount: number;
	herbivoreEnergyConsumption: number;
	carnivoreEnergyConsumption: number;
	plantEnergyValue: number;
	herbivoreEnergyValue: number;
	reproductionEnergyThreshold: number;
	mutationRate: number;
	maxEnergy: number;
}
