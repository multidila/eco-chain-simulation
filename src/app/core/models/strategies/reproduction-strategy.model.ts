import type { LivingAgent } from '../agents';

export interface ReproductionStrategy<TAgent extends LivingAgent = LivingAgent> {
	reproduce(parent: TAgent): TAgent | null;
}
