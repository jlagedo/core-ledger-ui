import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Account } from '../../models/account.model';

@Component({
  selector: 'app-chart-of-accounts',
  imports: [RouterLink],
  templateUrl: './chart-of-accounts.html',
  styleUrl: './chart-of-accounts.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartOfAccounts {
  protected readonly isLoading = signal(false);
  protected readonly searchQuery = signal('');

  private readonly accounts = signal<Account[]>([
    { id: '1', code: '1001', description: 'Cash', type: 'ASSET', isActive: true, normalBalance: 'DEBIT' },
    { id: '2', code: '2001', description: 'Accounts Payable', type: 'LIABILITY', isActive: true, normalBalance: 'CREDIT' },
    { id: '3', code: '4001', description: 'Revenue', type: 'INCOME', isActive: false, normalBalance: 'CREDIT' },
  ]);

  protected readonly filteredAccounts = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) {
      return this.accounts();
    }
    return this.accounts().filter(
      (account) =>
        account.code.toLowerCase().includes(query) ||
        account.description.toLowerCase().includes(query) ||
        account.type.toLowerCase().includes(query)
    );
  });

  protected onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }
}
