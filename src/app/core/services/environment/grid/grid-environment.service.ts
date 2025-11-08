import { inject, Injectable } from '@angular/core';

import { GridEnvironmentPositionGenerator } from './grid-environment-position-generator.service';
import { GridPosition } from './grid-position.model';
import { Grid } from './grid.model';
import { DirectionType } from '../../../enums';
import { Agent, Environment } from '../../../models';

const DEFAULT_DIRECTION = DirectionType.North;

interface AgentState {
	agent: Agent;
	position: GridPosition;
	direction: DirectionType;
}

export interface GridEnvironmentConfig {
	size: number;
}

@Injectable()
export class GridEnvironmentService extends Environment<GridEnvironmentConfig> {
	private readonly _positionGenerator = inject(GridEnvironmentPositionGenerator);

	private _grid!: Grid;
	private _agentStates!: Map<string, AgentState>;

	private get _gridSize(): number {
		return this._grid.length;
	}

	private _addAgentToPosition(agentId: string, position: GridPosition): void {
		this._grid[position.y][position.x].agents.push(agentId);
	}

	private _removeAgentFromPosition(agentId: string, position: GridPosition): void {
		this._grid[position.y][position.x].agents = this._grid[position.y][position.x].agents.filter(
			(id) => id !== agentId,
		);
	}

	public init(config: GridEnvironmentConfig): void {
		this._grid = new Array(config.size).map(() => new Array(config.size).fill({ agents: [] }));
		this._agentStates = new Map<string, AgentState>();
	}

	public getNextPosition(position: GridPosition, direction: DirectionType, distance: number = 0): GridPosition {
		let newX = position.x;
		let newY = position.y;
		switch (direction) {
			case DirectionType.North:
				newY = (position.y - 1 + this._gridSize) % this._gridSize;
				break;
			case DirectionType.East:
				newX = (position.x + 1) % this._gridSize;
				break;
			case DirectionType.South:
				newY = (position.y + 1) % this._gridSize;
				break;
			case DirectionType.West:
				newX = (position.x - 1 + this._gridSize) % this._gridSize;
				break;
		}
		const newPosition: GridPosition = { x: newX, y: newY };
		if (distance === 0) {
			return newPosition;
		}
		return this.getNextPosition(newPosition, direction, distance--);
	}

	public getAgentsAt(position: GridPosition): Agent[] {
		const agentIds = this._grid[position.y][position.x]?.agents ?? [];
		return agentIds.map((id) => this._agentStates.get(id)?.agent).filter(Boolean) as Agent[];
	}

	public getAgentsAhead(agentId: string): Agent[] {
		const state = this._agentStates.get(agentId);
		if (!state) {
			return [];
		}
		const nextPosition = this.getNextPosition(state.position, state.direction);
		return this.getAgentsAt(nextPosition);
	}

	public getAgentDirection(agentId: string): DirectionType | null {
		return this._agentStates.get(agentId)?.direction ?? null;
	}

	public getAgentPosition(agentId: string): GridPosition | null {
		return this._agentStates.get(agentId)?.position ?? null;
	}

	public addAgent(agent: Agent, direction?: DirectionType): void {
		const position = this._positionGenerator.generatePosition(agent, this._grid);
		if (this._agentStates.has(agent.id)) {
			throw new Error(`Agent with id ${agent.id} already exists`);
		}
		this._agentStates.set(agent.id, { agent, direction: direction ?? DEFAULT_DIRECTION, position });
		this._addAgentToPosition(agent.id, position);
	}

	public moveAgent(agentId: string): void {
		const state = this._agentStates.get(agentId);
		if (!state) {
			return;
		}
		const oldPosition = state.position;
		const newPosition = this.getNextPosition(oldPosition, state.direction);
		this._addAgentToPosition(agentId, newPosition);
		this._removeAgentFromPosition(agentId, oldPosition);
		state.position = newPosition;
	}

	public removeAgent(agentId: string): void {
		const state = this._agentStates.get(agentId);
		if (!state) {
			return;
		}
		this._removeAgentFromPosition(agentId, state.position);
		this._agentStates.delete(agentId);
	}

	public rotateAgent(agentId: string, direction: DirectionType): void {
		const state = this._agentStates.get(agentId);
		if (!state) {
			return;
		}
		state.direction = direction;
	}
}
