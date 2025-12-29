import {ChangeDetectionStrategy, Component} from '@angular/core';
import {PageHeader} from '../../layout/page-header/page-header';

@Component({
  selector: 'app-nav-breakdown',
  imports: [PageHeader],
  template: `
    <app-page-header title="NAV Breakdown">
      <button class="btn btn-sm btn-secondary" aria-label="Get help for this page">
        <i class="bi bi-question-circle"></i> Help
      </button>
    </app-page-header>

    <div class="container-fluid py-4">
      <h1 class="mb-4">NAV Breakdown</h1>
      <p class="text-muted">Assets and liabilities breakdown</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavBreakdown {
}
