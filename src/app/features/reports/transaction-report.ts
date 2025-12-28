import {ChangeDetectionStrategy, Component} from '@angular/core';
import {PageHeader} from '../../layout/page-header/page-header';

@Component({
  selector: 'app-transaction-report',
  imports: [PageHeader],
  template: `
    <app-page-header title="Transaction Report">
      <button class="btn btn-sm btn-dark border-secondary text-light" aria-label="Get help for this page">
        <i class="bi bi-question-circle"></i> Help
      </button>
    </app-page-header>

    <div class="container-fluid py-4">
      <h1 class="mb-4">Transaction Report</h1>
      <p class="text-muted">Transaction activity report</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransactionReport {
}
