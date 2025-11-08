import { AgentType } from '../../enums';

export interface SensorData {
	agentsAhead: Map<AgentType, number>;
	agentsLeft: Map<AgentType, number>;
	agentsRight: Map<AgentType, number>;
	agentsNearby: Map<AgentType, number>;
}
