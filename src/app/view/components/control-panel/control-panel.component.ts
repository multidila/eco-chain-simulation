import { CommonModule } from '@angular/common';
import { Component, EventEmitter, input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';

import { SimulationStatus } from '../../../core/enums';
import { SimulationParams } from '../../models/simulation-params.model';

@Component({
	selector: 'app-control-panel',
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		MatCardModule,
		MatButtonModule,
		MatTabsModule,
		MatDividerModule,
		MatExpansionModule,
		MatFormFieldModule,
		MatInputModule,
	],
	templateUrl: './control-panel.component.html',
	styleUrl: './control-panel.component.scss',
})
export class ControlPanelComponent {
	protected readonly simulationStatus = SimulationStatus;

	public readonly status = input.required<SimulationStatus>();
	public readonly params = input.required<SimulationParams>();
	public readonly initialized = input.required<boolean>();

	@Output() public readonly startSimulation = new EventEmitter<void>();
	@Output() public readonly pauseSimulation = new EventEmitter<void>();
	@Output() public readonly resumeSimulation = new EventEmitter<void>();
	@Output() public readonly stopSimulation = new EventEmitter<void>();
	@Output() public readonly initializeSimulation = new EventEmitter<void>();
	@Output() public readonly reinitializeSimulation = new EventEmitter<void>();
	@Output() public readonly paramsChange = new EventEmitter<SimulationParams>();

	protected get isRunning(): boolean {
		return this.status() === SimulationStatus.Running;
	}

	protected get isPaused(): boolean {
		return this.status() === SimulationStatus.Paused;
	}

	protected get isStopped(): boolean {
		return this.status() === SimulationStatus.Stopped;
	}

	protected get isInitialized(): boolean {
		return this.initialized();
	}

	protected get canReinitialize(): boolean {
		return this.isStopped && this.isInitialized;
	}

	protected onStart(): void {
		this.startSimulation.emit();
	}

	protected onPause(): void {
		this.pauseSimulation.emit();
	}

	protected onResume(): void {
		this.resumeSimulation.emit();
	}

	protected onStop(): void {
		this.stopSimulation.emit();
	}

	protected onInitialize(): void {
		this.initializeSimulation.emit();
	}

	protected onReinitialize(): void {
		this.reinitializeSimulation.emit();
	}
}
