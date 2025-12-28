import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {BreadCrumbComponent} from '../bread-crumb-component/bread-crumb-component';

@Component({
  selector: 'app-page-header',
  imports: [BreadCrumbComponent],
  templateUrl: './page-header.html',
  styleUrl: './page-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageHeader {
  title = input.required<string>();
  additionalClasses = input<string>('');
}
