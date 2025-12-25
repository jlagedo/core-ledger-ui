import {Routes} from '@angular/router';
import {ChartOfAccounts} from './chart-of-accounts';
import {AccountForm} from './account-form/account-form';

export const CHART_OF_ACCOUNTS_ROUTES: Routes = [
  {
    path: '',
    data: {breadcrumb: 'List'},
    component: ChartOfAccounts,
  },
  {
    path: 'new',
    data: {breadcrumb: 'New Account'},
    component: AccountForm
  }
];
