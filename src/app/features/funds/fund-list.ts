import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-fund-list',
    imports: [],
    template: `
    <div class="container-fluid py-4">
      <h1 class="mb-4">Fund List</h1>
      <p class="text-muted">List of all funds</p>
    </div>
  `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FundList { }
