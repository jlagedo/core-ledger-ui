import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { 
        path: 'dashboard', 
        loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard)
    },
    { 
        path: 'chart-of-accounts', 
        loadChildren: () => import('./features/chart-of-accounts/chart-of-accounts.routes').then(m => m.CHART_OF_ACCOUNTS_ROUTES)
    },
    { 
        path: 'journal-entries', 
        loadComponent: () => import('./features/journal-entries/journal-entries').then(m => m.JournalEntries)
    },
    { 
        path: 'posting-periods', 
        loadComponent: () => import('./features/posting-periods/posting-periods').then(m => m.PostingPeriods)
    },
    { 
        path: 'balances-reports', 
        loadComponent: () => import('./features/balances-reports/balances-reports').then(m => m.BalancesReports)
    },
    { 
        path: 'administration', 
        loadComponent: () => import('./features/administration/administration').then(m => m.Administration)
    },
    { path: '**', redirectTo: '/dashboard' }
];
