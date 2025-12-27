import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-pricing-valuation',
    imports: [],
    template: `
    <div class="container-fluid py-4">
      <h1 class="mb-4">Pricing & Valuation</h1>
      <p class="text-muted">Load prices, view history, and run valuations</p>
    </div>
  `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PricingValuation { }
