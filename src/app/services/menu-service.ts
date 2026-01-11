import { Injectable, signal } from '@angular/core';
import { MenuItem } from '../models/menu-item.model';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private readonly _menuItems = signal<MenuItem[]>([
    {
      label: 'Visão Geral',
      icon: 'bi-grid-fill',
      route: '/dashboard',
      exactMatch: true,
    },
    {
      label: 'Fundos',
      icon: 'bi-briefcase',
      children: [
        {
          label: 'Lista de Fundos',
          icon: '',
          route: '/funds/list',
        },
      ],
    },
    {
      label: 'Transações',
      icon: 'bi-arrow-left-right',
      children: [
        {
          label: 'Capturar Transação',
          icon: '',
          route: '/transactions/capture',
        },
      ],
    },
    {
      label: 'Administração',
      icon: 'bi-gear',
      children: [
        {
          label: 'Títulos',
          icon: '',
          route: '/admin/securities',
        },
      ],
    },
    {
      label: 'Razão',
      icon: 'bi-book',
      children: [
        {
          label: 'Plano de Contas',
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
        {
          label: 'Indexadores',
          icon: '',
          route: '/cadastro/indexadores',
        },
      ],
    },
  ]);

  readonly menuItems = this._menuItems.asReadonly();
}
