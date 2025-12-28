import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideRouter} from '@angular/router';
import {provideLocationMocks} from '@angular/common/testing';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {vi} from 'vitest';

import {FundList} from './fund-list';

describe('FundList', () => {
  let component: FundList;
  let fixture: ComponentFixture<FundList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FundList],
      providers: [
        provideRouter([]),
        provideLocationMocks(),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FundList);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have initial empty fundsResponse', () => {
    expect(component.fundsResponse()).toBeNull();
  });

  it('should calculate collectionSize from fundsResponse', () => {
    expect(component.collectionSize()).toBe(0);

    component.fundsResponse.set({
      items: [],
      totalCount: 50,
      limit: 15,
      offset: 0
    });

    expect(component.collectionSize()).toBe(50);
  });

  it('should trim search value in onSearch', () => {
    vi.spyOn(component.store, 'setSearchTerm');
    vi.spyOn(component, 'loadFunds');

    component.onSearch('  test  ');

    expect(component.store.setSearchTerm).toHaveBeenCalledWith('test');
    expect(component.loadFunds).toHaveBeenCalled();
  });

  it('should reset sort when direction is empty', () => {
    vi.spyOn(component.store, 'resetSort');
    vi.spyOn(component, 'loadFunds');

    component.onSort({column: 'name', direction: ''});

    expect(component.store.resetSort).toHaveBeenCalled();
    expect(component.loadFunds).toHaveBeenCalled();
  });

  it('should set sort when direction is provided', () => {
    vi.spyOn(component.store, 'setSort');
    vi.spyOn(component, 'loadFunds');

    component.onSort({column: 'name', direction: 'asc'});

    expect(component.store.setSort).toHaveBeenCalledWith('name', 'asc');
    expect(component.loadFunds).toHaveBeenCalled();
  });

  it('should change page size and reload', () => {
    vi.spyOn(component.store, 'setPageSize');
    vi.spyOn(component, 'loadFunds');

    component.onPageSizeChange(50);

    expect(component.store.setPageSize).toHaveBeenCalledWith(50);
    expect(component.loadFunds).toHaveBeenCalled();
  });
});
