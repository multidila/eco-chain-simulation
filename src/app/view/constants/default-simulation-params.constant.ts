import { AgentType } from '../../core/enums';
import { SimulationParams } from '../models/simulation-params.model';

export const DEFAULT_SIMULATION_PARAMS: SimulationParams = {
	simulation: { iterations: 50, delay: 100 },
	environment: { gridSize: 30 },
	agents: {
		plant: { count: 500, energy: { initial: 80, max: 100 } },
		herbivore: {
			count: 50,
			energy: { initial: 80, max: 100, metabolismRate: 2 },
			reproduction: { threshold: 0.9, shareRate: 0.5, mutationRate: 0.1, mutationStrength: 0.2 },
			nutrition: {
				[AgentType.Plant]: 10,
			},
		},
		carnivore: {
			count: 25,
			energy: { initial: 40, max: 100, metabolismRate: 1 },
			reproduction: { threshold: 0.9, shareRate: 0.5, mutationRate: 0.1, mutationStrength: 0.2 },
			nutrition: {
				[AgentType.Herbivore]: 20,
			},
		},
	},
};
