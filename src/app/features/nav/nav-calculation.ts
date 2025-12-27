import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'app-nav-calculation',
  imports: [],
  template: `
    <div class="container-fluid py-4">
      <h1 class="mb-4">NAV Calculation</h1>
      <p class="text-muted">Calculate Net Asset Value</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavCalculation {
}
