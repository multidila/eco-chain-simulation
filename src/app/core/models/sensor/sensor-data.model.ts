import { AgentType } from '../../enums';
import { Agent } from '../agents';

export interface SensorData {
	agentsAhead: Map<AgentType, Agent[]>;
	agentsLeft: Map<AgentType, Agent[]>;
	agentsRight: Map<AgentType, Agent[]>;
	agentsNearby: Map<AgentType, Agent[]>;
}
