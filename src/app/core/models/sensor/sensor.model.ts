import { Injectable } from '@angular/core';

import type { SensorData } from './sensor-data.model';
import { Agent } from '../agents';
import { Environment } from '../environment';

@Injectable()
export abstract class Sensor<TAgent extends Agent = Agent, TEnvironment extends Environment = Environment> {
	public abstract getSensorData(agent: TAgent, environment: TEnvironment): SensorData;
}
