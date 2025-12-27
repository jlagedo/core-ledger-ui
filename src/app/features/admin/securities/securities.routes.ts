import { Routes } from '@angular/router';
import { Securities } from './securities';
import { SecurityList } from './security-list';
import { SecurityForm } from './security-form/security-form';

export const SECURITIES_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    data: { breadcrumb: 'Security List' },
    component: SecurityList
  },
  {
    path: 'new',
    data: { breadcrumb: 'Create Security' },
    component: SecurityForm
  },
  {
    path: ':id/edit',
    data: { breadcrumb: 'Edit Security' },
    component: SecurityForm
  }
];
