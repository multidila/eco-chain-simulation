import { Injectable } from '@angular/core';

import { GridEnvironmentPositionGenerator } from './grid-environment-position-generator.service';
import { GridPosition } from './grid-position.model';
import { Grid } from './grid.model';
import { Agent } from '../../../models';

@Injectable()
export class RandomPositionGenerator extends GridEnvironmentPositionGenerator {
	public generatePosition(agent: Agent, grid: Grid): GridPosition {
		const size = grid.length;
		return {
			x: Math.floor(Math.random() * size),
			y: Math.floor(Math.random() * size),
		};
	}
}
