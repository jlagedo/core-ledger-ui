import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideRouter} from '@angular/router';
import {provideLocationMocks} from '@angular/common/testing';

import {JournalEntries} from './journal-entries';

describe('JournalEntries', () => {
  let component: JournalEntries;
  let fixture: ComponentFixture<JournalEntries>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JournalEntries],
      providers: [provideRouter([]), provideLocationMocks()]
    })
      .compileComponents();

    fixture = TestBed.createComponent(JournalEntries);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
