import { Injectable } from '@angular/core';

import { DirectionType } from '../../enums';
import { Agent, Environment } from '../../models';

interface AgentState {
	x: number;
	y: number;
	agent: Agent;
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

	private _calculatePositionAhead(x: number, y: number, direction: DirectionType): { x: number; y: number } {
		let newX = x;
		let newY = y;
		switch (direction) {
			case DirectionType.North:
				newY = (y - 1 + this._gridSize) % this._gridSize;
				break;
			case DirectionType.East:
				newX = (x + 1) % this._gridSize;
				break;
			case DirectionType.South:
				newY = (y + 1) % this._gridSize;
				break;
			case DirectionType.West:
				newX = (x - 1 + this._gridSize) % this._gridSize;
				break;
		}
		return { x: newX, y: newY };
	}

	public getAgentAhead(agentId: string): Agent | null {
		const state = this._agentStates.get(agentId);
		if (!state) {
			return null;
		}
		const { x, y } = this._calculatePositionAhead(state.x, state.y, state.direction);
		const targetAgentId = this._grid[y][x];
		if (!targetAgentId) {
			return null;
		}
		return this._agentStates.get(targetAgentId)?.agent ?? null;
	}

	public getAgentDirection(agentId: string): DirectionType | null {
		return this._agentStates.get(agentId)?.direction ?? null;
	}

	public addAgent(agent: Agent, x: number, y: number, direction: DirectionType): void {
		if (this._agentStates.has(agent.id)) {
			throw new Error(`Agent with id ${agent.id} already exists`);
		}
		if (this._grid[y][x] !== null) {
			throw new Error(`Position (${x}, ${y}) is already occupied`);
		}
		this._agentStates.set(agent.id, { agent, direction, x, y });
		this._grid[y][x] = agent.id;
	}

	public moveAgent(agentId: string): void {
		const state = this._agentStates.get(agentId);
		if (!state) {
			return;
		}
		const newPosition = this._calculatePositionAhead(state.x, state.y, state.direction);
		if (this._grid[newPosition.y][newPosition.x] !== null) {
			return;
		}
		this._grid[state.y][state.x] = null;
		this._grid[newPosition.y][newPosition.x] = agentId;
		state.x = newPosition.x;
		state.y = newPosition.y;
	}

	public removeAgent(agentId: string): void {
		const state = this._agentStates.get(agentId);
		if (!state) {
			return;
		}
		this._grid[state.y][state.x] = null;
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
