import { BaseActionHandler, Environment, LivingAgent } from '../../models';

export class ReproduceAction extends BaseActionHandler<LivingAgent> {
	constructor(private readonly _environment: Environment) {
		super();
	}

	public execute(agent: LivingAgent): void {
		const offspring = agent.reproductionStrategy?.reproduce(agent);
		if (offspring) {
			this._environment.addAgent(offspring);
		}
		return this.nextActionHandler?.execute(agent);
	}
}
