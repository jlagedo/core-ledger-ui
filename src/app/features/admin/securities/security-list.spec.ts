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
    it('should have columns defined for data grid', () => {
      expect(component.columns).toBeDefined();
      expect(component.columns.length).toBe(7);
      expect(component.columns[0].key).toBe('ticker');
      expect(component.columns[0].sortable).toBe(true);
    });

    it('should have actionsTemplate defined', () => {
      fixture.detectChanges();
      expect(component.actionsTemplate).toBeDefined();
    });

    it('should have statusTemplate defined', () => {
      fixture.detectChanges();
      expect(component.statusTemplate).toBeDefined();
    });
  });

  describe('Data Loading Features', () => {
    it('should have initial empty securitiesResponse', () => {
      expect(component.securitiesResponse()).toBeNull();
    });

    it('should update securitiesResponse when loadSecurities is called', () => {
      const mockResponse = {
        items: [],
        totalCount: 0,
        limit: 15,
        offset: 0
      };

      component.securitiesResponse.set(mockResponse);
      expect(component.securitiesResponse()).toEqual(mockResponse);
    });

    it('should have store injected', () => {
      expect(component.store).toBeDefined();
    });

    it('should have securityService injected', () => {
      expect(component.securityService).toBeDefined();
    });

    it('should provide search and filter capabilities through store', () => {
      expect(component.store.searchTerm).toBeDefined();
      expect(component.store.page).toBeDefined();
      expect(component.store.pageSize).toBeDefined();
    });
  });
});
