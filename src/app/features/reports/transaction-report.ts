import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'app-transaction-report',
  imports: [],
  template: `
    <div class="container-fluid py-4">
      <h1 class="mb-4">Transaction Report</h1>
      <p class="text-muted">Transaction activity report</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransactionReport {
}
