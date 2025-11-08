import { DirectionType } from '../../enums';
import { Agent, BaseActionHandler, Environment } from '../../models';

export class RotateAction extends BaseActionHandler {
	constructor(
		private readonly _environment: Environment,
		private readonly _rotationMap: Map<DirectionType, DirectionType>,
	) {
		super();
	}

	public innerExecute(agent: Agent): void {
		const currentDirection = this._environment.getAgentDirection(agent.id);
		if (!currentDirection) {
			return;
		}
		const newDirection = this._rotationMap.get(currentDirection);
		if (!newDirection) {
			throw new Error(`No rotation mapping found for direction: ${currentDirection}`);
		}
		this._environment.rotateAgent(agent.id, newDirection);
	}
}
