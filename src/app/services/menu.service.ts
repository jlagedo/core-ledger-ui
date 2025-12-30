import { Injectable, signal } from '@angular/core';
import { MenuItem } from '../models/menu-item.model';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private readonly _menuItems = signal<MenuItem[]>([
    {
      label: 'Overview',
      icon: 'bi-grid-fill',
      route: '/dashboard',
      exactMatch: true,
    },
    {
      label: 'Funds',
      icon: 'bi-briefcase',
      children: [
        {
          label: 'Fund List',
          icon: '',
          route: '/funds/list',
        },
        {
          label: 'Share Classes',
          icon: '',
          route: '/funds/share-classes',
        },
      ],
    },
    {
      label: 'Portfolio',
      icon: 'bi-folder',
      children: [
        {
          label: 'Holdings',
          icon: '',
          route: '/portfolio/holdings',
        },
        {
          label: 'Cash Ledger',
          icon: '',
          route: '/portfolio/cash-ledger',
        },
        {
          label: 'Valuation Summary',
          icon: '',
          route: '/portfolio/valuation',
        },
      ],
    },
    {
      label: 'Transactions',
      icon: 'bi-arrow-left-right',
      children: [
        {
          label: 'Capture Transaction',
          icon: '',
          route: '/transactions/capture',
        },
        {
          label: 'Transaction Ledger',
          icon: '',
          route: '/transactions/ledger',
        },
        {
          label: 'Import',
          icon: '',
          route: '/transactions/import',
        },
      ],
    },
    {
      label: 'Pricing & Valuation',
      icon: 'bi-currency-dollar',
      children: [
        {
          label: 'Load Prices',
          icon: '',
          route: '/pricing-valuation/load-prices',
        },
        {
          label: 'Price History',
          icon: '',
          route: '/pricing-valuation/price-history',
        },
        {
          label: 'Run Valuation',
          icon: '',
          route: '/pricing-valuation/run-valuation',
        },
      ],
    },
    {
      label: 'NAV',
      icon: 'bi-calculator',
      children: [
        {
          label: 'NAV Calculation',
          icon: '',
          route: '/nav/calculation',
        },
        {
          label: 'NAV History',
          icon: '',
          route: '/nav/history',
        },
        {
          label: 'NAV Breakdown',
          icon: '',
          route: '/nav/breakdown',
        },
      ],
    },
    {
      label: 'Reports',
      icon: 'bi-file-earmark-text',
      children: [
        {
          label: 'Holdings Report',
          icon: '',
          route: '/reports/holdings',
        },
        {
          label: 'Cash Report',
          icon: '',
          route: '/reports/cash',
        },
        {
          label: 'Transaction Report',
          icon: '',
          route: '/reports/transactions',
        },
        {
          label: 'NAV Report',
          icon: '',
          route: '/reports/nav',
        },
      ],
    },
    {
      label: 'Admin',
      icon: 'bi-gear',
      children: [
        {
          label: 'Securities',
          icon: '',
          route: '/admin/securities',
        },
        {
          label: 'Pricing Sources',
          icon: '',
          route: '/admin/pricing-sources',
        },
        {
          label: 'Currencies',
          icon: '',
          route: '/admin/currencies',
        },
        {
          label: 'Users',
          icon: '',
          route: '/admin/users',
        },
      ],
    },
    {
      label: 'Ledger',
      icon: 'bi-book',
      children: [
        {
          label: 'Chart of Accounts',
          icon: '',
          route: '/chart-of-accounts',
          exactMatch: true,
        },
      ],
    },
    {
      label: 'Journal',
      icon: 'bi-journal-text',
      route: '/journal-entries',
    },
    {
      label: 'Periods',
      icon: 'bi-calendar3',
      route: '/posting-periods',
    },
    {
      label: 'Balances & Reports',
      icon: 'bi-graph-up',
      route: '/balances-reports',
    },
    {
      label: 'Administration',
      icon: 'bi-sliders',
      route: '/administration',
    },
  ]);

  readonly menuItems = this._menuItems.asReadonly();
}
