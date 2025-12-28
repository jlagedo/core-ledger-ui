import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideRouter} from '@angular/router';
import {provideLocationMocks} from '@angular/common/testing';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';

import {ChartOfAccounts} from './chart-of-accounts';

describe('ChartOfAccounts', () => {
  let component: ChartOfAccounts;
  let fixture: ComponentFixture<ChartOfAccounts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartOfAccounts],
      providers: [
        provideRouter([]),
        provideLocationMocks(),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ChartOfAccounts);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
