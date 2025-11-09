import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { interval, Subject, takeUntil, takeWhile } from 'rxjs';

import { SimulationStatus } from '../core/enums';
import { SimulationState } from '../core/models';
import { SimulationEngine } from '../core/services';
import { ControlPanelComponent } from './components/control-panel/control-panel.component';
import { SimulationVisualizationComponent } from './components/simulation-visualization/simulation-visualization.component';
import { DEFAULT_SIMULATION_PARAMS } from './constants';
import { SimulationParams } from './models/simulation-params.model';

@Component({
	selector: 'app-simulation',
	standalone: true,
	imports: [CommonModule, ControlPanelComponent, SimulationVisualizationComponent],
	templateUrl: './simulation.component.html',
	styleUrl: './simulation.component.scss',
})
export class SimulationComponent implements OnInit, OnDestroy {
	private readonly _destroy$ = new Subject<void>();
	private readonly _simulationEngine = inject(SimulationEngine);

	protected readonly status = signal<SimulationStatus>(SimulationStatus.Stopped);
	protected readonly currentState = signal<SimulationState>({ agents: new Map(), iteration: 0 });
	protected readonly params = signal<SimulationParams>(DEFAULT_SIMULATION_PARAMS);

	protected onStart(): void {
		this._simulationEngine.start();
		const iterations = this.params().simulation.iterations;
		let currentIteration = 0;

		interval(100)
			.pipe(
				// eslint-disable-next-line rxjs/no-ignored-takewhile-value
				takeWhile(() => currentIteration < iterations && this.status() === SimulationStatus.Running, true),
				takeUntil(this._destroy$),
			)
			.subscribe(() => {
				this._simulationEngine.step();
				this.currentState.set(this._simulationEngine.currentState);
				currentIteration++;
			});
	}

	protected onPause(): void {
		this._simulationEngine.pause();
	}

	protected onResume(): void {
		this._simulationEngine.resume();
	}

	protected onStop(): void {
		this._simulationEngine.stop();
	}

	protected onParamsChange(params: SimulationParams): void {
		this.params.set(params);
	}

	public ngOnInit(): void {
		this._simulationEngine.status$.pipe(takeUntil(this._destroy$)).subscribe((status) => {
			this.status.set(status);
		});
	}

	public ngOnDestroy(): void {
		this._destroy$.next();
		this._destroy$.complete();
	}
}
