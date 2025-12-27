import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'app-capture-transaction',
  imports: [],
  template: `
    <div class="container-fluid py-4">
      <h1 class="mb-4">Capture Transaction</h1>
      <p class="text-muted">Enter new fund transaction</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CaptureTransaction {
}
