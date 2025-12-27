import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'app-currencies',
  imports: [],
  template: `
    <div class="container-fluid py-4">
      <h1 class="mb-4">Currencies</h1>
      <p class="text-muted">Manage currency reference data</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Currencies {
}
