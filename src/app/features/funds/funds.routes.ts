import { Routes } from '@angular/router';
import { Funds } from './funds';
import { FundList } from './fund-list';
import { FundDetails } from './fund-details';
import { ShareClasses } from './share-classes';

export const FUNDS_ROUTES: Routes = [
    {
        path: '',
        component: Funds,
    },
    {
        path: 'list',
        data: { breadcrumb: 'Fund List' },
        component: FundList
    },
    {
        path: 'share-classes',
        data: { breadcrumb: 'Share Classes' },
        component: ShareClasses
    },
    {
        path: ':id',
        data: { breadcrumb: 'Fund Details' },
        component: FundDetails
    }
];
