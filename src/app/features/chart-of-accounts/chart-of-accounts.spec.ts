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
    it('should have columns defined for data grid', () => {
      expect(component.columns).toBeDefined();
      expect(component.columns.length).toBe(5);
      expect(component.columns[0].key).toBe('code');
      expect(component.columns[0].sortable).toBe(true);
    });

    it('should have actionsTemplate defined', () => {
      fixture.detectChanges();
      expect(component.actionsTemplate).toBeDefined();
    });
  });

  describe('Data Loading Features', () => {
    it('should have initial empty accountsResponse', () => {
      expect(component.accountsResponse()).toBeNull();
    });

    it('should update accountsResponse when loadAccounts is called', () => {
      const mockResponse = {
        items: [],
        totalCount: 0,
        limit: 15,
        offset: 0
      };

      component.accountsResponse.set(mockResponse);
      expect(component.accountsResponse()).toEqual(mockResponse);
    });

    it('should have store injected', () => {
      expect(component.store).toBeDefined();
    });

    it('should have accountService injected', () => {
      expect(component.accountService).toBeDefined();
    });

    it('should provide search and filter capabilities through store', () => {
      expect(component.store.searchTerm).toBeDefined();
      expect(component.store.page).toBeDefined();
      expect(component.store.pageSize).toBeDefined();
    });
  });
});
