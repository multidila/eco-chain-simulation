import { Injectable } from '@angular/core';

import { GridPosition } from './grid-position.model';
import { Grid } from './grid.model';
import { Agent } from '../../../models';

@Injectable()
export abstract class GridEnvironmentPositionGenerator {
	public abstract generatePosition(agent: Agent, grid: Grid): GridPosition;
}
