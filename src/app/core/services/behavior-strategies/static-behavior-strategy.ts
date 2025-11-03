import { ActionType } from '../../enums';
import { Action, BehaviorStrategy, SensorData } from '../../models';

export class StaticBehaviorStrategy implements BehaviorStrategy {
	constructor(
		private readonly _actions: Map<ActionType, Action>,
		private readonly _actionType: ActionType,
	) {}

	public decide(sensors: SensorData): Action {
		const action = this._actions.get(this._actionType);
		if (!action) {
			throw new Error(`Action not found for type: ${this._actionType}`);
		}
		return action;
	}
}
