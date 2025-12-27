import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-holdings-report',
    imports: [],
    template: `
    <div class="container-fluid py-4">
      <h1 class="mb-4">Holdings Report</h1>
      <p class="text-muted">Portfolio holdings report</p>
    </div>
  `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HoldingsReport { }
