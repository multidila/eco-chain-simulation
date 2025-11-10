import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { interval, Subject, Subscription, takeUntil } from 'rxjs';

import { AgentType, SimulationStatus } from '../core/enums';
import { SimulationConfig, SimulationState } from '../core/models';
import { Grid, GridEnvironmentService, SimulationEngine } from '../core/services';
import { CARNIVORE_CONFIG, HERBIVORE_CONFIG, PLANT_CONFIG } from '../core/services/agent-factories';
import { ControlPanelComponent } from './components/control-panel/control-panel.component';
import { SimulationVisualizationComponent } from './components/simulation-visualization/simulation-visualization.component';
import { DEFAULT_SIMULATION_PARAMS } from './constants';
import { SimulationParams } from './models/simulation-params.model';
import type { GridEnvironmentConfig } from '../core/services/environment/grid/grid-environment.service';

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
	private readonly _environment = inject(GridEnvironmentService);
	private readonly _plantConfig = inject(PLANT_CONFIG);
	private readonly _herbivoreConfig = inject(HERBIVORE_CONFIG);
	private readonly _carnivoreConfig = inject(CARNIVORE_CONFIG);
	private _simulationLoopSub?: Subscription;

	protected readonly status = signal<SimulationStatus>(SimulationStatus.Stopped);
	protected readonly currentState = signal<SimulationState>({ agents: new Map(), iteration: 0 });
	protected readonly params = signal<SimulationParams>(DEFAULT_SIMULATION_PARAMS);
	protected readonly gridSnapshot = signal<Grid>([]);

	protected get initialized(): boolean {
		return this._simulationEngine.initialized;
	}

	private _initializeEngine(): void {
		const config = this._createSimulationConfig(this.params());
		this._syncAgentParams();
		this._simulationEngine.init(config);
		this.currentState.set(this._simulationEngine.state);
		this._updateGridSnapshot();
	}

	private _syncAgentParams(): void {
		const params = this.params();
		this._plantConfig.set({
			energy: { value: params.agents.plant.energy.initial },
		});
		this._herbivoreConfig.set({
			energy: {
				value: params.agents.herbivore.energy.initial,
				maxValue: params.agents.herbivore.energy.max,
				metabolismRate: params.agents.herbivore.energy.metabolismRate,
			},
			reproduction: {
				threshold: params.agents.herbivore.reproduction.threshold,
				shareRate: params.agents.herbivore.reproduction.shareRate,
			},
		});
		this._carnivoreConfig.set({
			energy: {
				value: params.agents.carnivore.energy.initial,
				maxValue: params.agents.carnivore.energy.max,
				metabolismRate: params.agents.carnivore.energy.metabolismRate,
			},
			reproduction: {
				threshold: params.agents.carnivore.reproduction.threshold,
				shareRate: params.agents.carnivore.reproduction.shareRate,
			},
		});
	}

	private _createSimulationConfig(params: SimulationParams): SimulationConfig<GridEnvironmentConfig> {
		return {
			agents: [
				{ type: AgentType.Plant, amount: params.agents.plant.count },
				{ type: AgentType.Herbivore, amount: params.agents.herbivore.count },
				{ type: AgentType.Carnivore, amount: params.agents.carnivore.count },
			],
			environment: {
				size: params.environment.gridSize,
			},
		};
	}

	private _startSimulationLoop(): void {
		this._stopSimulationLoop();
		const iterations = this.params().simulation.iterations;
		const delay = this.params().simulation.delay;

		this._simulationLoopSub = interval(delay)
			.pipe(takeUntil(this._destroy$))
			.subscribe(() => {
				if (this.status() !== SimulationStatus.Running) {
					return;
				}
				if (this.currentState().iteration >= iterations) {
					this.onStop();
					return;
				}
				this._simulationEngine.step();
				this.currentState.set(this._simulationEngine.state);
				this._updateGridSnapshot();
			});
	}

	private _stopSimulationLoop(): void {
		if (this._simulationLoopSub) {
			this._simulationLoopSub.unsubscribe();
			this._simulationLoopSub = undefined;
		}
	}

	private _updateGridSnapshot(): void {
		this.gridSnapshot.set(this._environment.getGridSnapshot());
	}

	protected onStart(): void {
		if (!this.initialized) {
			return;
		}

		this._simulationEngine.start();
		this._startSimulationLoop();
	}

	protected onPause(): void {
		this._simulationEngine.pause();
	}

	protected onResume(): void {
		this._simulationEngine.resume();
	}

	protected onStop(): void {
		this._stopSimulationLoop();
		this._simulationEngine.stop();
	}

	protected onInitialize(): void {
		this._stopSimulationLoop();
		this._initializeEngine();
	}

	protected onReinitialize(): void {
		this._stopSimulationLoop();
		this._initializeEngine();
	}

	protected onParamsChange(params: SimulationParams): void {
		this.params.set(params);
		this._stopSimulationLoop();
		this.gridSnapshot.set([]);
	}

	public ngOnInit(): void {
		this._simulationEngine.status$.pipe(takeUntil(this._destroy$)).subscribe((status) => {
			this.status.set(status);
		});
	}

	public ngOnDestroy(): void {
		this._stopSimulationLoop();
		this._destroy$.next();
		this._destroy$.complete();
	}
}
