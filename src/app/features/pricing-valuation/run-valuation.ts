import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'app-run-valuation',
  imports: [],
  template: `
    <div class="container-fluid py-4">
      <h1 class="mb-4">Run Valuation</h1>
      <p class="text-muted">Execute portfolio valuation</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RunValuation {
}
