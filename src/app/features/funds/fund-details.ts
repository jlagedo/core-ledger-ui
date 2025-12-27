import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-fund-details',
    imports: [],
    template: `
    <div class="container-fluid py-4">
      <h1 class="mb-4">Fund Details</h1>
      <p class="text-muted">Detailed fund information</p>
    </div>
  `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FundDetails { }
