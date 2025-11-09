import { BaseActionHandler, Environment, LivingAgent } from '../../models';

export class DieAction extends BaseActionHandler<LivingAgent> {
	constructor(private readonly _environment: Environment) {
		super();
	}

	public execute(agent: LivingAgent): void {
		if (agent.energyStrategy.energy > 0) {
			return this.nextActionHandler?.execute(agent);
		}
		this._environment.removeAgent(agent.id);
	}
}
