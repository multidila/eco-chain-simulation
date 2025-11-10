import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { SimulationStatus } from '../../enums';
import { Agent, Environment, SimulationConfig, SimulationState } from '../../models';
import { AGENT_FACTORIES } from '../../tokens';

@Injectable()
export class SimulationEngine {
	private readonly _environment = inject(Environment);
	private readonly _agentFactories = inject(AGENT_FACTORIES);

	private readonly _state: SimulationState = {
		agents: new Map<string, Agent>(),
		iteration: 0,
	};

	private readonly _status$ = new BehaviorSubject<SimulationStatus>(SimulationStatus.Stopped);
	private readonly _stateHistory: SimulationState[] = [];

	private _initialized = false;

	public get status$(): Observable<SimulationStatus> {
		return this._status$.asObservable();
	}

	public get initialized(): boolean {
		return this._initialized;
	}

	public get state(): SimulationState {
		return { ...this._state };
	}

	public get stateHistory(): ReadonlyArray<SimulationState> {
		return this._stateHistory;
	}

	private _shuffle<T>(array: T[]): void {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
	}

	private _saveStateSnapshot(): void {
		this._stateHistory.push({
			agents: new Map(this._state.agents),
			iteration: this._state.iteration,
		});
	}

	public init<TEnvironmentConfig = unknown>(config: SimulationConfig<TEnvironmentConfig>): void {
		this._environment.init(config.environment);
		this.reset();
		config.agents.forEach((agentConfig) => {
			for (let i = 0; i < agentConfig.amount; i++) {
				const agent = this._agentFactories.get(agentConfig.type)?.create();
				if (agent) {
					this._state.agents.set(agent.id, agent);
					this._environment.addAgent(agent);
				}
			}
		});
		this._initialized = true;
	}

	public start(): void {
		if (this._status$.value === SimulationStatus.Stopped) {
			this._stateHistory.length = 0;
		}
		this._status$.next(SimulationStatus.Running);
	}

	public pause(): void {
		this._status$.next(SimulationStatus.Paused);
	}

	public resume(): void {
		this._status$.next(SimulationStatus.Running);
	}

	public stop(): void {
		this._status$.next(SimulationStatus.Stopped);
	}

	public reset(): void {
		for (const agent of this._state.agents.values()) {
			this._environment.removeAgent(agent.id);
		}
		this._state.agents.clear();
		this._state.iteration = 0;
		this._stateHistory.length = 0;
		this._status$.next(SimulationStatus.Stopped);
		this._initialized = false;
	}

	public step(): void {
		if (this._status$.value !== SimulationStatus.Running) {
			return;
		}
		this._state.iteration++;
		this._shuffle(Array.from(this._state.agents.values()));
		for (const agent of this._state.agents.values()) {
			agent.behaviorStrategy.act();
		}
		this._saveStateSnapshot();
	}

	public getStateAtIteration(iteration: number): SimulationState | undefined {
		return this._stateHistory.find((state) => state.iteration === iteration);
	}
}
