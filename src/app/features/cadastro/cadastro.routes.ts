import { Routes } from '@angular/router';

export const CADASTRO_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'calendario',
    pathMatch: 'full',
  },
  {
    path: 'calendario',
    data: { breadcrumb: 'Calendário' },
    loadChildren: () =>
      import('./calendario/calendario.routes').then((m) => m.CALENDARIO_ROUTES),
  },
];
