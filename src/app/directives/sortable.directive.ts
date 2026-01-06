import {Directive, input, output, signal} from '@angular/core';

export type SortDirection = 'asc' | 'desc' | '';

const rotate: {[key: string]: SortDirection} = {
  asc: 'desc',
  desc: '',
  '': 'asc',
};

export interface SortEvent {
  column: string;
  direction: SortDirection;
}

@Directive({
  selector: 'th[sortable], [sortable]',
  host: {
    '[class.asc]': 'direction() === "asc"',
    '[class.desc]': 'direction() === "desc"',
    '(click)': 'onRotate()',
    '[style.cursor]': '"pointer"',
  },
})
export class SortableDirective {
  // Signal-based inputs (Angular 21 best practice)
  readonly sortable = input<string>('');
  readonly direction = signal<SortDirection>('');

  // Event output
  readonly sort = output<SortEvent>();

  onRotate() {
    const newDirection = rotate[this.direction()];
    this.direction.set(newDirection);
    this.sort.emit({column: this.sortable(), direction: newDirection});
  }
}
