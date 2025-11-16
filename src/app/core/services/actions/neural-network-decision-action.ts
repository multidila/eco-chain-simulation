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
			inputs.push(sensors.agentsAhead.get(agentType)?.length || 0);
		}
		for (const agentType of this._agentMapping) {
			inputs.push(sensors.agentsLeft.get(agentType)?.length || 0);
		}
		for (const agentType of this._agentMapping) {
			inputs.push(sensors.agentsRight.get(agentType)?.length || 0);
		}
		for (const agentType of this._agentMapping) {
			inputs.push(sensors.agentsNearby.get(agentType)?.length || 0);
		}
		return inputs;
	}

	private _softmax(logits: number[]): number[] {
		const maxLogit = Math.max(...logits);
		const exps = logits.map((x) => Math.exp(x - maxLogit));
		const sumExps = exps.reduce((a, b) => a + b, 0) + 1e-12; // Add epsilon to avoid division by zero
		return exps.map((exp) => exp / sumExps);
	}

	private _feedForward(neuralNetwork: NeuralNetwork, inputs: number[]): number[] {
		neuralNetwork.inputs = inputs;
		const logits: number[] = [];
		for (let i = 0; i < neuralNetwork.weights.length; i++) {
			let sum = neuralNetwork.biases[i];
			for (let j = 0; j < inputs.length; j++) {
				sum += inputs[j] * neuralNetwork.weights[i][j];
			}
			logits.push(sum);
		}
		neuralNetwork.outputs = this._softmax(logits);
		return neuralNetwork.outputs;
	}

	private _selectAction(outputs: number[]): Action {
		let maxIndex = 0;
		let maxValue = outputs[0];
		for (let i = 1; i < outputs.length; i++) {
			if (outputs[i] > maxValue) {
				maxValue = outputs[i];
				maxIndex = i;
			}
		}
		const actionType = this._actionMapping[maxIndex];
		const action = this._actions.get(actionType);
		if (!action) {
			throw new Error(`No valid action found for index ${maxIndex}`);
		}
		return action;
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
