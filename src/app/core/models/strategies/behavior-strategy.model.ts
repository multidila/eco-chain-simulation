import type { Action } from '../actions';
import type { SensorData } from '../sensor-data.model';

export interface BehaviorStrategy {
	decide(sensors: SensorData): Action;
}
