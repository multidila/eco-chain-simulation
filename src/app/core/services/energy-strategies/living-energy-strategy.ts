import { EnergyStrategy } from '../../models';

export class LivingEnergyStrategy implements EnergyStrategy {
	constructor(
		private _energy: number,
		private readonly _maxEnergy: number,
		private readonly _metabolismRate: number,
	) {}

	public get energy(): number {
		return this._energy;
	}

	public get maxEnergy(): number {
		return this._maxEnergy;
	}

	public get metabolismRate(): number {
		return this._metabolismRate;
	}

	public metabolize(): void {
		this.consumeEnergy(this._metabolismRate);
	}

	public addEnergy(value: number): void {
		this._energy = Math.min(this._maxEnergy, this._energy + value);
	}

	public consumeEnergy(value: number): void {
		this._energy = Math.max(0, this._energy - value);
	}
}
