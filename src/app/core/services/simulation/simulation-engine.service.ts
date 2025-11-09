import { inject, Injectable } from '@angular/core';

import { Agent, Environment, Sensor, SimulationConfig, SimulationState } from '../../models';
import { AGENT_FACTORIES } from '../../tokens';

@Injectable()
export class SimulationEngine {
	private readonly _sensor = inject(Sensor);
	private readonly _environment = inject(Environment);
	private readonly _agentFactories = inject(AGENT_FACTORIES);

	private readonly _state: SimulationState = {
		agents: new Map<string, Agent>(),
		iteration: 0,
	};

	private _running = false;

	private _shuffle<T>(array: T[]): void {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
	}

	public init(config: SimulationConfig): void {
		this.reset();
		config.agents.forEach((agentConfig) => {
			const agent = this._agentFactories.get(agentConfig.type)?.create();
			if (agent) {
				this._state.agents.set(agent.id, agent);
				this._environment.addAgent(agent);
			}
		});
	}

	public start(iterations: number): void {
		this._running = true;
		for (let i = 0; i < iterations; i++) {
			this.step();
		}
	}

	public stop(): void {
		this._running = false;
	}

	public reset(): void {
		for (const agent of this._state.agents.values()) {
			this._environment.removeAgent(agent.id);
		}
		this._state.agents.clear();
		this._state.iteration = 0;
	}

	public step(): void {
		if (!this._running) {
			return;
		}
		this._state.iteration++;
		this._shuffle(Array.from(this._state.agents.values()));
		for (const agent of this._state.agents.values()) {
			agent.behaviorStrategy.act();
		}
	}
}
