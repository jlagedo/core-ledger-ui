import {ChangeDetectionStrategy, Component} from '@angular/core';
import {PageHeader} from '../../layout/page-header/page-header';

@Component({
  selector: 'app-transaction-ledger',
  imports: [PageHeader],
  template: `
    <app-page-header title="Transaction Ledger">
      <button class="btn btn-sm btn-secondary" aria-label="Get help for this page">
        <i class="bi bi-question-circle"></i> Help
      </button>
    </app-page-header>

    <div class="container-fluid py-4">
      <h1 class="mb-4">Transaction Ledger</h1>
      <p class="text-muted">View all fund transactions</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransactionLedger {
}
