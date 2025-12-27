import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'app-cash-ledger',
  imports: [],
  template: `
    <div class="container-fluid py-4">
      <h1 class="mb-4">Cash Ledger</h1>
      <p class="text-muted">Cash movements and balances</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CashLedger {
}
