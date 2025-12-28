import {ChangeDetectionStrategy, Component} from '@angular/core';
import {PageHeader} from '../../layout/page-header/page-header';

@Component({
  selector: 'app-share-classes',
  imports: [PageHeader],
  template: `
    <app-page-header title="Share Classes">
      <button class="btn btn-sm btn-dark border-secondary text-light" aria-label="Get help for this page">
        <i class="bi bi-question-circle"></i> Help
      </button>
    </app-page-header>

    <div class="container-fluid py-4">
      <h1 class="mb-4">Share Classes</h1>
      <p class="text-muted">Fund share classes configuration</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShareClasses {
}
