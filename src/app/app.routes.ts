import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    data: { breadcrumb: 'Overview' },
    loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard)
  },
  {
    path: 'funds',
    data: { breadcrumb: 'Funds' },
    loadChildren: () => import('./features/funds/funds.routes').then(m => m.FUNDS_ROUTES)
  },
  {
    path: 'portfolio',
    data: { breadcrumb: 'Portfolio' },
    loadChildren: () => import('./features/portfolio/portfolio.routes').then(m => m.PORTFOLIO_ROUTES)
  },
  {
    path: 'transactions',
    data: { breadcrumb: 'Transactions' },
    loadChildren: () => import('./features/transactions/transactions.routes').then(m => m.TRANSACTIONS_ROUTES)
  },
  {
    path: 'pricing-valuation',
    data: { breadcrumb: 'Pricing & Valuation' },
    loadChildren: () => import('./features/pricing-valuation/pricing-valuation.routes').then(m => m.PRICING_VALUATION_ROUTES)
  },
  {
    path: 'nav',
    data: { breadcrumb: 'NAV' },
    loadChildren: () => import('./features/nav/nav.routes').then(m => m.NAV_ROUTES)
  },
  {
    path: 'reports',
    data: { breadcrumb: 'Reports' },
    loadChildren: () => import('./features/reports/reports.routes').then(m => m.REPORTS_ROUTES)
  },
  {
    path: 'admin',
    data: { breadcrumb: 'Admin' },
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },
  {
    path: 'chart-of-accounts',
    data: { breadcrumb: 'Chart of Accounts' },
    loadChildren: () => import('./features/chart-of-accounts/chart-of-accounts.routes').then(m => m.CHART_OF_ACCOUNTS_ROUTES)
  },
  {
    path: 'journal-entries',
    data: { breadcrumb: 'Journal Entries' },
    loadChildren: () => import('./features/journal-entries/journal-entries.routes').then(m => m.JOURNAL_ENTRIES_ROUTES)
  },
  {
    path: 'posting-periods',
    data: { breadcrumb: 'Posting Periods' },
    loadChildren: () => import('./features/posting-periods/posting-periods.routes').then(m => m.POSTING_PERIODS_ROUTES)
  },
  {
    path: 'balances-reports',
    data: { breadcrumb: 'Balances & Reports' },
    loadChildren: () => import('./features/balances-reports/balances-reports.routes').then(m => m.BALANCES_REPORTS_ROUTES)
  },
  {
    path: 'administration',
    data: { breadcrumb: 'Administration' },
    loadChildren: () => import('./features/administration/administration.routes').then(m => m.ADMINISTRATION_ROUTES)
  },
  { path: '**', redirectTo: '/dashboard' }
];
