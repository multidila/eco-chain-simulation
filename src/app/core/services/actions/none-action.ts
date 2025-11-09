import { Agent, BaseActionHandler } from '../../models';

export class NoneAction extends BaseActionHandler<Agent> {
	public execute(agent: Agent): void {}
}
