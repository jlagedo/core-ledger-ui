import { Routes } from '@angular/router';
import { Portfolio } from './portfolio';
import { Holdings } from './holdings';
import { CashLedger } from './cash-ledger';
import { ValuationSummary } from './valuation-summary';

export const PORTFOLIO_ROUTES: Routes = [
    {
        path: '',
        component: Portfolio,
    },
    {
        path: 'holdings',
        data: { breadcrumb: 'Holdings' },
        component: Holdings
    },
    {
        path: 'cash-ledger',
        data: { breadcrumb: 'Cash Ledger' },
        component: CashLedger
    },
    {
        path: 'valuation',
        data: { breadcrumb: 'Valuation Summary' },
        component: ValuationSummary
    }
];
