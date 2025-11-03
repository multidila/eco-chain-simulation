export interface EnergyStrategy {
	get energy(): number;
	metabolize(): void;
	addEnergy(value: number): void;
	consumeEnergy(value: number): void;
}
