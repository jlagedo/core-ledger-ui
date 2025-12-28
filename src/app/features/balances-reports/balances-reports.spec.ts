import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideRouter} from '@angular/router';
import {provideLocationMocks} from '@angular/common/testing';

import {BalancesReports} from './balances-reports';

describe('BalancesReports', () => {
  let component: BalancesReports;
  let fixture: ComponentFixture<BalancesReports>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BalancesReports],
      providers: [provideRouter([]), provideLocationMocks()]
    })
      .compileComponents();

    fixture = TestBed.createComponent(BalancesReports);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
