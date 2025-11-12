import { Type } from '@angular/core';

import { AgentView } from './agent-view.model';
import { LivingAgentView } from './living-agent-view.model';
import { AgentType, SimulationState } from '../../core';

const AGENT_VIEWS_CREATORS = new Map<AgentType, Type<AgentView>>([
	[AgentType.Plant, LivingAgentView],
	[AgentType.Herbivore, LivingAgentView],
	[AgentType.Carnivore, LivingAgentView],
]);

export class SimulationStateView {
	public readonly agents: Map<string, AgentView>;
	public readonly iteration: number;

	constructor(simulationState: SimulationState) {
		this.agents = new Map(
			[...simulationState.agents.entries()].map(([key, value]) => [
				key,
				new (AGENT_VIEWS_CREATORS.get(value.type) ?? AgentView)(value),
			]),
		);
		this.iteration = simulationState.iteration;
	}
}
