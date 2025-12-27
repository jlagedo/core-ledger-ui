import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-portfolio',
    imports: [],
    template: `
    <div class="container-fluid py-4">
      <h1 class="mb-4">Portfolio</h1>
      <p class="text-muted">Holdings, cash ledger, and valuation summary</p>
    </div>
  `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class Portfolio { }
