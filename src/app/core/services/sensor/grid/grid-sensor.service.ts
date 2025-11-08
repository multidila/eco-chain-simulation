import { inject, Injectable, InjectionToken } from '@angular/core';

import { LEFT_ROTATION, RIGHT_ROTATION } from '../../../constants';
import { AgentType, DirectionType } from '../../../enums';
import { Agent, Sensor, SensorData } from '../../../models';
import { GridEnvironmentService, GridPosition } from '../../environment/grid';

interface ScanConeOptions {
	range: number;
	shift?: number;
	restrictedSide?: 'left' | 'right';
}

interface ScanSquareOptions {
	radius: number;
}

export const GRID_SENSOR_SERVICE_CONFIG = new InjectionToken<GridSensorServiceConfig>('GRID_SENSOR_SERVICE_CONFIG');

export interface GridSensorServiceConfig {
	agentTypes: AgentType[];
	visionRange: number;
}

@Injectable()
export class GridSensorService<TAgent extends Agent = Agent> extends Sensor<TAgent, GridEnvironmentService> {
	private readonly _config = inject(GRID_SENSOR_SERVICE_CONFIG);

	private _environment!: GridEnvironmentService;

	private get _visionRange(): number {
		return this._config.visionRange;
	}

	private get _agentTypes(): AgentType[] {
		return this._config.agentTypes;
	}

	private _initializeAgentMap(): Map<AgentType, number> {
		const map = new Map<AgentType, number>();
		for (const agentType of this._agentTypes) {
			map.set(agentType, 0);
		}
		return map;
	}

	private _scanCone(
		position: GridPosition,
		direction: DirectionType,
		options: ScanConeOptions,
	): Map<AgentType, number> {
		const { range, shift, restrictedSide } = options;
		const leftDirection = LEFT_ROTATION.get(direction);
		const rightDirection = RIGHT_ROTATION.get(direction);
		if (!leftDirection || !rightDirection) {
			throw new Error(`Invalid direction: ${direction}`);
		}
		let basePosition = position;
		if (shift != null && shift > 0) {
			basePosition = this._environment.getNextPosition(position, direction, shift);
		}
		const agentsCountMap = this._initializeAgentMap();
		for (let distance = 1; distance <= range; distance++) {
			const center = this._environment.getNextPosition(basePosition, direction, distance);
			const halfWidth = distance;
			for (let off = -halfWidth; off <= halfWidth; off++) {
				if (restrictedSide === 'left' && off >= 0) {
					continue;
				}
				if (restrictedSide === 'right' && off <= 0) {
					continue;
				}
				let newPosition = center;
				if (off < 0) {
					newPosition = this._environment.getNextPosition(center, leftDirection, -off);
				}
				if (off > 0) {
					newPosition = this._environment.getNextPosition(center, rightDirection, off);
				}
				this._bumpCountsFromPos(newPosition, agentsCountMap);
			}
		}
		return agentsCountMap;
	}

	private _scanHemiBox(
		position: GridPosition,
		direction: DirectionType,
		options: ScanSquareOptions,
	): Map<AgentType, number> {
		const radius = options.radius;
		const agentsCountMap = this._initializeAgentMap();
		if (radius <= 0) {
			return agentsCountMap;
		}
		const leftDirection = LEFT_ROTATION.get(direction);
		const rightDirection = RIGHT_ROTATION.get(direction);
		if (!leftDirection || !rightDirection) {
			throw new Error(`Invalid direction: ${direction}`);
		}
		for (let off = -radius; off <= radius; off++) {
			if (off === 0) {
				continue;
			}
			let newPosition = position;
			if (off < 0) {
				newPosition = this._environment.getNextPosition(position, leftDirection, -off);
			} else {
				newPosition = this._environment.getNextPosition(position, rightDirection, off);
			}
			this._bumpCountsFromPos(newPosition, agentsCountMap);
		}
		for (let row = 1; row <= radius; row++) {
			const rowCenter = this._environment.getNextPosition(position, direction, row);
			for (let off = -radius; off <= radius; off++) {
				let newPosition = rowCenter;
				if (off < 0) {
					newPosition = this._environment.getNextPosition(rowCenter, leftDirection, -off);
				}
				if (off > 0) {
					newPosition = this._environment.getNextPosition(rowCenter, rightDirection, off);
				}
				this._bumpCountsFromPos(newPosition, agentsCountMap);
			}
		}
		return agentsCountMap;
	}

	private _bumpCountsFromPos(position: GridPosition, agentsCountMap: Map<AgentType, number>): void {
		const agents = this._environment.getAgentsAt(position);
		for (const agent of agents) {
			agentsCountMap.set(agent.type, (agentsCountMap.get(agent.type) ?? 0) + 1);
		}
	}

	public getSensorData(agent: TAgent, environment: GridEnvironmentService): SensorData {
		this._environment = environment;
		const position = this._environment.getAgentPosition(agent.id);
		const direction = this._environment.getAgentDirection(agent.id);
		if (!position || !direction) {
			return {
				agentsAhead: this._initializeAgentMap(),
				agentsLeft: this._initializeAgentMap(),
				agentsRight: this._initializeAgentMap(),
				agentsNearby: this._initializeAgentMap(),
			};
		}
		const leftDirection = LEFT_ROTATION.get(direction);
		const rightDirection = RIGHT_ROTATION.get(direction);
		if (!leftDirection || !rightDirection) {
			throw new Error(`Invalid direction: ${direction}`);
		}
		return {
			agentsAhead: this._scanCone(position, direction, { range: this._visionRange }),
			agentsLeft: this._scanCone(position, leftDirection, {
				range: this._visionRange,
				shift: 1,
				restrictedSide: 'left',
			}),
			agentsRight: this._scanCone(position, rightDirection, {
				range: this._visionRange,
				shift: 1,
				restrictedSide: 'right',
			}),
			agentsNearby: this._scanHemiBox(position, direction, { radius: 1 }),
		};
	}
}
