import {Routes} from '@angular/router';
import {Transactions} from './transactions';
import {CaptureTransaction} from './capture-transaction';
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
    component: CaptureTransaction
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
