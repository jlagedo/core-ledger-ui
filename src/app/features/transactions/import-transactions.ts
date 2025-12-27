import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'app-import-transactions',
  imports: [],
  template: `
    <div class="container-fluid py-4">
      <h1 class="mb-4">Import Transactions</h1>
      <p class="text-muted">Bulk import transactions</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImportTransactions {
}
