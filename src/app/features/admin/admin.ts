import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-admin',
    imports: [],
    template: `
    <div class="container-fluid py-4">
      <h1 class="mb-4">Admin / Reference Data</h1>
      <p class="text-muted">Securities, pricing sources, currencies, and users</p>
    </div>
  `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class Admin { }
