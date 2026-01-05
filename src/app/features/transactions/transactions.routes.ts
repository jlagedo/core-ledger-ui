import {Routes} from '@angular/router';
import {Transactions} from './transactions';
import {TransactionList} from './transaction-list';
import {TransactionForm} from './transaction-form/transaction-form';
import {TransactionLedger} from './transaction-ledger';
import {ImportTransactions} from './import-transactions';

export const TRANSACTIONS_ROUTES: Routes = [
  {
    path: '',
    component: Transactions,
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
  },
  {
    path: 'ledger',
    data: {breadcrumb: 'Transaction Ledger'},
    component: TransactionLedger
  },
  {
    path: 'import',
    data: {breadcrumb: 'Import'},
    component: ImportTransactions
  }
];
