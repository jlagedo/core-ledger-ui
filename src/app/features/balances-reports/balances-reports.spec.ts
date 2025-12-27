import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BalancesReports} from './balances-reports';

describe('BalancesReports', () => {
  let component: BalancesReports;
  let fixture: ComponentFixture<BalancesReports>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BalancesReports]
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
