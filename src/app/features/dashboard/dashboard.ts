import {Component, computed, DestroyRef, effect, inject, signal} from '@angular/core';
import {AccountService} from "../../services/account";
import {AccountsByTypeReportDto} from '../../models/account.model';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {LoggerService} from '../../services/logger';

import {NgxEchartsDirective, provideEchartsCore} from 'ngx-echarts';
// import echarts core
import * as echarts from 'echarts/core';
import {EChartsCoreOption} from 'echarts/core';
// import necessary echarts components
import {PieChart} from 'echarts/charts';
import {GridComponent} from 'echarts/components';
import {CanvasRenderer} from 'echarts/renderers';
import {CommonModule} from '@angular/common';

echarts.use([PieChart, GridComponent, CanvasRenderer]);

@Component({
  selector: 'app-dashboard',
  imports: [NgxEchartsDirective, CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  providers: [provideEchartsCore({echarts})]
})
export class Dashboard {
  accountService = inject(AccountService);
  destroyRef = inject(DestroyRef);
  logger = inject(LoggerService);

  accountsByTypeReport = signal<AccountsByTypeReportDto[]>([]);

  chartOption = computed<EChartsCoreOption>(() => ({
    backgroundColor: 'transparent',
    series: [
      {
        type: 'pie',
        radius: '65%',
        center: ['50%', '55%'],
        avoidLabelOverlap: true,
        label: {
          color: '#eee',
          fontSize: 12
        },
        labelLine: {
          lineStyle: {color: '#888'}
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        data: this.groupAccountsByType(this.accountsByTypeReport())
      }
    ],
    color: [
      '#4FC3F7', // light blue
      '#81C784', // green
      '#FFB74D', // orange
      '#E57373', // red
      '#BA68C8'  // purple
    ],
  }));

  constructor() {
    effect(() => {
      this.loadAccountsByTypeReport();
    });
  }

  private groupAccountsByType(data: AccountsByTypeReportDto[]): Array<{ name: string; value: number }> {
    const total = data.reduce((sum, item) => sum + item.activeAccountCount, 0);

    return data.reduce((acc, item) => {
      const percentage = (item.activeAccountCount / total) * 100;

      if (percentage < 4) {
        const othersItem = acc.find(d => d.name === 'Others');
        if (othersItem) {
          othersItem.value += item.activeAccountCount;
        } else {
          acc.push({name: 'Others', value: item.activeAccountCount});
        }
      } else {
        acc.push({name: item.typeDescription, value: item.activeAccountCount});
      }

      return acc;
    }, [] as Array<{ name: string; value: number }>);
  }

  private loadAccountsByTypeReport() {
    this.accountService.getAccountsByTypeReport()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: response => this.accountsByTypeReport.set(response),
        error: err => this.logger.logHttpError('load accounts by type report', err, 'Failed to load dashboard data. Please refresh the page.')
      });

  }
}
