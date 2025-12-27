import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'app-reports',
  imports: [],
  template: `
    <div class="container-fluid py-4">
      <h1 class="mb-4">Reports</h1>
      <p class="text-muted">Holdings, cash, transaction, and NAV reports</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Reports {
}
