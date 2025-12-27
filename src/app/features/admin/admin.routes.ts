import { Routes } from '@angular/router';
import { Admin } from './admin';
import { PricingSources } from './pricing-sources';
import { Currencies } from './currencies';
import { Users } from './users';

export const ADMIN_ROUTES: Routes = [
    {
        path: '',
        component: Admin,
    },
    {
        path: 'securities',
        data: { breadcrumb: 'Securities' },
        loadChildren: () => import('./securities/securities.routes').then(m => m.SECURITIES_ROUTES)
    },
    {
        path: 'pricing-sources',
        data: { breadcrumb: 'Pricing Sources' },
        component: PricingSources
    },
    {
        path: 'currencies',
        data: { breadcrumb: 'Currencies' },
        component: Currencies
    },
    {
        path: 'users',
        data: { breadcrumb: 'Users' },
        component: Users
    }
];
