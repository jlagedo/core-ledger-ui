import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { signal } from '@angular/core';
import { DataGrid, PaginatedResponse } from './data-grid';
import { ColumnDefinition } from './column-definition.model';

describe('DataGrid', () => {
  let component: DataGrid<TestItem>;
  let fixture: ComponentFixture<DataGrid<TestItem>>;
  let mockStore: any;

  interface TestItem {
    id: number;
    name: string;
    age: number;
  }

  const mockTestItems: TestItem[] = [
    { id: 1, name: 'Alice', age: 30 },
    { id: 2, name: 'Bob', age: 25 },
    { id: 3, name: 'Charlie', age: 35 },
  ];

  const mockPaginatedResponse: PaginatedResponse<TestItem> = {
    items: mockTestItems,
    totalCount: 3,
    limit: 15,
    offset: 0,
  };

  const mockColumns: ColumnDefinition<TestItem>[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'age', label: 'Age', sortable: true, align: 'end' },
  ];

  function createMockStore() {
    return {
      searchTerm: signal(''),
      page: signal(1),
      pageSize: signal(15),
      sortColumn: signal('name'),
      sortDirection: signal<'asc' | 'desc'>('asc'),
      setSearchTerm: vi.fn(),
      setPage: vi.fn(),
      setPageSize: vi.fn(),
      setSort: vi.fn(),
      resetSort: vi.fn(),
    };
  }

  beforeEach(async () => {
    mockStore = createMockStore();

    await TestBed.configureTestingModule({
      imports: [DataGrid],
    }).compileComponents();

    fixture = TestBed.createComponent(DataGrid<TestItem>);
    component = fixture.componentInstance;

    // Set required inputs
    fixture.componentRef.setInput('store', mockStore);
    fixture.componentRef.setInput('data', mockPaginatedResponse);
    fixture.componentRef.setInput('columns', mockColumns);

    fixture.detectChanges();

    // Wait for defer block and effects to resolve
    await fixture.whenStable();
    TestBed.flushEffects();
    fixture.detectChanges();
    await fixture.whenStable();
  });

  // 1. Component Initialization
  it('should create with required inputs', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default optional inputs', () => {
    expect(component.searchable()).toBe(true);
    expect(component.selectable()).toBe(false);
    expect(component.loading()).toBe(false);
  });

  // 2. Rendering Tests
  it('should render correct number of column headers', () => {
    const headers = fixture.nativeElement.querySelectorAll('thead th');
    expect(headers.length).toBe(2); // name + age
  });

  it('should render data rows', () => {
    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows.length).toBe(3);
  });

  it('should display empty message when no data', () => {
    fixture.componentRef.setInput('data', {
      items: [],
      totalCount: 0,
      limit: 15,
      offset: 0,
    });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('No data available');
  });

  it('should display custom empty message', () => {
    fixture.componentRef.setInput('data', {
      items: [],
      totalCount: 0,
      limit: 15,
      offset: 0,
    });
    fixture.componentRef.setInput('emptyMessage', 'No items found');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('No items found');
  });

  // 3. Search Functionality
  it('should call store.setSearchTerm when search triggered', () => {
    component.onSearch('test query');
    expect(mockStore.setSearchTerm).toHaveBeenCalledWith('test query');
  });

  it('should emit refresh event after search', () => {
    const refreshSpy = vi.fn();
    component.refresh.subscribe(refreshSpy);

    component.onSearch('test');
    expect(refreshSpy).toHaveBeenCalled();
  });

  it('should trim search value before storing', () => {
    component.onSearch('  test  ');
    expect(mockStore.setSearchTerm).toHaveBeenCalledWith('test');
  });

  // 4. Sorting Tests
  it('should call store.setSort when sorting', () => {
    component.onSort({ column: 'name', direction: 'asc' });
    expect(mockStore.setSort).toHaveBeenCalledWith('name', 'asc');
  });

  it('should call store.resetSort when direction is empty', () => {
    component.onSort({ column: 'name', direction: '' });
    expect(mockStore.resetSort).toHaveBeenCalled();
  });

  it('should emit refresh after sort change', () => {
    const refreshSpy = vi.fn();
    component.refresh.subscribe(refreshSpy);

    component.onSort({ column: 'name', direction: 'desc' });
    expect(refreshSpy).toHaveBeenCalled();
  });

  // 5. Pagination Tests
  it('should update store when page changes', () => {
    component.onPageChange(3);
    expect(mockStore.setPage).toHaveBeenCalledWith(3);
  });

  it('should update store when page size changes', () => {
    component.onPageSizeChange(50);
    expect(mockStore.setPageSize).toHaveBeenCalledWith(50);
  });

  it('should emit refresh when page changes', () => {
    const refreshSpy = vi.fn();
    component.refresh.subscribe(refreshSpy);

    component.onPageChange(2);
    expect(refreshSpy).toHaveBeenCalled();
  });

  it('should emit refresh when page size changes', () => {
    const refreshSpy = vi.fn();
    component.refresh.subscribe(refreshSpy);

    component.onPageSizeChange(50);
    expect(refreshSpy).toHaveBeenCalled();
  });

  it('should compute correct collection size', () => {
    expect(component.collectionSize()).toBe(3);
  });

  // 6. Row Selection Tests (NEW FEATURE - CRITICAL)
  it('should select individual item', () => {
    const item = mockTestItems[0];
    component.toggleItemSelection(item);

    expect(component.isItemSelected(item)).toBe(true);
  });

  it('should deselect item when toggled again', () => {
    const item = mockTestItems[0];

    component.toggleItemSelection(item);
    expect(component.isItemSelected(item)).toBe(true);

    component.toggleItemSelection(item);
    expect(component.isItemSelected(item)).toBe(false);
  });

  it('should select all items on current page', () => {
    component.toggleSelectAll();

    const state = component.selectionState();
    expect(state.allSelected).toBe(true);
    expect(state.selectedItems.length).toBe(3);
  });

  it('should deselect all when toggling select-all twice', () => {
    component.toggleSelectAll(); // Select all
    component.toggleSelectAll(); // Deselect all

    const state = component.selectionState();
    expect(state.allSelected).toBe(false);
    expect(state.selectedItems.length).toBe(0);
  });

  it('should show indeterminate state when some items selected', () => {
    component.toggleItemSelection(mockTestItems[0]);

    const state = component.selectionState();
    expect(state.indeterminate).toBe(true);
    expect(state.allSelected).toBe(false);
  });

  it('should emit selectionChange when selection updates', () => {
    const selectionSpy = vi.fn();
    component.selectionChange.subscribe(selectionSpy);

    component.toggleItemSelection(mockTestItems[0]);
    TestBed.flushEffects(); // Flush effects to trigger selectionChange emission

    expect(selectionSpy).toHaveBeenCalledWith([mockTestItems[0]]);
  });

  it('should clear all selections', () => {
    component.toggleSelectAll();
    expect(component.selectionState().selectedItems.length).toBe(3);

    component.clearSelection();
    expect(component.selectionState().selectedItems.length).toBe(0);
  });

  it('should preserve selections across pages', () => {
    // Select item on page 1
    component.toggleItemSelection(mockTestItems[0]);
    expect(component.selectionState().selectedItems.length).toBe(1);

    // Change page
    component.onPageChange(2);

    // Selection should persist
    expect(component.isItemSelected(mockTestItems[0])).toBe(true);
  });

  // 7. Custom Template/Formatter Tests
  it('should use formatter when provided', () => {
    const formatter = vi.fn().mockReturnValue('FORMATTED');
    const columnsWithFormatter: ColumnDefinition<TestItem>[] = [
      { key: 'name', label: 'Name', formatter },
    ];

    fixture.componentRef.setInput('columns', columnsWithFormatter);
    fixture.detectChanges();

    expect(formatter).toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).toContain('FORMATTED');
  });

  it('should display raw value when no formatter provided', () => {
    expect(component.getFormattedValue(mockTestItems[0], mockColumns[0])).toBe('Alice');
  });

  it('should handle null values in formatter', () => {
    const itemWithNull = { id: 4, name: null as any, age: 40 };
    expect(component.getFormattedValue(itemWithNull, mockColumns[0])).toBe('');
  });

  // 8. Error Handling
  it('should display error message when provided', () => {
    fixture.componentRef.setInput('errorMessage', 'Failed to load data');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Failed to load data');
  });

  // 9. Row Interactions
  it('should emit rowClick when row is clicked', () => {
    const rowClickSpy = vi.fn();
    component.rowClick.subscribe(rowClickSpy);

    component.onRowClick(mockTestItems[0]);

    expect(rowClickSpy).toHaveBeenCalledWith(mockTestItems[0]);
  });

  it('should set active row on click', () => {
    component.onRowClick(mockTestItems[0]);

    expect(component.activeRowId()).toBe(1);
  });

  // 10. Helper Methods
  it('should get cell value correctly', () => {
    const value = component.getCellValue(mockTestItems[0], mockColumns[0]);
    expect(value).toBe('Alice');
  });

  it('should get sort key from column', () => {
    const sortKey = component.getSortKey(mockColumns[0]);
    expect(sortKey).toBe('name');
  });

  it('should use custom sortKey if provided', () => {
    const columnWithSortKey: ColumnDefinition<TestItem> = {
      key: 'name',
      label: 'Name',
      sortable: true,
      sortKey: 'customName',
    };
    const sortKey = component.getSortKey(columnWithSortKey);
    expect(sortKey).toBe('customName');
  });

  it('should get item ID from object with id property', () => {
    const id = component.getItemId(mockTestItems[0]);
    expect(id).toBe(1);
  });

  it('should fallback to JSON.stringify for items without id', () => {
    const itemWithoutId = { name: 'Test', age: 25 };
    const id = component.getItemId(itemWithoutId as any);
    expect(id).toBe(JSON.stringify(itemWithoutId));
  });

  it('should create correct cell context', () => {
    const context = component.getCellContext(mockTestItems[0], mockColumns[0], 0);

    expect(context.$implicit).toBe(mockTestItems[0]);
    expect(context.value).toBe('Alice');
    expect(context.column).toBe(mockColumns[0]);
    expect(context.index).toBe(0);
  });

  // 11. Computed Signals
  it('should compute current page items', () => {
    expect(component.currentPageItems()).toEqual(mockTestItems);
  });

  // 12. Column Visibility
  it('should hide columns on mobile when hideOnMobile is true', () => {
    const columnsWithMobileHide: ColumnDefinition<TestItem>[] = [
      { key: 'name', label: 'Name' },
      { key: 'age', label: 'Age', hideOnMobile: true },
    ];

    fixture.componentRef.setInput('columns', columnsWithMobileHide);
    fixture.detectChanges();

    const headers = fixture.nativeElement.querySelectorAll('thead th');
    const ageHeader = headers[1];

    expect(ageHeader.classList.contains('d-none')).toBe(true);
    expect(ageHeader.classList.contains('d-md-table-cell')).toBe(true);
  });

  // 13. Search Box Visibility
  it('should show search box when searchable is true', () => {
    fixture.componentRef.setInput('searchable', true);
    fixture.detectChanges();

    const searchInput = fixture.nativeElement.querySelector('input[type="text"]');
    expect(searchInput).toBeTruthy();
  });

  it('should hide search box when searchable is false', () => {
    fixture.componentRef.setInput('searchable', false);
    fixture.detectChanges();

    const searchInput = fixture.nativeElement.querySelector('input[type="text"]');
    expect(searchInput).toBeFalsy();
  });

  // 14. Selection Checkboxes Visibility
  it('should show selection checkboxes when selectable is true', () => {
    fixture.componentRef.setInput('selectable', true);
    fixture.detectChanges();

    const checkboxes = fixture.nativeElement.querySelectorAll('input[type="checkbox"]');
    expect(checkboxes.length).toBeGreaterThan(0);
  });

  it('should hide selection checkboxes when selectable is false', () => {
    fixture.componentRef.setInput('selectable', false);
    fixture.detectChanges();

    const checkboxes = fixture.nativeElement.querySelectorAll('input[type="checkbox"]');
    expect(checkboxes.length).toBe(0);
  });
});
