import {Directive, Input, output} from '@angular/core';

export type SortDirection = 'asc' | 'desc' | '';

const rotate: { [key: string]: SortDirection } = {
  asc: 'desc',
  desc: '',
  '': 'asc'
};

export interface SortEvent {
  column: string;
  direction: SortDirection;
}

@Directive({
  selector: 'th[sortable]',
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()',
    '[style.cursor]': '"pointer"',
  },
})
export class SortableDirective {
  // Using @Input instead of input() because components programmatically set these values
  // via viewChildren, which requires mutable properties
  @Input() sortable = '';
  @Input() direction: SortDirection = '';

  // output() works fine for events
  sort = output<SortEvent>();

  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({column: this.sortable, direction: this.direction});
  }
}
