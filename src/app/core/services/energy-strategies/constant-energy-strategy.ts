import { EnergyStrategy } from '../../models';

export class ConstantEnergyStrategy implements EnergyStrategy {
	public get energy(): number {
		return this._energy;
	}

	public get maxEnergy(): number {
		return this._energy;
	}

	constructor(private readonly _energy: number) {}

	public metabolize(): void {}

	public addEnergy(value: number): void {}

	public consumeEnergy(value: number): void {}
}
