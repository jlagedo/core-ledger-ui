import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { signal } from '@angular/core';
import { DataTable } from './data-table';
import { TableColumn } from './table-column.interface';
import { DataTableStore } from './data-table-store.interface';
import { provideTestDependencies } from '../../../testing/test-helpers';

interface TestItem {
  id: number;
  name: string;
  status: string;
  createdAt: string;
}

describe('DataTable', () => {
  let component: DataTable<TestItem>;
  let fixture: ComponentFixture<DataTable<TestItem>>;

  const mockStore: DataTableStore = {
    searchTerm: signal(''),
    page: signal(1),
    pageSize: signal(15),
    sortColumn: signal('name'),
    sortDirection: signal('asc'),
    setSort: vi.fn(),
    resetSort: vi.fn(),
    setPage: vi.fn(),
    setPageSize: vi.fn(),
    setSearchTerm: vi.fn(),
  };

  const mockColumns: TableColumn<TestItem>[] = [
    {
      key: 'id',
      label: 'ID',
      sortable: true,
      headerClass: 'text-end',
      cellClass: 'text-end',
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
    },
    {
      key: 'status',
      label: 'Status',
      sortable: false,
    },
  ];

  const mockData: TestItem[] = [
    { id: 1, name: 'Item 1', status: 'active', createdAt: '2024-01-01' },
    { id: 2, name: 'Item 2', status: 'inactive', createdAt: '2024-01-02' },
    { id: 3, name: 'Item 3', status: 'active', createdAt: '2024-01-03' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataTable],
      providers: [...provideTestDependencies()],
    }).compileComponents();

    fixture = TestBed.createComponent(DataTable<TestItem>);
    component = fixture.componentInstance;

    // Set required inputs
    fixture.componentRef.setInput('columns', mockColumns);
    fixture.componentRef.setInput('data', mockData);
    fixture.componentRef.setInput('store', mockStore);
    fixture.componentRef.setInput('totalCount', 100);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('inputs', () => {
    it('should accept and display columns', () => {
      expect(component.columns()).toEqual(mockColumns);
    });

    it('should accept and display data', () => {
      expect(component.data()).toEqual(mockData);
    });

    it('should accept store', () => {
      expect(component.store()).toEqual(mockStore);
    });

    it('should accept totalCount', () => {
      expect(component.totalCount()).toBe(100);
    });

    it('should use default trackBy of "id"', () => {
      expect(component.trackBy()).toBe('id');
    });
  });

  describe('sorting functionality', () => {
    it('should call store.setSort when sorting with direction', () => {
      const reloadSpy = vi.fn();
      component.reload.subscribe(reloadSpy);

      component.onSort({ column: 'name', direction: 'desc' });

      expect(mockStore.setSort).toHaveBeenCalledWith('name', 'desc');
      expect(reloadSpy).toHaveBeenCalled();
    });

    it('should call store.resetSort when clearing sort', () => {
      const reloadSpy = vi.fn();
      component.reload.subscribe(reloadSpy);

      component.onSort({ column: 'name', direction: '' });

      expect(mockStore.resetSort).toHaveBeenCalled();
      expect(reloadSpy).toHaveBeenCalled();
    });

    it('should handle ascending sort', () => {
      component.onSort({ column: 'id', direction: 'asc' });
      expect(mockStore.setSort).toHaveBeenCalledWith('id', 'asc');
    });
  });

  describe('pagination functionality', () => {
    it('should call store.setPageSize and emit reload on page size change', () => {
      const reloadSpy = vi.fn();
      component.reload.subscribe(reloadSpy);

      component.onPageSizeChange(50);

      expect(mockStore.setPageSize).toHaveBeenCalledWith(50);
      expect(reloadSpy).toHaveBeenCalled();
    });

    it('should call store.setPage and emit reload on page change', () => {
      const reloadSpy = vi.fn();
      component.reload.subscribe(reloadSpy);

      component.onPageChange(3);

      expect(mockStore.setPage).toHaveBeenCalledWith(3);
      expect(reloadSpy).toHaveBeenCalled();
    });

    it('should calculate collectionSize from totalCount', () => {
      expect(component.collectionSize()).toBe(100);

      fixture.componentRef.setInput('totalCount', 250);
      expect(component.collectionSize()).toBe(250);
    });
  });

  describe('active row management', () => {
    it('should set active row on click', () => {
      const item = mockData[0];
      component.setActiveRow(item);

      expect(component.activeRowId()).toBe(1);
    });

    it('should clear active row', () => {
      const item = mockData[0];
      component.setActiveRow(item);
      expect(component.activeRowId()).toBe(1);

      component.clearActiveRow();
      expect(component.activeRowId()).toBeNull();
    });

    it('should use custom trackBy property', () => {
      fixture.componentRef.setInput('trackBy', 'name');
      const item = mockData[0];

      component.setActiveRow(item);
      expect(component.activeRowId()).toBe('Item 1');
    });
  });

  describe('cell value handling', () => {
    it('should get cell value by key', () => {
      const item = mockData[0];
      const column = mockColumns[1]; // name column

      const value = component.getCellValue(item, column);
      expect(value).toBe('Item 1');
    });

    it('should get nested cell value using propertyPath', () => {
      const nestedItem = {
        id: 1,
        name: 'Test',
        user: { name: 'John Doe' },
      } as any;

      const column: TableColumn<any> = {
        key: 'userName',
        label: 'User',
        propertyPath: 'user.name',
      };

      const value = component.getCellValue(nestedItem, column);
      expect(value).toBe('John Doe');
    });

    it('should handle null values gracefully', () => {
      const item = { id: 1, name: null } as any;
      const column = mockColumns[1];

      const value = component.formatCellValue(item, column);
      expect(value).toBe('');
    });

    it('should apply formatter function when provided', () => {
      const column: TableColumn<TestItem> = {
        key: 'createdAt',
        label: 'Created',
        formatter: (value) => `Date: ${value}`,
      };

      const item = mockData[0];
      const formatted = component.formatCellValue(item, column);

      expect(formatted).toBe('Date: 2024-01-01');
    });

    it('should pass item to formatter function', () => {
      const formatterSpy = vi.fn((value, item) => `${item.name}: ${value}`);
      const column: TableColumn<TestItem> = {
        key: 'status',
        label: 'Status',
        formatter: formatterSpy,
      };

      const item = mockData[0];
      component.formatCellValue(item, column);

      expect(formatterSpy).toHaveBeenCalledWith('active', item);
    });
  });

  describe('cell context', () => {
    it('should create correct context for template', () => {
      const item = mockData[0];
      const column = mockColumns[0];
      const index = 0;

      const context = component.getCellContext(item, column, index);

      expect(context).toEqual({
        $implicit: item,
        column: 'id',
        index: 0,
      });
    });
  });

  describe('trackBy function', () => {
    it('should track items by default id property', () => {
      const item = mockData[0];
      const tracked = component.trackByFn(0, item);

      expect(tracked).toBe(1);
    });

    it('should track items by custom property', () => {
      fixture.componentRef.setInput('trackBy', 'name');

      const item = mockData[1];
      const tracked = component.trackByFn(1, item);

      expect(tracked).toBe('Item 2');
    });
  });
});
