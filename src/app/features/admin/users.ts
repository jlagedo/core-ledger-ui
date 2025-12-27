import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'app-users',
  imports: [],
  template: `
    <div class="container-fluid py-4">
      <h1 class="mb-4">Users</h1>
      <p class="text-muted">Manage system users</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Users {
}
