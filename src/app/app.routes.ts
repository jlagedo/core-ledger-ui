import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    data: { breadcrumb: 'Overview' },
    loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard)
  },
  {
    path: 'chart-of-accounts',
    data: { breadcrumb: 'Ledger' },
    loadChildren: () => import('./features/chart-of-accounts/chart-of-accounts.routes').then(m => m.CHART_OF_ACCOUNTS_ROUTES)
  },
  {
    path: 'journal-entries',
    data: { breadcrumb: 'Journal' },
    loadChildren: () => import('./features/journal-entries/journal-entries.routes').then(m => m.JOURNAL_ENTRIES_ROUTES)
  },
  {
    path: 'posting-periods',
    data: { breadcrumb: 'Periods' },
    loadChildren: () => import('./features/posting-periods/posting-periods.routes').then(m => m.POSTING_PERIODS_ROUTES)
  },
  {
    path: 'balances-reports',
    data: { breadcrumb: 'Reports' },
    loadChildren: () => import('./features/balances-reports/balances-reports.routes').then(m => m.BALANCES_REPORTS_ROUTES)
  },
  {
    path: 'administration',
    data: { breadcrumb: 'Settings' },
    loadChildren: () => import('./features/administration/administration.routes').then(m => m.ADMINISTRATION_ROUTES)
  },
  { path: '**', redirectTo: '/dashboard' }
];
