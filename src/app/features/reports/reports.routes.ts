import { Routes } from '@angular/router';
import { Reports } from './reports';
import { HoldingsReport } from './holdings-report';
import { CashReport } from './cash-report';
import { TransactionReport } from './transaction-report';
import { NavReport } from './nav-report';

export const REPORTS_ROUTES: Routes = [
    {
        path: '',
        component: Reports,
    },
    {
        path: 'holdings',
        data: { breadcrumb: 'Holdings Report' },
        component: HoldingsReport
    },
    {
        path: 'cash',
        data: { breadcrumb: 'Cash Report' },
        component: CashReport
    },
    {
        path: 'transactions',
        data: { breadcrumb: 'Transaction Report' },
        component: TransactionReport
    },
    {
        path: 'nav',
        data: { breadcrumb: 'NAV Report' },
        component: NavReport
    }
];
