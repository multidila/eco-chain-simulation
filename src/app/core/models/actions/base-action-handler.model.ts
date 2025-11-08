import { Agent } from '../agents';
import { Action } from './action.model';

export abstract class BaseActionHandler<TAgent extends Agent = Agent> implements Action<TAgent> {
	protected nextActionHandler: Action<TAgent> | null = null;

	public setNext(actionHandler: Action<TAgent>): Action<TAgent> {
		this.nextActionHandler = actionHandler;
		return this.nextActionHandler;
	}

	protected abstract innerExecute(agent: TAgent): void;

	public execute(agent: TAgent): void {
		this.innerExecute(agent);
		if (this.nextActionHandler) {
			this.nextActionHandler.execute(agent);
		}
	}
}
