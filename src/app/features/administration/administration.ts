import {ChangeDetectionStrategy, Component} from '@angular/core';
import {PageHeader} from '../../layout/page-header/page-header';

@Component({
  selector: 'app-administration',
  imports: [PageHeader],
  templateUrl: './administration.html',
  styleUrl: './administration.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Administration {

}
