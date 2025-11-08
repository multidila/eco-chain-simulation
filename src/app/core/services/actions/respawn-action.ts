import { AgentType } from '../../enums';
import { AgentFactory, BaseActionHandler, Environment, LivingAgent } from '../../models';

export class RespawnAction extends BaseActionHandler<LivingAgent> {
	constructor(
		private readonly _environment: Environment,
		private readonly _agentFactories: Map<AgentType, AgentFactory>,
	) {
		super();
	}

	public innerExecute(agent: LivingAgent): void {
		if (agent.energyStrategy.energy > 0) {
			return;
		}
		this._environment.removeAgent(agent.id);
		const newAgent = this._agentFactories.get(agent.type)?.create();
		if (newAgent) {
			this._environment.addAgent(newAgent);
		}
	}
}
