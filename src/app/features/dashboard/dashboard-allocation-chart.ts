import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import { EChartsCoreOption } from 'echarts/core';
import { PieChart, BarChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([PieChart, BarChart, GridComponent, TooltipComponent, LegendComponent, CanvasRenderer]);

interface AllocationData {
  name: string;
  value: number;
  color: string;
}

const MOCK_ALLOCATION: AllocationData[] = [
  { name: 'Equities', value: 45.2, color: '#0068ff' },
  { name: 'Fixed Income', value: 28.5, color: '#4af6c3' },
  { name: 'Cash', value: 12.3, color: '#FFA028' },
  { name: 'Alternatives', value: 8.7, color: '#9B5DE5' },
  { name: 'Real Estate', value: 5.3, color: '#F15BB5' },
];

@Component({
  selector: 'app-dashboard-allocation-chart',
  template: `
    <div class="allocation-chart">
      <div [options]="chartOption()" echarts class="w-100" style="height: 220px;"></div>
      <div class="allocation-chart__legend">
        @for (item of allocationData(); track item.name) {
          <div class="allocation-chart__legend-item">
            <span class="allocation-chart__legend-dot" [style.background]="item.color"></span>
            <span class="allocation-chart__legend-label">{{ item.name }}</span>
            <span class="allocation-chart__legend-value">{{ item.value }}%</span>
          </div>
        }
      </div>
    </div>
  `,
  imports: [NgxEchartsDirective],
  providers: [provideEchartsCore({ echarts })],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardAllocationChart {
  readonly allocationData = signal<AllocationData[]>(MOCK_ALLOCATION);

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
      formatter: '{b}: {c}%',
    },
    series: [
      {
        type: 'pie',
        radius: ['45%', '70%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderColor: '#000',
          borderWidth: 2,
        },
        label: {
          show: false,
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 12,
            fontWeight: 600,
            color: '#fff',
            fontFamily: 'IBM Plex Mono, monospace',
          },
          itemStyle: {
            shadowBlur: 20,
            shadowOffsetX: 0,
            shadowColor: 'rgba(255, 160, 40, 0.5)',
          },
        },
        data: this.allocationData().map(item => ({
          name: item.name,
          value: item.value,
          itemStyle: { color: item.color },
        })),
      },
    ],
  }));
}
