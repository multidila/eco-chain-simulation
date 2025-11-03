import { Action, Agent, Environment } from '../../models';

export class MoveForwardAction implements Action {
	constructor(private readonly _environment: Environment) {}

	public execute(agent: Agent): void {
		this._environment.moveAgent(agent.id);
	}
}
