import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { FundList } from './fund-list';
import { provideTestDependencies } from '../../testing/test-helpers';

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

  it('should have initial empty fundsResponse', () => {
    expect(component.fundsResponse()).toBeNull();
  });

  it('should have column definitions for fund data', () => {
    expect(component.columns).toBeDefined();
    expect(component.columns.length).toBe(5); // code, name, baseCurrency, inceptionDate, valuationFrequency

    // Verify column keys
    expect(component.columns[0].key).toBe('code');
    expect(component.columns[1].key).toBe('name');
    expect(component.columns[2].key).toBe('baseCurrency');
    expect(component.columns[3].key).toBe('inceptionDate');
    expect(component.columns[4].key).toBe('valuationFrequencyDescription');
  });

  it('should have sortable columns', () => {
    const sortableColumns = component.columns.filter(col => col.sortable);
    expect(sortableColumns.length).toBe(5); // All columns are sortable
  });

  it('should have date formatter for inceptionDate column', () => {
    const inceptionDateColumn = component.columns.find(col => col.key === 'inceptionDate');
    expect(inceptionDateColumn?.formatter).toBeDefined();
  });
});
