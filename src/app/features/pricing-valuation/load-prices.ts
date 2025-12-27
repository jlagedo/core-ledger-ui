import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-load-prices',
    imports: [],
    template: `
    <div class="container-fluid py-4">
      <h1 class="mb-4">Load Prices</h1>
      <p class="text-muted">Import current market prices</p>
    </div>
  `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadPrices { }
