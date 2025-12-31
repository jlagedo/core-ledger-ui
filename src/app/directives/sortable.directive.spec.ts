import {Component, DebugElement} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';

import {SortableDirective, SortEvent} from './sortable.directive';

@Component({
  template: `
    <table>
      <thead>
        <tr>
          <th sortable="name" [direction]="nameDirection" (sort)="onSort($event)">Name</th>
          <th sortable="age" [direction]="ageDirection" (sort)="onSort($event)">Age</th>
        </tr>
      </thead>
    </table>
  `,
  imports: [SortableDirective]
})
class TestComponent {
  nameDirection: 'asc' | 'desc' | '' = '';
  ageDirection: 'asc' | 'desc' | '' = '';
  lastSortEvent?: SortEvent;

  onSort(event: SortEvent) {
    this.lastSortEvent = event;
  }
}

describe('SortableDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let nameHeader: DebugElement;
  let ageHeader: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent, SortableDirective]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const headers = fixture.debugElement.queryAll(By.directive(SortableDirective));
    nameHeader = headers[0];
    ageHeader = headers[1];
  });

  it('should create', () => {
    expect(nameHeader).toBeTruthy();
    expect(ageHeader).toBeTruthy();
  });

  it('should have pointer cursor', () => {
    const nameElement = nameHeader.nativeElement as HTMLElement;
    expect(nameElement.style.cursor).toBe('pointer');
  });

  it('should cycle through sort directions on click', () => {
    const nameElement = nameHeader.nativeElement as HTMLElement;

    // First click: '' -> 'asc'
    nameElement.click();
    fixture.detectChanges();
    expect(component.lastSortEvent).toEqual({column: 'name', direction: 'asc'});
    expect(nameElement.classList.contains('asc')).toBe(true);

    // Second click: 'asc' -> 'desc'
    nameElement.click();
    fixture.detectChanges();
    expect(component.lastSortEvent).toEqual({column: 'name', direction: 'desc'});
    expect(nameElement.classList.contains('desc')).toBe(true);
    expect(nameElement.classList.contains('asc')).toBe(false);

    // Third click: 'desc' -> ''
    nameElement.click();
    fixture.detectChanges();
    expect(component.lastSortEvent).toEqual({column: 'name', direction: ''});
    expect(nameElement.classList.contains('desc')).toBe(false);
    expect(nameElement.classList.contains('asc')).toBe(false);

    // Fourth click: '' -> 'asc' (cycle repeats)
    nameElement.click();
    fixture.detectChanges();
    expect(component.lastSortEvent).toEqual({column: 'name', direction: 'asc'});
    expect(nameElement.classList.contains('asc')).toBe(true);
  });

  it('should emit sort event with correct column name', () => {
    const ageElement = ageHeader.nativeElement as HTMLElement;

    ageElement.click();
    fixture.detectChanges();

    expect(component.lastSortEvent).toEqual({column: 'age', direction: 'asc'});
  });
});
