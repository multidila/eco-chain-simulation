import { inject, Injectable, InjectionToken } from '@angular/core';

import { GridPosition } from './grid-position.model';
import { Grid } from './grid.model';
import { AgentType, DirectionType } from '../../../enums';
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

export interface GridEnvironmentOccupancyConfig {
	conflicts: Map<AgentType, Set<AgentType>>;
}

export const GRID_ENVIRONMENT_OCCUPANCY_CONFIG = new InjectionToken<GridEnvironmentOccupancyConfig>(
	'GRID_ENVIRONMENT_OCCUPANCY_CONFIG',
	{
		providedIn: 'root',
		factory: () => ({
			conflicts: new Map<AgentType, Set<AgentType>>([
				[AgentType.Herbivore, new Set<AgentType>([AgentType.Herbivore, AgentType.Carnivore])],
				[AgentType.Carnivore, new Set<AgentType>([AgentType.Herbivore, AgentType.Carnivore])],
				[AgentType.Plant, new Set<AgentType>([AgentType.Plant])],
			]),
		}),
	},
);

@Injectable()
export class GridEnvironmentService extends Environment<GridEnvironmentConfig> {
	private readonly _occupancyConfig = inject(GRID_ENVIRONMENT_OCCUPANCY_CONFIG);

	private _grid!: Grid;
	private _agentStates!: Map<string, AgentState>;

	private get _gridSize(): number {
		return this._grid.length;
	}

	public get grid(): Grid {
		return this._grid;
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
		this._grid = Array.from({ length: config.size }, () =>
			Array.from({ length: config.size }, () => ({ agents: [] })),
		);
		this._agentStates = new Map<string, AgentState>();
	}

	public getNextPosition(position: GridPosition, direction: DirectionType, distance: number = 0): GridPosition {
		if (distance === 0) {
			return position;
		}
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
		return this.getNextPosition({ x: newX, y: newY }, direction, distance - 1);
	}

	public getAllAgents(): Agent[] {
		return Array.from(this._agentStates.values()).map((state) => state.agent);
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
		if (this._agentStates.has(agent.id)) {
			throw new Error(`Agent with id ${agent.id} already exists`);
		}
		const conflictTypes = this._occupancyConfig.conflicts.get(agent.type) ?? new Set<AgentType>();
		const availablePositions: GridPosition[] = [];
		for (let y = 0; y < this._gridSize; y++) {
			for (let x = 0; x < this._gridSize; x++) {
				const agents = this.getAgentsAt({ x, y });
				const hasConflict = agents.some((a) => conflictTypes.has(a.type));
				if (!hasConflict) {
					availablePositions.push({ x, y });
				}
			}
		}
		if (availablePositions.length === 0) {
			console.warn(`No available position for agent ${agent.id} of type ${agent.type}`);
			return;
		}
		const randomIndex = Math.floor(Math.random() * availablePositions.length);
		const position = availablePositions[randomIndex];
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

	public getGridSnapshot(): Grid {
		return this._grid?.map((row) => row.map((cell) => ({ agents: [...cell.agents] }))) ?? [];
	}
}
