import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DashboardChart } from './dashboard-chart';

@Component({
  selector: 'app-dashboard',
  imports: [DashboardChart],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard {}
