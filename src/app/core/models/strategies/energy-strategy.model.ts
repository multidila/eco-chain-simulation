export interface EnergyStrategy {
	get energy(): number;
	get maxEnergy(): number;
	metabolize(): void;
	addEnergy(value: number): void;
	consumeEnergy(value: number): void;
}
