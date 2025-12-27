import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-share-classes',
    imports: [],
    template: `
    <div class="container-fluid py-4">
      <h1 class="mb-4">Share Classes</h1>
      <p class="text-muted">Fund share classes configuration</p>
    </div>
  `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShareClasses { }
