import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { vi } from 'vitest';

import { ChartOfAccounts } from './chart-of-accounts';
import { provideTestDependencies } from '../../testing/test-helpers';

describe('ChartOfAccounts', () => {
  let component: ChartOfAccounts;
  let fixture: ComponentFixture<ChartOfAccounts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartOfAccounts],
      providers: [...provideTestDependencies(), provideHttpClientTesting()]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ChartOfAccounts);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Row Selection Features', () => {
    it('should initialize activeRowId as null', () => {
      expect(component.activeRowId()).toBeNull();
    });

    it('should set activeRowId when calling setActiveRow', () => {
      component.setActiveRow(5);
      expect(component.activeRowId()).toBe(5);
    });

    it('should clear activeRowId when calling clearActiveRow', () => {
      component.setActiveRow(5);
      expect(component.activeRowId()).toBe(5);

      component.clearActiveRow();
      expect(component.activeRowId()).toBeNull();
    });

    it('should set activeRowId when dropdown opens', () => {
      component.onDropdownOpenChange(true, 10);
      expect(component.activeRowId()).toBe(10);
    });

    it('should clear activeRowId when dropdown closes', () => {
      component.setActiveRow(10);
      expect(component.activeRowId()).toBe(10);

      component.onDropdownOpenChange(false, 10);
      expect(component.activeRowId()).toBeNull();
    });

    it('should support multiple row selections in sequence', () => {
      component.setActiveRow(1);
      expect(component.activeRowId()).toBe(1);

      component.setActiveRow(2);
      expect(component.activeRowId()).toBe(2);

      component.setActiveRow(3);
      expect(component.activeRowId()).toBe(3);
    });

    it('should handle dropdown interactions for different rows', () => {
      // Dropdown opens for row 1
      component.onDropdownOpenChange(true, 1);
      expect(component.activeRowId()).toBe(1);

      // Dropdown closes for row 1
      component.onDropdownOpenChange(false, 1);
      expect(component.activeRowId()).toBeNull();

      // Dropdown opens for row 2
      component.onDropdownOpenChange(true, 2);
      expect(component.activeRowId()).toBe(2);
    });

    it('should clear activeRowId when any dropdown closes', () => {
      component.onDropdownOpenChange(true, 5);
      expect(component.activeRowId()).toBe(5);

      // User clicks row 10 while dropdown 5 is open
      component.setActiveRow(10);
      expect(component.activeRowId()).toBe(10);

      // Close dropdown for row 5 - this clears all active rows
      component.onDropdownOpenChange(false, 5);
      // activeRowId should be cleared
      expect(component.activeRowId()).toBeNull();
    });
  });

  describe('Data Loading Features', () => {
    it('should have initial empty accountsResponse', () => {
      expect(component.accountsResponse()).toBeNull();
    });

    it('should calculate collectionSize from accountsResponse', () => {
      expect(component.collectionSize()).toBe(0);

      component.accountsResponse.set({
        items: [],
        totalCount: 100,
        limit: 15,
        offset: 0
      });

      expect(component.collectionSize()).toBe(100);
    });

    it('should trim search value in onSearch', () => {
      vi.spyOn(component.store, 'setSearchTerm');
      vi.spyOn(component, 'loadAccounts');

      component.onSearch('  test  ');

      expect(component.store.setSearchTerm).toHaveBeenCalledWith('test');
      expect(component.loadAccounts).toHaveBeenCalled();
    });

    it('should reset sort when direction is empty', () => {
      vi.spyOn(component.store, 'resetSort');
      vi.spyOn(component, 'loadAccounts');

      component.onSort({ column: 'name', direction: '' });

      expect(component.store.resetSort).toHaveBeenCalled();
      expect(component.loadAccounts).toHaveBeenCalled();
    });

    it('should set sort when direction is provided', () => {
      vi.spyOn(component.store, 'setSort');
      vi.spyOn(component, 'loadAccounts');

      component.onSort({ column: 'code', direction: 'asc' });

      expect(component.store.setSort).toHaveBeenCalledWith('code', 'asc');
      expect(component.loadAccounts).toHaveBeenCalled();
    });

    it('should change page size and reload', () => {
      vi.spyOn(component.store, 'setPageSize');
      vi.spyOn(component, 'loadAccounts');

      component.onPageSizeChange(50);

      expect(component.store.setPageSize).toHaveBeenCalledWith(50);
      expect(component.loadAccounts).toHaveBeenCalled();
    });
  });
});
