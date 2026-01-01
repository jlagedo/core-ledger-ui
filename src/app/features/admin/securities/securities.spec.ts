import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';

import { Securities } from './securities';

// Securities is a simple container component with only a router-outlet.
// No behavior to test. Child routes (security-list) are tested separately.
