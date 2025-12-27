import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-valuation-summary',
    imports: [],
    template: `
    <div class="container-fluid py-4">
      <h1 class="mb-4">Valuation Summary</h1>
      <p class="text-muted">Portfolio valuation overview</p>
    </div>
  `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ValuationSummary { }
