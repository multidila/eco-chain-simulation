import { BaseActionHandler, LivingAgent } from '../../models';

export class GrowthAction extends BaseActionHandler<LivingAgent> {
	public execute(agent: LivingAgent): void {
		agent.age++;
		return this.nextActionHandler?.execute(agent);
	}
}
