import { BaseActionHandler, LivingAgent } from '../../models';

export class MetabolizeAction extends BaseActionHandler<LivingAgent> {
	public innerExecute(agent: LivingAgent): void {
		agent.energyStrategy.metabolize();
	}
}
