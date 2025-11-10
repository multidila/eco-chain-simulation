import { SimulationParams } from '../models/simulation-params.model';

export const DEFAULT_SIMULATION_PARAMS: SimulationParams = {
	simulation: { iterations: 50, delay: 100 },
	environment: { gridSize: 50, seed: 42 },
	agents: {
		plant: { count: 100, energy: { initial: 100, max: 100 } },
		herbivore: {
			count: 50,
			energy: { initial: 50, max: 100, metabolismRate: 2 },
			reproduction: { threshold: 0.9, shareRate: 0.5 },
		},
		carnivore: {
			count: 25,
			energy: { initial: 75, max: 150, metabolismRate: 1 },
			reproduction: { threshold: 0.9, shareRate: 0.5 },
		},
	},
};
