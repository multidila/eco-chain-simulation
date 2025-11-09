import { Agent, BaseActionHandler, Environment } from '../../models';

export class MoveForwardAction extends BaseActionHandler<Agent> {
	constructor(private readonly _environment: Environment) {
		super();
	}

	public execute(agent: Agent): void {
		this._environment.moveAgent(agent.id);
		return this.nextActionHandler?.execute(agent);
	}
}
