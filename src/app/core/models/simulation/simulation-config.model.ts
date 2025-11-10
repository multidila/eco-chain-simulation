import { AgentType } from '../../enums';

export interface SimulationAgentConfig {
	type: AgentType;
	amount: number;
}

export interface SimulationConfig<TEnvironmentConfig = unknown> {
	agents: SimulationAgentConfig[];
	environment: TEnvironmentConfig;
}
