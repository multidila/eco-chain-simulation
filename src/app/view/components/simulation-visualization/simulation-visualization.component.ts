import { CommonModule } from '@angular/common';
import { Component, computed, effect, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSliderModule } from '@angular/material/slider';

import { AgentType } from '../../../core/enums';
import { Grid } from '../../../core/services';
import { SimulationStateView } from '../../models';
import { GridViewComponent } from '../grid-view';

@Component({
	selector: 'app-simulation-visualization',
	standalone: true,
	imports: [CommonModule, MatCardModule, MatSliderModule, FormsModule, GridViewComponent],
	templateUrl: './simulation-visualization.component.html',
	styleUrl: './simulation-visualization.component.scss',
})
export class SimulationVisualizationComponent {
	private _userInteractedWithSlider = false;

	protected selectedIteration = signal(0);

	protected readonly displayedState = computed(() => {
		if (this.stateHistory().length > 0) {
			const index = this.selectedIteration();
			const historyState = this.stateHistory()[index];
			return historyState || this.state();
		}
		return this.state();
	});

	protected readonly displayedGrid = computed(() => {
		if (this.gridHistory().length > 0) {
			const index = this.selectedIteration();
			const historyGrid = this.gridHistory()[index];
			return historyGrid || this.grid();
		}
		return this.grid();
	});

	protected readonly stats = computed(() => {
		const agents = this.displayedState().agents;
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
			iteration: this.displayedState().iteration,
			total: agents.size,
			plants: plantCount,
			herbivores: herbivoreCount,
			carnivores: carnivoreCount,
		};
	});

	public readonly grid = input.required<Grid>();
	public readonly state = input.required<SimulationStateView>();
	public readonly gridHistory = input.required<ReadonlyArray<Grid>>();
	public readonly stateHistory = input.required<ReadonlyArray<SimulationStateView>>();

	constructor() {
		effect(
			() => {
				const historyLength = this.stateHistory().length;
				if (!this._userInteractedWithSlider && historyLength > 0) {
					this.selectedIteration.set(historyLength - 1);
				}
			},
			{ allowSignalWrites: true },
		);
	}

	protected get maxIteration(): number {
		return this.stateHistory().length;
	}

	protected get displayIteration(): number {
		return this.selectedIteration() + 1;
	}

	protected get hasHistory(): boolean {
		return this.stateHistory().length > 0;
	}

	protected onIterationChange(value: number): void {
		this._userInteractedWithSlider = true;
		const index = value - 1;
		this.selectedIteration.set(index);
		const isAtLatest = index >= this.stateHistory().length - 1;
		if (isAtLatest) {
			this._userInteractedWithSlider = false;
		}
	}
}
