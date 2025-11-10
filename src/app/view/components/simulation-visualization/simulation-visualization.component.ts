import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSliderModule } from '@angular/material/slider';

import { AgentType } from '../../../core/enums';
import { SimulationState } from '../../../core/models';
import { Grid } from '../../../core/services/environment/grid/grid.model';
import { GridViewComponent } from '../grid-view/grid-view.component';

@Component({
	selector: 'app-simulation-visualization',
	standalone: true,
	imports: [CommonModule, MatCardModule, MatSliderModule, FormsModule, GridViewComponent],
	templateUrl: './simulation-visualization.component.html',
	styleUrl: './simulation-visualization.component.scss',
})
export class SimulationVisualizationComponent {
	protected selectedIteration = 0;

	protected readonly stats = computed(() => {
		const agents = this.state().agents;
		let plantCount = 0;
		let herbivoreCount = 0;
		let carnivoreCount = 0;

		for (const agent of agents.values()) {
			switch (agent.type) {
				case AgentType.Plant:
					plantCount++;
					break;
				case AgentType.Herbivore:
					herbivoreCount++;
					break;
				case AgentType.Carnivore:
					carnivoreCount++;
					break;
			}
		}

		return {
			iteration: this.state().iteration,
			total: agents.size,
			plants: plantCount,
			herbivores: herbivoreCount,
			carnivores: carnivoreCount,
		};
	});

	public readonly state = input.required<SimulationState>();
	public readonly grid = input.required<Grid>();
	public readonly history = input.required<ReadonlyArray<SimulationState>>();

	protected get maxIteration(): number {
		return this.history().length > 0 ? this.history().length - 1 : 0;
	}

	protected onIterationChange(iteration: number): void {
		this.selectedIteration = iteration;
	}
}
