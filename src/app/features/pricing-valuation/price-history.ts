import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-price-history',
    imports: [],
    template: `
    <div class="container-fluid py-4">
      <h1 class="mb-4">Price History</h1>
      <p class="text-muted">Historical pricing data</p>
    </div>
  `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PriceHistory { }
