import {ChangeDetectionStrategy, Component} from '@angular/core';
import {PageHeader} from '../../layout/page-header/page-header';

@Component({
  selector: 'app-cash-ledger',
  imports: [PageHeader],
  template: `
    <app-page-header title="Cash Ledger">
      <button class="btn btn-sm btn-dark border-secondary text-light" aria-label="Get help for this page">
        <i class="bi bi-question-circle"></i> Help
      </button>
    </app-page-header>

    <div class="container-fluid py-4">
      <h1 class="mb-4">Cash Ledger</h1>
      <p class="text-muted">Cash movements and balances</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CashLedger {
}
