import type { SensorData } from '../sensor-data.model';

export interface Sensor {
	getSensorData(agentId: string): SensorData;
}
