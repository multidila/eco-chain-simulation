import { BaseActionHandler, LivingAgent } from '../../models';

export class MetabolizeAction extends BaseActionHandler<LivingAgent> {
	public execute(agent: LivingAgent): void {
		agent.energyStrategy.metabolize();
		return this.nextActionHandler?.execute(agent);
	}
}
