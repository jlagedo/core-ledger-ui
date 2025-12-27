import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-holdings',
    imports: [],
    template: `
    <div class="container-fluid py-4">
      <h1 class="mb-4">Holdings</h1>
      <p class="text-muted">Current portfolio holdings</p>
    </div>
  `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class Holdings { }
