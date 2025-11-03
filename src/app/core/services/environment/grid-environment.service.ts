import { Injectable } from '@angular/core';

import { DirectionType } from '../../enums';
import { Agent, Environment } from '../../models';

export interface GridPosition {
	x: number;
	y: number;
}

interface AgentState {
	agent: Agent;
	position: GridPosition;
	direction: DirectionType;
}

@Injectable()
export class GridEnvironmentService implements Environment {
	private readonly _grid: (string | null)[][];
	private readonly _agentStates: Map<string, AgentState>;

	constructor(private readonly _gridSize: number) {
		this._grid = new Array(_gridSize).fill(null);
		this._agentStates = new Map();
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

	public getAgentAt(position: GridPosition): Agent | null {
		const agentId = this._grid[position.y][position.x];
		if (!agentId) {
			return null;
		}
		return this._agentStates.get(agentId)?.agent ?? null;
	}

	public getAgentAhead(agentId: string): Agent | null {
		const state = this._agentStates.get(agentId);
		if (!state) {
			return null;
		}
		const { x, y } = this.getNextPosition(state.position, state.direction);
		const targetAgentId = this._grid[y][x];
		if (!targetAgentId) {
			return null;
		}
		return this._agentStates.get(targetAgentId)?.agent ?? null;
	}

	public getAgentDirection(agentId: string): DirectionType | null {
		return this._agentStates.get(agentId)?.direction ?? null;
	}

	public getAgentPosition(agentId: string): GridPosition | null {
		return this._agentStates.get(agentId)?.position ?? null;
	}

	public addAgent(agent: Agent, position: GridPosition, direction: DirectionType): void {
		const { x, y } = position;
		if (this._agentStates.has(agent.id)) {
			throw new Error(`Agent with id ${agent.id} already exists`);
		}
		if (this._grid[y][x] !== null) {
			throw new Error(`Position (${x}, ${y}) is already occupied`);
		}
		this._agentStates.set(agent.id, { agent, direction, position: { x, y } });
		this._grid[y][x] = agent.id;
	}

	public moveAgent(agentId: string): void {
		const state = this._agentStates.get(agentId);
		if (!state) {
			return;
		}
		const oldPosition = state.position;
		const newPosition = this.getNextPosition(oldPosition, state.direction);
		if (this._grid[newPosition.y][newPosition.x] !== null) {
			return;
		}
		this._grid[oldPosition.y][oldPosition.x] = null;
		this._grid[newPosition.y][newPosition.x] = agentId;
		state.position = newPosition;
	}

	public removeAgent(agentId: string): void {
		const state = this._agentStates.get(agentId);
		if (!state) {
			return;
		}
		this._grid[state.position.y][state.position.x] = null;
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
