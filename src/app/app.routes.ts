import { Routes } from '@angular/router';
import { MapComponent } from './features';

export const appRoutes: Routes = [
  {
    path: '',
    component: MapComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
