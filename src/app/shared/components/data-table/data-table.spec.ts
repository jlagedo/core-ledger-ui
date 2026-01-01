import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DataTable } from './data-table';
import { PaginatedSearchStore, TableColumn } from './data-table.model';

// Test data interface
interface TestItem {
  id: number;
  name: string;
  status: string;
  createdAt: string;
}

// Mock store
class MockStore implements PaginatedSearchStore {
  private _searchTerm = signal('');
  private _page = signal(1);
  private _pageSize = signal(15);
  private _sortColumn = signal('name');
  private _sortDirection = signal<'asc' | 'desc'>('asc');

  searchTerm = this._searchTerm.asReadonly();
  page = this._page.asReadonly();
  pageSize = this._pageSize.asReadonly();
  sortColumn = this._sortColumn.asReadonly();
  sortDirection = this._sortDirection.asReadonly();

  setPage(page: number): void {
    this._page.set(page);
  }

  setPageSize(pageSize: number): void {
    this._pageSize.set(pageSize);
  }

  setSearchTerm(term: string): void {
    this._searchTerm.set(term);
  }

  setSort(column: string, direction: 'asc' | 'desc'): void {
    this._sortColumn.set(column);
    this._sortDirection.set(direction);
  }

  resetSort(): void {
    this._sortColumn.set('name');
    this._sortDirection.set('asc');
  }
}

describe('DataTable', () => {
  let component: DataTable<TestItem>;
  let fixture: ComponentFixture<DataTable<TestItem>>;
  let mockStore: MockStore;

  const testColumns: TableColumn<TestItem>[] = [
    { key: 'id', label: 'ID', sortable: true, align: 'end' },
    { key: 'name', label: 'Name', sortable: true, align: 'start' },
    { key: 'status', label: 'Status', sortable: false, align: 'center' },
    {
      key: 'createdAt',
      label: 'Created At',
      sortable: true,
      align: 'center',
      formatter: (value: string) => new Date(value).toLocaleDateString()
    }
  ];

  const testItems: TestItem[] = [
    { id: 1, name: 'Item 1', status: 'active', createdAt: '2024-01-01' },
    { id: 2, name: 'Item 2', status: 'inactive', createdAt: '2024-01-02' },
    { id: 3, name: 'Item 3', status: 'active', createdAt: '2024-01-03' }
  ];

  beforeEach(async () => {
    mockStore = new MockStore();

    await TestBed.configureTestingModule({
      imports: [DataTable],
      providers: []
    }).compileComponents();

    fixture = TestBed.createComponent(DataTable<TestItem>);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('columns', testColumns);
    fixture.componentRef.setInput('items', testItems);
    fixture.componentRef.setInput('store', mockStore);
    fixture.componentRef.setInput('collectionSize', 100);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display columns', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const headers = compiled.querySelectorAll('thead th');
    expect(headers.length).toBe(testColumns.length);
    expect(headers[0].textContent?.trim()).toBe('ID');
    expect(headers[1].textContent?.trim()).toBe('Name');
  });

  it('should display items', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const rows = compiled.querySelectorAll('tbody tr');
    expect(rows.length).toBe(testItems.length);
  });

  it('should handle sort event', () => {
    const reloadSpy = vi.fn();
    component.reload.subscribe(reloadSpy);

    component.onSort({ column: 'name', direction: 'desc' });

    expect(mockStore.sortColumn()).toBe('name');
    expect(mockStore.sortDirection()).toBe('desc');
    expect(reloadSpy).toHaveBeenCalled();
  });

  it('should handle page change', () => {
    const reloadSpy = vi.fn();
    component.reload.subscribe(reloadSpy);

    component.onPageChange(2);

    expect(mockStore.page()).toBe(2);
    expect(reloadSpy).toHaveBeenCalled();
  });

  it('should set active row', () => {
    component.setActiveRow(testItems[0], 0);
    expect(component.activeRowId()).toBe(0);
  });

  it('should clear active row', () => {
    component.setActiveRow(testItems[0], 0);
    component.clearActiveRow();
    expect(component.activeRowId()).toBeNull();
  });

  it('should check if row is active', () => {
    component.setActiveRow(testItems[0], 0);
    expect(component.isRowActive(testItems[0], 0)).toBe(true);
    expect(component.isRowActive(testItems[1], 1)).toBe(false);
  });

  it('should get cell value', () => {
    const column = testColumns[0];
    const value = component.getCellValue(testItems[0], column);
    expect(value).toBe(1);
  });

  it('should get formatted value', () => {
    const column = testColumns[3]; // has formatter
    const value = component.getFormattedValue(testItems[0], column);
    expect(value).toContain('2024');
  });

  it('should get formatted value without formatter', () => {
    const column = testColumns[1]; // no formatter
    const value = component.getFormattedValue(testItems[0], column);
    expect(value).toBe('Item 1');
  });

  it('should get align class', () => {
    expect(component.getAlignClass('start')).toBe('text-start');
    expect(component.getAlignClass('center')).toBe('text-center');
    expect(component.getAlignClass('end')).toBe('text-end');
    expect(component.getAlignClass()).toBe('text-start');
  });

  it('should calculate colspan correctly without actions', () => {
    expect(component.getColspan()).toBe(testColumns.length);
  });

  it('should use custom accessor function', () => {
    const columnWithAccessor: TableColumn<TestItem> = {
      key: 'custom',
      label: 'Custom',
      accessor: (row) => `${row.name}-${row.id}`
    };
    const value = component.getCellValue(testItems[0], columnWithAccessor);
    expect(value).toBe('Item 1-1');
  });

  it('should reset sort when direction is empty', () => {
    mockStore.setSort('status', 'desc');
    component.onSort({ column: 'status', direction: '' });
    expect(mockStore.sortColumn()).toBe('name');
    expect(mockStore.sortDirection()).toBe('asc');
  });
});

// Test component with custom templates
@Component({
  selector: 'app-test-host',
  template: `
    <app-data-table
      [columns]="columns"
      [items]="items"
      [store]="store"
      [collectionSize]="100">
      <ng-template #cellTemplate let-row let-column="column" let-value="value">
        <span class="custom-cell">{{ value }}</span>
      </ng-template>
      <ng-template #actionsTemplate let-row>
        <button class="custom-action">Action</button>
      </ng-template>
    </app-data-table>
  `,
  imports: [DataTable]
})
class TestHostComponent {
  columns: TableColumn<TestItem>[] = [
    { key: 'name', label: 'Name', sortable: true }
  ];
  items: TestItem[] = [
    { id: 1, name: 'Test', status: 'active', createdAt: '2024-01-01' }
  ];
  store = new MockStore();
}

describe('DataTable with custom templates', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: []
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should render custom cell template', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const customCell = compiled.querySelector('.custom-cell');
    expect(customCell).toBeTruthy();
  });

  it('should render custom actions template', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const customAction = compiled.querySelector('.custom-action');
    expect(customAction).toBeTruthy();
  });

  it('should include actions column when actions template is provided', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const headers = compiled.querySelectorAll('thead th');
    expect(headers.length).toBe(2); // 1 column + 1 actions column
    expect(headers[1].textContent?.trim()).toBe('Actions');
  });
});
