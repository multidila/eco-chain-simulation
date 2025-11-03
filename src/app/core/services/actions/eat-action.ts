import { AgentType } from '../../enums';
import { Action, Agent, Environment } from '../../models';

export class EatAction implements Action {
	constructor(
		private readonly _environment: Environment,
		private readonly _foodChain: Map<AgentType, Set<AgentType>>,
		private readonly _energyValues: Map<AgentType, number>,
	) {}

	public execute(agent: Agent): void {
		const targetAgent = this._environment.getAgentAhead(agent.id);
		if (!targetAgent) {
			return;
		}
		const canEat = this._foodChain.get(agent.type)?.has(targetAgent.type) ?? false;
		if (!canEat) {
			return;
		}
		const energyGained = this._energyValues.get(targetAgent.type) ?? 0;
		agent.energyStrategy.addEnergy(energyGained);
		this._environment.removeAgent(targetAgent.id);
	}
}
