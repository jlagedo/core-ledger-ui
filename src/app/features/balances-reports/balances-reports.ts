import {ChangeDetectionStrategy, Component} from '@angular/core';
import {PageHeader} from '../../layout/page-header/page-header';

@Component({
  selector: 'app-balances-reports',
  imports: [PageHeader],
  templateUrl: './balances-reports.html',
  styleUrl: './balances-reports.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BalancesReports {

}
