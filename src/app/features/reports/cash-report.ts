import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-cash-report',
    imports: [],
    template: `
    <div class="container-fluid py-4">
      <h1 class="mb-4">Cash Report</h1>
      <p class="text-muted">Cash position report</p>
    </div>
  `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CashReport { }
