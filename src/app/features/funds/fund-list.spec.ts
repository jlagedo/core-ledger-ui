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
        {
          id: 1,
          code: 'FUND1',
          name: 'Test Fund',
          baseCurrency: 'USD',
          inceptionDate: '2024-01-01',
          valuationFrequency: 1,
          valuationFrequencyDescription: 'Daily',
          createdAt: '2024-01-01',
        },
      ];
      const mockResponse = createMockPaginatedResponse(mockFunds, 1, 15, 0);
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

  describe('column configuration', () => {
    it('should have correct column definitions', () => {
      expect(component.columns).toHaveLength(5);
      expect(component.columns[0].key).toBe('code');
      expect(component.columns[1].key).toBe('name');
      expect(component.columns[2].key).toBe('baseCurrency');
      expect(component.columns[3].key).toBe('inceptionDate');
      expect(component.columns[4].key).toBe('valuationFrequencyDescription');
    });

    it('should have sortable columns configured correctly', () => {
      expect(component.columns[0].sortable).toBe(true);
      expect(component.columns[1].sortable).toBe(true);
      expect(component.columns[2].sortable).toBe(true);
      expect(component.columns[3].sortable).toBe(true);
      expect(component.columns[4].sortable).toBe(false);
    });
  });
});
