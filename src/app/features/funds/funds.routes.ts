import {Routes} from '@angular/router';
import {FundList} from './fund-list';
import {FundDetails} from './fund-details';
import {ShareClasses} from './share-classes';
import {FundForm} from './fund-form/fund-form';

export const FUNDS_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    data: {breadcrumb: 'Fund List'},
    component: FundList
  },
  {
    path: 'new',
    data: {breadcrumb: 'Create Fund'},
    component: FundForm
  },
  {
    path: 'share-classes',
    data: {breadcrumb: 'Share Classes'},
    component: ShareClasses
  },
  {
    path: ':id',
    data: {breadcrumb: 'Fund Details'},
    component: FundDetails
  }
];
