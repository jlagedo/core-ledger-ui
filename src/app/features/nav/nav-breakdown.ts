import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-nav-breakdown',
    imports: [],
    template: `
    <div class="container-fluid py-4">
      <h1 class="mb-4">NAV Breakdown</h1>
      <p class="text-muted">Assets and liabilities breakdown</p>
    </div>
  `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavBreakdown { }
