import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { FundList } from './fund-list';
import { provideTestDependencies, createMockPaginatedResponse } from '../../testing/test-helpers';

describe('FundList', () => {
  let component: FundList;
  let fixture: ComponentFixture<FundList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FundList],
      providers: [...provideTestDependencies(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(FundList);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('state management', () => {
    it('should have initial empty fundsResponse', () => {
      expect(component.fundsResponse()).toBeNull();
    });

    it('should calculate collectionSize from fundsResponse', () => {
      expect(component.collectionSize()).toBe(0);

      const mockResponse = createMockPaginatedResponse([], 50, 15, 0);
      component.fundsResponse.set(mockResponse);

      expect(component.collectionSize()).toBe(50);
    });
  });

  describe('search functionality', () => {
    it('should trim search value and reload', () => {
      vi.spyOn(component.store, 'setSearchTerm');
      vi.spyOn(component, 'loadFunds');

      component.onSearch('  test  ');

      expect(component.store.setSearchTerm).toHaveBeenCalledWith('test');
      expect(component.loadFunds).toHaveBeenCalled();
    });

    it('should handle empty search term', () => {
      vi.spyOn(component.store, 'setSearchTerm');
      vi.spyOn(component, 'loadFunds');

      component.onSearch('');

      expect(component.store.setSearchTerm).toHaveBeenCalledWith('');
      expect(component.loadFunds).toHaveBeenCalled();
    });
  });

  describe('sorting functionality', () => {
    it('should reset sort when direction is empty', () => {
      vi.spyOn(component.store, 'resetSort');
      vi.spyOn(component, 'loadFunds');

      component.onSort({ column: 'name', direction: '' });

      expect(component.store.resetSort).toHaveBeenCalled();
      expect(component.loadFunds).toHaveBeenCalled();
    });

    it('should set sort when direction is provided', () => {
      vi.spyOn(component.store, 'setSort');
      vi.spyOn(component, 'loadFunds');

      component.onSort({ column: 'name', direction: 'asc' });

      expect(component.store.setSort).toHaveBeenCalledWith('name', 'asc');
      expect(component.loadFunds).toHaveBeenCalled();
    });

    it('should handle descending sort', () => {
      vi.spyOn(component.store, 'setSort');

      component.onSort({ column: 'id', direction: 'desc' });

      expect(component.store.setSort).toHaveBeenCalledWith('id', 'desc');
    });
  });

  describe('pagination functionality', () => {
    it('should change page size and reload', () => {
      vi.spyOn(component.store, 'setPageSize');
      vi.spyOn(component, 'loadFunds');

      component.onPageSizeChange(50);

      expect(component.store.setPageSize).toHaveBeenCalledWith(50);
      expect(component.loadFunds).toHaveBeenCalled();
    });

    it('should handle various page sizes', () => {
      vi.spyOn(component.store, 'setPageSize');

      component.onPageSizeChange(25);
      expect(component.store.setPageSize).toHaveBeenCalledWith(25);

      component.onPageSizeChange(100);
      expect(component.store.setPageSize).toHaveBeenCalledWith(100);
    });
  });
});
