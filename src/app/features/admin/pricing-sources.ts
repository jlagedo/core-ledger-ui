import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-pricing-sources',
    imports: [],
    template: `
    <div class="container-fluid py-4">
      <h1 class="mb-4">Pricing Sources</h1>
      <p class="text-muted">Configure pricing data sources</p>
    </div>
  `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PricingSources { }
