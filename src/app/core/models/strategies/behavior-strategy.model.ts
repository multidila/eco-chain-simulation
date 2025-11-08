import type { Action } from '../actions';
import type { SensorData } from '../sensor';

export interface BehaviorStrategy {
	decide(sensors: SensorData): Action;
}
