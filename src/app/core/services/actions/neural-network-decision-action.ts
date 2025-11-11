import { ActionType, AgentType } from '../../enums';
import { Action, BaseActionHandler, Environment, LivingAgent, NeuralNetwork, Sensor, SensorData } from '../../models';

export class NeuralNetworkDecisionAction extends BaseActionHandler<LivingAgent> {
	constructor(
		private readonly _actions: Map<ActionType, Action>,
		private readonly _agentMapping: AgentType[],
		private readonly _actionMapping: ActionType[],
		private readonly _sensor: Sensor,
		private readonly _environment: Environment,
	) {
		super();
	}

	private _convertSensorsToInputs(sensors: SensorData): number[] {
		const inputs: number[] = [];
		for (const agentType of this._agentMapping) {
			inputs.push(sensors.agentsAhead.get(agentType) || 0);
		}
		for (const agentType of this._agentMapping) {
			inputs.push(sensors.agentsLeft.get(agentType) || 0);
		}
		for (const agentType of this._agentMapping) {
			inputs.push(sensors.agentsRight.get(agentType) || 0);
		}
		for (const agentType of this._agentMapping) {
			inputs.push(sensors.agentsNearby.get(agentType) || 0);
		}
		return inputs;
	}

	private _feedForward(neuralNetwork: NeuralNetwork, inputs: number[]): number[] {
		neuralNetwork.inputs = inputs;
		const hiddenOutputs: number[] = [];
		for (let i = 0; i < neuralNetwork.weights.length; i++) {
			let sum = neuralNetwork.biases[i];
			for (let j = 0; j < inputs.length; j++) {
				sum += inputs[j] * neuralNetwork.weights[i][j];
			}
			hiddenOutputs.push(Math.tanh(sum));
		}
		neuralNetwork.outputs = hiddenOutputs;
		return hiddenOutputs;
	}

	private _selectAction(outputs: number[]): Action {
		const sortedIndices = outputs
			.map((value, index) => ({ value, index }))
			.sort((a, b) => b.value - a.value)
			.map((item) => item.index);
		for (const index of sortedIndices) {
			const actionType = this._actionMapping[index];
			if (!actionType) {
				continue;
			}
			const action = this._actions.get(actionType);
			if (action) {
				return action;
			}
		}
		throw new Error('No valid action found in neural network outputs');
	}

	public execute(agent: LivingAgent): void {
		if (!agent.neuralNetwork) {
			return this.nextActionHandler?.execute(agent);
		}
		const sensorData = this._sensor.getSensorData(agent, this._environment);
		const inputs = this._convertSensorsToInputs(sensorData);
		const outputs = this._feedForward(agent.neuralNetwork, inputs);
		this._selectAction(outputs).execute(agent);
		return this.nextActionHandler?.execute(agent);
	}
}
