import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-securities',
    imports: [],
    template: `
    <div class="container-fluid py-4">
      <h1 class="mb-4">Securities</h1>
      <p class="text-muted">Manage securities master data</p>
    </div>
  `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class Securities { }
