import {TestBed} from '@angular/core/testing';
import {provideRouter} from '@angular/router';
import {provideLocationMocks} from '@angular/common/testing';

import {BreadCrumbService} from './bread-crumb-service';

describe('BreadCrumbService', () => {
  let service: BreadCrumbService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideLocationMocks()]
    });
    service = TestBed.inject(BreadCrumbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
