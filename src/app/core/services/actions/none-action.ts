import { Agent, BaseActionHandler } from '../../models';

export class NoneAction extends BaseActionHandler<Agent> {
	public innerExecute(agent: Agent): void {}
}
