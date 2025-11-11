import { AgentType } from '../../enums';
import { BaseActionHandler, Environment, LivingAgent } from '../../models';

export class EatAction extends BaseActionHandler<LivingAgent> {
	constructor(
		private readonly _environment: Environment,
		private readonly _foodChain: Map<AgentType, Set<AgentType>>,
		private readonly _getEnergyValue: (agentType: AgentType) => number,
	) {
		super();
	}

	public execute(agent: LivingAgent): void {
		const agentsAhead = this._environment.getAgentsAhead(agent.id);
		if (!agentsAhead.length) {
			return this.nextActionHandler?.execute(agent);
		}
		const targetAgents = agentsAhead.filter(
			(targetAgent) => this._foodChain.get(agent.type)?.has(targetAgent.type) ?? false,
		);
		for (const targetAgent of targetAgents) {
			const energyGained = this._getEnergyValue(targetAgent.type);
			agent.energyStrategy.addEnergy(energyGained);
			this._environment.removeAgent(targetAgent.id);
		}
		return this.nextActionHandler?.execute(agent);
	}
}
