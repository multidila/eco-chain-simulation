import { inject, Injectable, InjectionToken } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { AgentType, SimulationStatus } from '../../enums';
import { Agent, Environment, SimulationConfig, SimulationState } from '../../models';
import { AGENT_FACTORIES } from '../../tokens';

export interface SimulationEngineConfig {
	agentProcessingOrder: AgentType[];
}

export const SIMULATION_ENGINE_CONFIG = new InjectionToken<SimulationEngineConfig>('SIMULATION_ENGINE_CONFIG');

@Injectable()
export class SimulationEngine {
	private readonly _config = inject(SIMULATION_ENGINE_CONFIG);
	private readonly _environment = inject(Environment);
	private readonly _agentFactories = inject(AGENT_FACTORIES);
	private readonly _state: SimulationState = {
		agents: new Map<string, Agent>(),
		iteration: 0,
	};
	private readonly _status$ = new BehaviorSubject<SimulationStatus>(SimulationStatus.Stopped);

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

	private _syncStateFromEnvironment(): void {
		const agents = this._environment.getAllAgents();
		this._state.agents.clear();
		for (const agent of agents) {
			this._state.agents.set(agent.id, agent);
		}
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
		this._status$.next(SimulationStatus.Stopped);
		this._initialized = false;
	}

	public step(): void {
		if (this._status$.value !== SimulationStatus.Running) {
			return;
		}
		this._state.iteration++;

		const allAgents = this._environment.getAllAgents();
		const agentsByType = new Map<AgentType, Agent[]>();
		for (const agent of allAgents) {
			const typeAgents = agentsByType.get(agent.type) || [];
			typeAgents.push(agent);
			agentsByType.set(agent.type, typeAgents);
		}
		for (const agentType of this._config.agentProcessingOrder) {
			const agents = agentsByType.get(agentType) || [];
			for (const agent of agents) {
				agent.behaviorStrategy.setAgent(agent);
				agent.behaviorStrategy.act();
			}
		}
		this._syncStateFromEnvironment();
	}
}
