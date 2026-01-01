import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { vi } from 'vitest';

import { SecurityList } from './security-list';
import { provideTestDependencies } from '../../../testing/test-helpers';

describe('SecurityList', () => {
  let component: SecurityList;
  let fixture: ComponentFixture<SecurityList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecurityList],
      providers: [...provideTestDependencies(), provideHttpClientTesting()]
    }).compileComponents();

    fixture = TestBed.createComponent(SecurityList);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Row Selection Features', () => {
    it('should initialize activeRowId as null', () => {
      expect(component.activeRowId()).toBeNull();
    });

    it('should set active row when setActiveRow is called', () => {
      const securityId = 42;
      component.setActiveRow(securityId);

      expect(component.activeRowId()).toBe(securityId);
    });

    it('should clear active row when clearActiveRow is called', () => {
      component.activeRowId.set(42);
      component.clearActiveRow();

      expect(component.activeRowId()).toBeNull();
    });

    it('should set active row when dropdown opens', () => {
      const securityId = 42;
      component.onDropdownOpenChange(true, securityId);

      expect(component.activeRowId()).toBe(securityId);
    });

    it('should clear active row when dropdown closes', () => {
      component.activeRowId.set(42);
      component.onDropdownOpenChange(false, 42);

      expect(component.activeRowId()).toBeNull();
    });

    it('should handle multiple row selections', () => {
      component.setActiveRow(1);
      expect(component.activeRowId()).toBe(1);

      component.setActiveRow(2);
      expect(component.activeRowId()).toBe(2);

      component.clearActiveRow();
      expect(component.activeRowId()).toBeNull();
    });
  });

  describe('Data Loading Features', () => {
    it('should have initial empty securitiesResponse', () => {
      expect(component.securitiesResponse()).toBeNull();
    });

    it('should calculate collectionSize from securitiesResponse', () => {
      expect(component.collectionSize()).toBe(0);

      component.securitiesResponse.set({
        items: [],
        totalCount: 100,
        limit: 15,
        offset: 0
      });

      expect(component.collectionSize()).toBe(100);
    });

    it('should trim search value in onSearch', () => {
      vi.spyOn(component.store, 'setSearchTerm');
      vi.spyOn(component, 'loadSecurities');

      component.onSearch('  AAPL  ');

      expect(component.store.setSearchTerm).toHaveBeenCalledWith('AAPL');
      expect(component.loadSecurities).toHaveBeenCalled();
    });

    it('should reset sort when direction is empty', () => {
      vi.spyOn(component.store, 'resetSort');
      vi.spyOn(component, 'loadSecurities');

      component.onSort({ column: 'ticker', direction: '' });

      expect(component.store.resetSort).toHaveBeenCalled();
      expect(component.loadSecurities).toHaveBeenCalled();
    });

    it('should set sort when direction is provided', () => {
      vi.spyOn(component.store, 'setSort');
      vi.spyOn(component, 'loadSecurities');

      component.onSort({ column: 'ticker', direction: 'desc' });

      expect(component.store.setSort).toHaveBeenCalledWith('ticker', 'desc');
      expect(component.loadSecurities).toHaveBeenCalled();
    });

    it('should change page size and reload', () => {
      vi.spyOn(component.store, 'setPageSize');
      vi.spyOn(component, 'loadSecurities');

      component.onPageSizeChange(100);

      expect(component.store.setPageSize).toHaveBeenCalledWith(100);
      expect(component.loadSecurities).toHaveBeenCalled();
    });

    it('should expose Math to template', () => {
      expect(component.Math).toBe(Math);
    });
  });
});
