import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';

import { AgentType } from '../../../core/enums';
import { LivingAgent, SimulationState } from '../../../core/models';
import { Grid } from '../../../core/services/environment/grid/grid.model';

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
	protected readonly gridData = computed<GridCell[][]>(() => {
		const state = this.state();
		const grid = this.grid();

		return grid.map((row, y) =>
			row.map((cell, x) => ({
				x,
				y,
				agents: this._mapCellAgents(cell.agents, state),
			})),
		);
	});

	public readonly state = input.required<SimulationState>();
	public readonly grid = input.required<Grid>();

	private _mapCellAgents(agentIds: string[], state: SimulationState): CellAgent[] {
		return agentIds
			.map((agentId) => state.agents.get(agentId))
			.filter((agent): agent is LivingAgent => Boolean(agent))
			.map((agent) => ({
				id: agent.id,
				type: agent.type,
				energy: agent.energyStrategy?.energy ?? 0,
				maxEnergy: agent.energyStrategy?.maxEnergy ?? 100,
			}));
	}

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
