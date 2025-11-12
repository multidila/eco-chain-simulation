import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';

import { AgentType } from '../../../core/enums';
import { Grid } from '../../../core/services';
import { AgentView, LivingAgentView, SimulationStateView } from '../../models';

interface GridCell {
	x: number;
	y: number;
	agents: AgentView[];
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

	public readonly state = input.required<SimulationStateView>();
	public readonly grid = input.required<Grid>();

	private _mapCellAgents(agentIds: string[], state: SimulationStateView): AgentView[] {
		return agentIds
			.map((agentId) => state.agents.get(agentId))
			.filter(Boolean)
			.map((agent) => ({ ...agent })) as AgentView[];
	}

	protected getAgentOpacity(agent: LivingAgentView): number {
		if (!agent.maxEnergy) {
			return 1;
		}
		return Math.max(0.2, agent.currentEnergy / agent.maxEnergy);
	}

	protected getAgentTooltip(agent: LivingAgentView): string {
		return [
			`ID: ${agent.id}`,
			`Age: ${agent.age}`,
			`Generation: ${agent.generation}`,
			`Energy: ${agent.currentEnergy.toFixed(1)}/${agent.maxEnergy}`,
		].join('\n');
	}

	protected isPlant(agent: AgentView): agent is LivingAgentView {
		return agent.type === AgentType.Plant;
	}

	protected isHerbivore(agent: AgentView): agent is LivingAgentView {
		return agent.type === AgentType.Herbivore;
	}

	protected isCarnivore(agent: AgentView): agent is LivingAgentView {
		return agent.type === AgentType.Carnivore;
	}
}
