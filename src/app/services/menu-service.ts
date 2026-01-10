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
      label: 'Cadastro',
      icon: 'bi-folder-plus',
      children: [
        {
          label: 'Calendário',
          icon: '',
          route: '/cadastro/calendario',
        },
      ],
    },
  ]);

  readonly menuItems = this._menuItems.asReadonly();
}
