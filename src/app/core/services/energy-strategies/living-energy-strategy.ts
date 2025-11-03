import { EnergyStrategy } from '../../models';

export class LivingEnergyStrategy implements EnergyStrategy {
	constructor(
		private _energy: number,
		private readonly _metabolismRate: number,
	) {}

	public get energy(): number {
		return this._energy;
	}

	public metabolize(): void {
		this.consumeEnergy(this._metabolismRate);
	}

	public addEnergy(value: number): void {
		this._energy += value;
	}

	public consumeEnergy(value: number): void {
		this._energy = Math.max(0, this._energy - value);
	}
}
