import { Action, Agent } from '../../models';

export class NoneAction implements Action {
	public execute(agent: Agent): void {}
}
