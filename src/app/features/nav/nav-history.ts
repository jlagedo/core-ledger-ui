import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'app-nav-history',
  imports: [],
  template: `
    <div class="container-fluid py-4">
      <h1 class="mb-4">NAV History</h1>
      <p class="text-muted">Historical NAV values</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavHistory {
}
