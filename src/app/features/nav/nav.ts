import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-nav',
    imports: [],
    template: `
    <div class="container-fluid py-4">
      <h1 class="mb-4">NAV</h1>
      <p class="text-muted">NAV calculation, history, and breakdown</p>
    </div>
  `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class Nav { }
