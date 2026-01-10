import {Routes} from '@angular/router';
import {TransactionList} from './transaction-list';
import {TransactionForm} from './transaction-form/transaction-form';

export const TRANSACTIONS_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'capture',
    pathMatch: 'full'
  },
  {
    path: 'capture',
    data: {breadcrumb: 'Capture Transaction'},
    children: [
      {
        path: '',
        component: TransactionList
      },
      {
        path: 'new',
        data: {breadcrumb: 'New Transaction'},
        component: TransactionForm
      }
    ]
  }
];
