import {Routes} from '@angular/router';
import {PricingValuation} from './pricing-valuation';
import {LoadPrices} from './load-prices';
import {PriceHistory} from './price-history';
import {RunValuation} from './run-valuation';

export const PRICING_VALUATION_ROUTES: Routes = [
  {
    path: '',
    component: PricingValuation,
  },
  {
    path: 'load-prices',
    data: {breadcrumb: 'Load Prices'},
    component: LoadPrices
  },
  {
    path: 'price-history',
    data: {breadcrumb: 'Price History'},
    component: PriceHistory
  },
  {
    path: 'run-valuation',
    data: {breadcrumb: 'Run Valuation'},
    component: RunValuation
  }
];
