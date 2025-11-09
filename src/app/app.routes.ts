import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
	{
		path: '',
		loadComponent: () => import('./view/simulation.component').then((m) => m.SimulationComponent),
	},
];
