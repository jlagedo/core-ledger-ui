import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideRouter} from '@angular/router';
import {provideLocationMocks} from '@angular/common/testing';

import {BreadCrumbComponent} from './bread-crumb-component';

describe('BreadCrumbComponent', () => {
  let component: BreadCrumbComponent;
  let fixture: ComponentFixture<BreadCrumbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BreadCrumbComponent],
      providers: [provideRouter([]), provideLocationMocks()]
    })
      .compileComponents();

    fixture = TestBed.createComponent(BreadCrumbComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
