import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';

import { AgentType } from '../../../core/enums';
import { LivingAgent, SimulationState } from '../../../core/models';
import { Environment } from '../../../core/models/environment/environment.model';
import { GridEnvironmentService } from '../../../core/services/environment/grid/grid-environment.service';

interface CellAgent {
	id: string;
	type: AgentType;
	energy: number;
	maxEnergy: number;
}

interface GridCell {
	x: number;
	y: number;
	agents: CellAgent[];
}

@Component({
	selector: 'app-grid-view',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './grid-view.component.html',
	styleUrl: './grid-view.component.scss',
})
export class GridViewComponent {
	private readonly _environment = inject(Environment) as GridEnvironmentService;

	protected readonly gridData = computed(() => {
		const size = this.gridSize();
		const cells: GridCell[][] = [];

		for (let y = 0; y < size; y++) {
			cells[y] = [];
			for (let x = 0; x < size; x++) {
				const agentsAtPosition = this._environment.getAgentsAt({ x, y });
				const cellAgents: CellAgent[] = agentsAtPosition.map((agent) => ({
					id: agent.id,
					type: agent.type,
					energy: (agent as LivingAgent).energyStrategy?.energy ?? 0,
					maxEnergy: (agent as LivingAgent).energyStrategy?.maxEnergy ?? 100,
				}));

				cells[y][x] = { x, y, agents: cellAgents };
			}
		}

		return cells;
	});

	public readonly state = input.required<SimulationState>();
	public readonly gridSize = input.required<number>();

	protected getAgentOpacity(agent: CellAgent): number {
		if (!agent.maxEnergy) {
			return 1;
		}
		return Math.max(0.2, agent.energy / agent.maxEnergy);
	}

	protected isPlant(agent: CellAgent): boolean {
		return agent.type === AgentType.Plant;
	}

	protected isHerbivore(agent: CellAgent): boolean {
		return agent.type === AgentType.Herbivore;
	}

	protected isCarnivore(agent: CellAgent): boolean {
		return agent.type === AgentType.Carnivore;
	}
}
