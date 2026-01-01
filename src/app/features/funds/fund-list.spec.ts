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

    it('should compute funds from fundsResponse', () => {
      expect(component.funds()).toEqual([]);

      const mockFunds = [
        { id: 1, code: 'F001', name: 'Fund 1', baseCurrency: 'USD', inceptionDate: '2020-01-01', valuationFrequency: 1, valuationFrequencyDescription: 'Daily', createdAt: '2020-01-01' },
        { id: 2, code: 'F002', name: 'Fund 2', baseCurrency: 'EUR', inceptionDate: '2020-02-01', valuationFrequency: 2, valuationFrequencyDescription: 'Weekly', createdAt: '2020-02-01' }
      ];
      const mockResponse = createMockPaginatedResponse(mockFunds, 2, 15, 0);
      component.fundsResponse.set(mockResponse);

      expect(component.funds()).toEqual(mockFunds);
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

  describe('table configuration', () => {
    it('should define columns with correct properties', () => {
      expect(component.columns).toHaveLength(5);
      expect(component.columns[0].key).toBe('code');
      expect(component.columns[0].sortable).toBe(true);
      expect(component.columns[1].key).toBe('name');
    });

    it('should provide trackBy function', () => {
      const fund = { id: 123, code: 'F001', name: 'Test', baseCurrency: 'USD', inceptionDate: '2020-01-01', valuationFrequency: 1, valuationFrequencyDescription: 'Daily', createdAt: '2020-01-01' };
      expect(component.trackByFundId(0, fund)).toBe(123);
    });
  });
});
