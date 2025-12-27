import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'app-transactions',
  imports: [],
  template: `
    <div class="container-fluid py-4">
      <h1 class="mb-4">Transactions</h1>
      <p class="text-muted">Capture, view, and manage fund transactions</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Transactions {
}
