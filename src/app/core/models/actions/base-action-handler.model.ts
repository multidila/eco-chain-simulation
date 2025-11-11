import { Agent } from '../agents';
import { Action } from './action.model';

export abstract class BaseActionHandler<TAgent extends Agent = Agent> implements Action<TAgent> {
	protected nextActionHandler: BaseActionHandler<TAgent> | null = null;

	public setNext(actionHandler: BaseActionHandler<TAgent>): BaseActionHandler<TAgent> {
		this.nextActionHandler = actionHandler;
		return this.nextActionHandler;
	}

	public abstract execute(agent: TAgent): void;
}
