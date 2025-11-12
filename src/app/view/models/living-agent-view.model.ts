import { AgentView } from './agent-view.model';
import { LivingAgent } from '../../core';

export class LivingAgentView extends AgentView {
	public readonly age: number;
	public readonly generation: number;
	public readonly currentEnergy: number;
	public readonly maxEnergy: number;

	constructor(agent: LivingAgent) {
		super(agent);
		this.age = agent.age;
		this.generation = agent.generation;
		this.currentEnergy = agent.energyStrategy.energy;
		this.maxEnergy = agent.energyStrategy.maxEnergy;
	}
}
