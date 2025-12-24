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

}
