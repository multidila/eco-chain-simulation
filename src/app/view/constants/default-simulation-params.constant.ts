import { AgentType } from '../../core/enums';
import { SimulationParams } from '../models/simulation-params.model';

export const DEFAULT_SIMULATION_PARAMS: SimulationParams = {
	simulation: { iterations: 50, delay: 100 },
	environment: { gridSize: 30 },
	agents: {
		plant: {
			count: 600,
			energy: {
				initial: 100,
				max: 100,
				metabolismRate: 0,
			},
		},
		herbivore: {
			count: 100,
			energy: { initial: 80, max: 100, metabolismRate: 2 },
			reproduction: { threshold: 0.9, shareRate: 0.5, mutationRate: 0.9, mutationStrength: 0.1 },
			nutrition: {
				[AgentType.Plant]: 10,
			},
		},
		carnivore: {
			count: 40,
			energy: { initial: 40, max: 100, metabolismRate: 1 },
			reproduction: { threshold: 0.9, shareRate: 0.5, mutationRate: 0.9, mutationStrength: 0.1 },
			nutrition: {
				[AgentType.Herbivore]: 20,
			},
		},
	},
};
