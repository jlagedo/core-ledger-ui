import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideRouter} from '@angular/router';
import {provideLocationMocks} from '@angular/common/testing';

import {Securities} from './securities';

describe('Securities', () => {
  let component: Securities;
  let fixture: ComponentFixture<Securities>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Securities],
      providers: [provideRouter([]), provideLocationMocks()]
    }).compileComponents();

    fixture = TestBed.createComponent(Securities);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render router outlet', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });
});
