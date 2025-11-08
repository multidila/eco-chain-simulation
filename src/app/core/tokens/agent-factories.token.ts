import { InjectionToken } from '@angular/core';

import { AgentType } from '../enums';
import { AgentFactory } from '../models';

export const AGENT_FACTORIES = new InjectionToken<Map<AgentType, AgentFactory>>('AGENT_FACTORIES');
