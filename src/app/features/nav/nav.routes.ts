import { Routes } from '@angular/router';
import { Nav } from './nav';
import { NavCalculation } from './nav-calculation';
import { NavHistory } from './nav-history';
import { NavBreakdown } from './nav-breakdown';

export const NAV_ROUTES: Routes = [
    {
        path: '',
        component: Nav,
    },
    {
        path: 'calculation',
        data: { breadcrumb: 'NAV Calculation' },
        component: NavCalculation
    },
    {
        path: 'history',
        data: { breadcrumb: 'NAV History' },
        component: NavHistory
    },
    {
        path: 'breakdown',
        data: { breadcrumb: 'NAV Breakdown' },
        component: NavBreakdown
    }
];
