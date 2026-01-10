import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/login/login').then(m => m.Login),
  },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    data: { breadcrumb: 'Visão Geral' },
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard),
  },
  {
    path: 'funds',
    data: { breadcrumb: 'Fundos' },
    canActivate: [authGuard],
    loadChildren: () => import('./features/funds/funds.routes').then(m => m.FUNDS_ROUTES),
  },
  {
    path: 'transactions',
    data: { breadcrumb: 'Transações' },
    canActivate: [authGuard],
    loadChildren: () => import('./features/transactions/transactions.routes').then(m => m.TRANSACTIONS_ROUTES),
  },
  {
    path: 'admin',
    data: { breadcrumb: 'Administração' },
    canActivate: [authGuard],
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES),
  },
  {
    path: 'chart-of-accounts',
    data: { breadcrumb: 'Plano de Contas' },
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/chart-of-accounts/chart-of-accounts.routes').then(
        m => m.CHART_OF_ACCOUNTS_ROUTES
      ),
  },
  {
    path: 'profile',
    data: { breadcrumb: 'Perfil' },
    canActivate: [authGuard],
    loadComponent: () => import('./features/profile/profile').then(m => m.Profile),
  },
  {
    path: 'cadastro',
    data: { breadcrumb: 'Cadastro' },
    canActivate: [authGuard],
    loadChildren: () => import('./features/cadastro/cadastro.routes').then(m => m.CADASTRO_ROUTES),
  },
  { path: '**', redirectTo: '/login' },
];
