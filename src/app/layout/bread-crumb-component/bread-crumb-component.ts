import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {BreadCrumbService} from '../../services/bread-crumb-service';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-bread-crumb-component',
  imports: [
    RouterLink
  ],
  templateUrl: './bread-crumb-component.html',
  styleUrl: './bread-crumb-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BreadCrumbComponent {
  breadcrumbService = inject(BreadCrumbService);
}
