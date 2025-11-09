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
