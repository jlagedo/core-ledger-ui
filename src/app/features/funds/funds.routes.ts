import {Routes} from '@angular/router';
import {FundList} from './fund-list';
import {FundForm} from './fund-form/fund-form';

export const FUNDS_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    data: {breadcrumb: 'Fund List'},
    component: FundList
  },
  {
    path: 'new',
    data: {breadcrumb: 'Create Fund'},
    component: FundForm
  }
];
