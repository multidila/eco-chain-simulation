import { BaseActionHandler, Environment, LivingAgent } from '../../models';

export class DieAction extends BaseActionHandler<LivingAgent> {
	constructor(private readonly _environment: Environment) {
		super();
	}

	public innerExecute(agent: LivingAgent): void {
		if (agent.energyStrategy.energy <= 0) {
			this._environment.removeAgent(agent.id);
		}
	}
}
