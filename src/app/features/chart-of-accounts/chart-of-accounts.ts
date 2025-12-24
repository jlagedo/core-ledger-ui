import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Account } from '../../models/account.model';
import {AccountService} from '../../services/account';
import {toSignal} from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-chart-of-accounts',
  imports: [RouterLink],
  templateUrl: './chart-of-accounts.html',
  styleUrl: './chart-of-accounts.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartOfAccounts {
  accountService = inject(AccountService);

  accounts = toSignal(this.accountService.getAccounts(
    20,
    0,
    'code',
    'desc',
    'name=17'
  ).pipe(
    map(response => response.items)
  ));


}
