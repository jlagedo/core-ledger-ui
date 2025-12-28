import {ChangeDetectionStrategy, Component} from '@angular/core';
import {PageHeader} from '../../layout/page-header/page-header';

@Component({
  selector: 'app-posting-periods',
  imports: [PageHeader],
  templateUrl: './posting-periods.html',
  styleUrl: './posting-periods.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostingPeriods {

}
