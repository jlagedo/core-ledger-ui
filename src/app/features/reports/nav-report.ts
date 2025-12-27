import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'app-nav-report',
  imports: [],
  template: `
    <div class="container-fluid py-4">
      <h1 class="mb-4">NAV Report</h1>
      <p class="text-muted">Net Asset Value report</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavReport {
}
