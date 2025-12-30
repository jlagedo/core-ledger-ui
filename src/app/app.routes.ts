import { Routes } from '@angular/router';
import { autoLoginPartialRoutesGuard } from 'angular-auth-oidc-client';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/login/login').then(m => m.Login),
  },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    data: { breadcrumb: 'Overview' },
    canActivate: [autoLoginPartialRoutesGuard],
    loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard),
  },
  {
    path: 'funds',
    data: { breadcrumb: 'Funds' },
    canActivate: [autoLoginPartialRoutesGuard],
    loadChildren: () => import('./features/funds/funds.routes').then(m => m.FUNDS_ROUTES),
  },
  {
    path: 'portfolio',
    data: { breadcrumb: 'Portfolio' },
    canActivate: [autoLoginPartialRoutesGuard],
    loadChildren: () => import('./features/portfolio/portfolio.routes').then(m => m.PORTFOLIO_ROUTES),
  },
  {
    path: 'transactions',
    data: { breadcrumb: 'Transactions' },
    canActivate: [autoLoginPartialRoutesGuard],
    loadChildren: () => import('./features/transactions/transactions.routes').then(m => m.TRANSACTIONS_ROUTES),
  },
  {
    path: 'pricing-valuation',
    data: { breadcrumb: 'Pricing & Valuation' },
    canActivate: [autoLoginPartialRoutesGuard],
    loadChildren: () =>
      import('./features/pricing-valuation/pricing-valuation.routes').then(
        m => m.PRICING_VALUATION_ROUTES
      ),
  },
  {
    path: 'nav',
    data: { breadcrumb: 'NAV' },
    canActivate: [autoLoginPartialRoutesGuard],
    loadChildren: () => import('./features/nav/nav.routes').then(m => m.NAV_ROUTES),
  },
  {
    path: 'reports',
    data: { breadcrumb: 'Reports' },
    canActivate: [autoLoginPartialRoutesGuard],
    loadChildren: () => import('./features/reports/reports.routes').then(m => m.REPORTS_ROUTES),
  },
  {
    path: 'admin',
    data: { breadcrumb: 'Admin' },
    canActivate: [autoLoginPartialRoutesGuard],
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES),
  },
  {
    path: 'chart-of-accounts',
    data: { breadcrumb: 'Chart of Accounts' },
    canActivate: [autoLoginPartialRoutesGuard],
    loadChildren: () =>
      import('./features/chart-of-accounts/chart-of-accounts.routes').then(
        m => m.CHART_OF_ACCOUNTS_ROUTES
      ),
  },
  {
    path: 'journal-entries',
    data: { breadcrumb: 'Journal' },
    canActivate: [autoLoginPartialRoutesGuard],
    loadChildren: () =>
      import('./features/journal-entries/journal-entries.routes').then(m => m.JOURNAL_ENTRIES_ROUTES),
  },
  {
    path: 'posting-periods',
    data: { breadcrumb: 'Periods' },
    canActivate: [autoLoginPartialRoutesGuard],
    loadChildren: () =>
      import('./features/posting-periods/posting-periods.routes').then(m => m.POSTING_PERIODS_ROUTES),
  },
  {
    path: 'balances-reports',
    data: { breadcrumb: 'Balances & Reports' },
    canActivate: [autoLoginPartialRoutesGuard],
    loadChildren: () =>
      import('./features/balances-reports/balances-reports.routes').then(
        m => m.BALANCES_REPORTS_ROUTES
      ),
  },
  {
    path: 'administration',
    data: { breadcrumb: 'Administration' },
    canActivate: [autoLoginPartialRoutesGuard],
    loadChildren: () =>
      import('./features/administration/administration.routes').then(m => m.ADMINISTRATION_ROUTES),
  },
  {
    path: 'profile',
    data: { breadcrumb: 'Profile' },
    canActivate: [autoLoginPartialRoutesGuard],
    loadComponent: () => import('./features/profile/profile').then(m => m.Profile),
  },
  { path: '**', redirectTo: '/login' },
];
