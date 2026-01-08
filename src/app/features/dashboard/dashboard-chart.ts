import { ChangeDetectionStrategy, Component, computed, DestroyRef, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import { EChartsCoreOption } from 'echarts/core';
import { PieChart } from 'echarts/charts';
import { GridComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { AccountService } from '../../services/account';
import { AccountsByTypeReportDto } from '../../models/account.model';
import { LoggerService } from '../../services/logger';

echarts.use([PieChart, GridComponent, TooltipComponent, CanvasRenderer]);

@Component({
  selector: 'app-dashboard-chart',
  template: `<div [options]="chartOption()" class="w-100 mb-2" echarts style="height: 260px;"></div>`,
  imports: [NgxEchartsDirective],
  providers: [provideEchartsCore({ echarts })],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardChart {
  private readonly accountService = inject(AccountService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly logger = inject(LoggerService);

  private readonly accountsByTypeReport = signal<AccountsByTypeReportDto[]>([]);

  readonly chartOption = computed<EChartsCoreOption>(() => ({
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(26, 26, 26, 0.95)',
      borderColor: 'rgba(255, 160, 40, 0.3)',
      textStyle: {
        color: '#FFA028',
        fontFamily: 'IBM Plex Mono, monospace',
        fontSize: 11,
      },
      formatter: '{b}: {c} ({d}%)',
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '65%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderColor: 'rgba(0, 0, 0, 0.8)',
          borderWidth: 2,
        },
        label: {
          color: 'var(--bs-body-color, #FFA028)',
          fontSize: 11,
          fontFamily: 'IBM Plex Mono, monospace',
          formatter: '{b}\n{d}%',
        },
        labelLine: {
          lineStyle: {
            color: 'rgba(255, 160, 40, 0.4)',
          },
        },
        emphasis: {
          label: {
            fontSize: 12,
            fontWeight: 600,
          },
          itemStyle: {
            shadowBlur: 20,
            shadowOffsetX: 0,
            shadowColor: 'rgba(255, 160, 40, 0.5)',
          },
        },
        data: this.groupAccountsByType(this.accountsByTypeReport()),
      },
    ],
    color: [
      '#0068ff', // Bloomberg blue
      '#4af6c3', // Bloomberg teal
      '#FFA028', // Bloomberg amber
      '#9B5DE5', // Purple
      '#F15BB5', // Pink
    ],
  }));

  constructor() {
    effect(() => {
      this.loadAccountsByTypeReport();
    });
  }

  private groupAccountsByType(data: AccountsByTypeReportDto[]): Array<{ name: string; value: number }> {
    const total = data.reduce((sum, item) => sum + item.activeAccountCount, 0);

    return data.reduce(
      (acc, item) => {
        const percentage = (item.activeAccountCount / total) * 100;

        if (percentage < 4) {
          const othersItem = acc.find(d => d.name === 'Others');
          if (othersItem) {
            othersItem.value += item.activeAccountCount;
          } else {
            acc.push({ name: 'Others', value: item.activeAccountCount });
          }
        } else {
          acc.push({ name: item.typeDescription, value: item.activeAccountCount });
        }

        return acc;
      },
      [] as Array<{ name: string; value: number }>
    );
  }

  private loadAccountsByTypeReport() {
    this.accountService
      .getAccountsByTypeReport()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: response => this.accountsByTypeReport.set(response),
        error: err =>
          this.logger.logHttpError(
            'load accounts by type report',
            err,
            'Failed to load dashboard data. Please refresh the page.'
          ),
      });
  }
}
