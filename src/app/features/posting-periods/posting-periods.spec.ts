import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideRouter} from '@angular/router';
import {provideLocationMocks} from '@angular/common/testing';

import {PostingPeriods} from './posting-periods';

describe('PostingPeriods', () => {
  let component: PostingPeriods;
  let fixture: ComponentFixture<PostingPeriods>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostingPeriods],
      providers: [provideRouter([]), provideLocationMocks()]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PostingPeriods);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
