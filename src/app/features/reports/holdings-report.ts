import {ChangeDetectionStrategy, Component} from '@angular/core';
import {PageHeader} from '../../layout/page-header/page-header';

@Component({
  selector: 'app-holdings-report',
  imports: [PageHeader],
  template: `
    <app-page-header title="Holdings Report">
      <button class="btn btn-sm btn-secondary" aria-label="Get help for this page">
        <i class="bi bi-question-circle"></i> Help
      </button>
    </app-page-header>

    <div class="container-fluid py-4">
      <h1 class="mb-4">Holdings Report</h1>
      <p class="text-muted">Portfolio holdings report</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HoldingsReport {
}
