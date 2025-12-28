import {ChangeDetectionStrategy, Component} from '@angular/core';
import {PageHeader} from '../../layout/page-header/page-header';

@Component({
  selector: 'app-nav-report',
  imports: [PageHeader],
  template: `
    <app-page-header title="NAV Report">
      <button class="btn btn-sm btn-dark border-secondary text-light" aria-label="Get help for this page">
        <i class="bi bi-question-circle"></i> Help
      </button>
    </app-page-header>

    <div class="container-fluid py-4">
      <h1 class="mb-4">NAV Report</h1>
      <p class="text-muted">Net Asset Value report</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavReport {
}
