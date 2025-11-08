import { AgentType } from '../../enums';
import { BaseActionHandler, Environment, LivingAgent } from '../../models';

export class EatAction extends BaseActionHandler<LivingAgent> {
	constructor(
		private readonly _environment: Environment,
		private readonly _foodChain: Map<AgentType, Set<AgentType>>,
		private readonly _energyValues: Map<AgentType, number>,
	) {
		super();
	}

	public innerExecute(agent: LivingAgent): void {
		const agentsAhead = this._environment.getAgentsAhead(agent.id);
		if (!agentsAhead.length) {
			return;
		}
		const targetAgents = agentsAhead.filter(
			(targetAgent) => this._foodChain.get(agent.type)?.has(targetAgent.type) ?? false,
		);
		for (const targetAgent of targetAgents) {
			const energyGained = this._energyValues.get(targetAgent.type) ?? 0;
			agent.energyStrategy.addEnergy(energyGained);
			this._environment.removeAgent(targetAgent.id);
		}
	}
}
