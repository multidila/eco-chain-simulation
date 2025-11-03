import { SimulationConfig } from '../models';

export const DEFAULT_SIMULATION_CONFIG: SimulationConfig = {
	gridSize: 100,
	initialPlantCount: 1000,
	initialHerbivoreCount: 50,
	initialCarnivoreCount: 50,
	herbivoreEnergyConsumption: 2,
	carnivoreEnergyConsumption: 1,
	plantEnergyValue: 10,
	herbivoreEnergyValue: 20,
	reproductionEnergyThreshold: 0.9,
	mutationRate: 0.1,
	maxEnergy: 100,
};

export const NEURAL_NETWORK_CONFIG = {
	inputCount: 12,
	outputCount: 4,
	weightRange: { min: -1, max: 1 },
	biasRange: { min: -1, max: 1 },
} as const;

export const SENSOR_CONFIG = {
	proximityRadius: 1,
	frontDistance: 5,
} as const;

export const POPULATION_LIMITS = {
	herbivoreMin: 0.25,
	herbivoreMax: 0.5,
	carnivoreMin: 0.25,
	carnivoreMax: 0.5,
} as const;
