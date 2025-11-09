import { Action, Agent, BehaviorStrategy } from '../../models';

export class ActionChainBehaviorStrategy<TAgent extends Agent = Agent> extends BehaviorStrategy<TAgent> {
	constructor(private readonly _actionChain: Action<TAgent>) {
		super();
	}

	public act(): void {
		this._actionChain.execute(this.agent);
	}
}
