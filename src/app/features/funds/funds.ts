import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-funds',
    imports: [],
    template: `
    <div class="container-fluid py-4">
      <h1 class="mb-4">Funds</h1>
      <p class="text-muted">Fund list and management</p>
    </div>
  `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class Funds { }
