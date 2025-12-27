import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'app-transaction-ledger',
  imports: [],
  template: `
    <div class="container-fluid py-4">
      <h1 class="mb-4">Transaction Ledger</h1>
      <p class="text-muted">View all fund transactions</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransactionLedger {
}
