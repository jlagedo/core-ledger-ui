import {Routes} from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'securities',
    pathMatch: 'full'
  },
  {
    path: 'securities',
    data: {breadcrumb: 'Securities'},
    loadChildren: () => import('./securities/securities.routes').then(m => m.SECURITIES_ROUTES)
  }
];
