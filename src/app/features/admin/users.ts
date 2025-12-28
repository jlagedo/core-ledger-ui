import {ChangeDetectionStrategy, Component} from '@angular/core';
import {PageHeader} from '../../layout/page-header/page-header';

@Component({
  selector: 'app-users',
  imports: [PageHeader],
  template: `
    <app-page-header title="Users">
      <button class="btn btn-sm btn-dark border-secondary text-light" aria-label="Get help for this page">
        <i class="bi bi-question-circle"></i> Help
      </button>
    </app-page-header>

    <div class="container-fluid py-4">
      <h1 class="mb-4">Users</h1>
      <p class="text-muted">Manage system users</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Users {
}
