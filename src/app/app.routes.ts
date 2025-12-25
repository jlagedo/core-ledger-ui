import {Routes} from '@angular/router';

export const routes: Routes = [
  {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
  {
    path: 'dashboard',
    data: {breadcrumb: 'Dashboard'},
    loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard)
  },
  {
    path: 'chart-of-accounts',
    data: {breadcrumb: 'Chart of Accounts'},
    loadChildren: () => import('./features/chart-of-accounts/chart-of-accounts.routes').then(m => m.CHART_OF_ACCOUNTS_ROUTES)
  },
  {
    path: 'journal-entries',
    data: {breadcrumb: 'Journal Entries Routes'},
    loadComponent: () => import('./features/journal-entries/journal-entries').then(m => m.JournalEntries)
  },
  {
    path: 'posting-periods',
    data: {breadcrumb: 'Posting Periods'},
    loadComponent: () => import('./features/posting-periods/posting-periods').then(m => m.PostingPeriods)
  },
  {
    path: 'balances-reports',
    data: {breadcrumb: 'Balances Reports'},
    loadComponent: () => import('./features/balances-reports/balances-reports').then(m => m.BalancesReports)
  },
  {
    path: 'administration',
    data: {breadcrumb: 'Administration'},
    loadComponent: () => import('./features/administration/administration').then(m => m.Administration)
  },
  {path: '**', redirectTo: '/dashboard'}
];
