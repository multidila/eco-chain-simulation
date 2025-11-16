import { AgentType } from '../../enums';
import { BaseActionHandler, Environment, LivingAgent, Sensor } from '../../models';

export class EatAction extends BaseActionHandler<LivingAgent> {
	constructor(
		private readonly _sensor: Sensor,
		private readonly _environment: Environment,
		private readonly _foodChain: Map<AgentType, Set<AgentType>>,
		private readonly _getEnergyValue: (agentType: AgentType) => number,
	) {
		super();
	}

	public execute(agent: LivingAgent): void {
		const sensorData = this._sensor.getSensorData(agent, this._environment);
		const nearbyAgents = Array.from(sensorData.agentsNearby.values()).flat();
		if (!nearbyAgents.length) {
			return this.nextActionHandler?.execute(agent);
		}
		const targetAgent = nearbyAgents.find(
			(a) => this._foodChain.get(agent.type)?.has(a.type) ?? false,
		) as LivingAgent;
		if (targetAgent) {
			const energyGained = this._getEnergyValue(targetAgent.type);
			agent.energyStrategy.addEnergy(energyGained);
			targetAgent.energyStrategy.consumeEnergy(targetAgent.energyStrategy.energy);
		}
		return this.nextActionHandler?.execute(agent);
	}
}
