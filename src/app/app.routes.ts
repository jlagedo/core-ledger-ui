import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/dashboard';
import { ChartOfAccounts } from './features/chart-of-accounts/chart-of-accounts';
import { AccountForm } from './features/chart-of-accounts/account-form/account-form';
import { JournalEntries } from './features/journal-entries/journal-entries';
import { PostingPeriods } from './features/posting-periods/posting-periods';
import { BalancesReports } from './features/balances-reports/balances-reports';
import { Administration } from './features/administration/administration';

export const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: Dashboard },
    { path: 'chart-of-accounts', component: ChartOfAccounts },
    { path: 'chart-of-accounts/new', component: AccountForm },
    { path: 'journal-entries', component: JournalEntries },
    { path: 'posting-periods', component: PostingPeriods },
    { path: 'balances-reports', component: BalancesReports },
    { path: 'administration', component: Administration },
    { path: '**', redirectTo: '/dashboard' }
];
