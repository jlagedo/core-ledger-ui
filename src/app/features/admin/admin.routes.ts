import { Routes } from '@angular/router';
import { Admin } from './admin';
import { Securities } from './securities';
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
        component: Securities
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
