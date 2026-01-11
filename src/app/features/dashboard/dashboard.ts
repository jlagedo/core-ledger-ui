import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe, DatePipe, CurrencyPipe } from '@angular/common';
import { DashboardChart } from './dashboard-chart';
import { DashboardAllocationChart } from './dashboard-allocation-chart';

// ============================================================
// INTERFACES
// ============================================================

interface HeroMetric {
  label: string;
  value: number;
  change: number;
  changePercent: number;
  format: 'currency' | 'number' | 'percent';
  isPrimary?: boolean;
  isLive?: boolean;
}

interface TickerItem {
  symbol: string;
  name: string;
  value: number;
  change: number;
}

interface ActivityItem {
  id: number;
  time: Date;
  type: 'journal' | 'nav' | 'period';
  entity: string;
  description: string;
  amount?: number;
  status: 'posted' | 'pending' | 'failed';
}

interface PostingPeriod {
  id: number;
  name: string;
  startDate: Date;
  endDate: Date;
  status: 'open' | 'closed' | 'current';
}

interface FundSummary {
  id: number;
  name: string;
  nav: number;
  change: number;
}

interface QuickAction {
  key: string;
  label: string;
  icon: string;
  route: string;
}

// ============================================================
// MOCK DATA
// ============================================================

const MOCK_HERO_METRICS: HeroMetric[] = [
  {
    label: 'Total AUM',
    value: 1245300000,
    change: 12500000,
    changePercent: 1.02,
    format: 'currency',
    isPrimary: true,
    isLive: true,
  },
  {
    label: 'Active Funds',
    value: 24,
    change: 2,
    changePercent: 9.09,
    format: 'number',
  },
  {
    label: 'Open Positions',
    value: 847,
    change: -12,
    changePercent: -1.4,
    format: 'number',
  },
  {
    label: 'MTD Return',
    value: 0.0342,
    change: 0.0089,
    changePercent: 0.89,
    format: 'percent',
  },
  {
    label: 'Pending Entries',
    value: 156,
    change: 23,
    changePercent: 17.3,
    format: 'number',
  },
];

const MOCK_TICKER_ITEMS: TickerItem[] = [
  { symbol: 'ALPHA', name: 'Alpha Growth Fund', value: 142.87, change: 1.24 },
  { symbol: 'BETA', name: 'Beta Income Fund', value: 98.45, change: -0.32 },
  { symbol: 'GAMMA', name: 'Gamma Balanced', value: 215.63, change: 2.18 },
  { symbol: 'DELTA', name: 'Delta Equity', value: 178.91, change: -1.05 },
  { symbol: 'EPSILON', name: 'Epsilon Fixed Income', value: 52.34, change: 0.15 },
  { symbol: 'ZETA', name: 'Zeta Multi-Asset', value: 324.56, change: 3.42 },
  { symbol: 'ETA', name: 'Eta Global', value: 89.23, change: -0.67 },
  { symbol: 'THETA', name: 'Theta Emerging', value: 67.89, change: 1.89 },
];

const MOCK_ACTIVITY: ActivityItem[] = [
  {
    id: 1,
    time: new Date(Date.now() - 1000 * 60 * 5),
    type: 'journal',
    entity: 'JE-2025-1247',
    description: 'Monthly accrual adjustment',
    amount: 125000,
    status: 'posted',
  },
  {
    id: 2,
    time: new Date(Date.now() - 1000 * 60 * 25),
    type: 'nav',
    entity: 'Alpha Fund',
    description: 'NAV calculation complete',
    status: 'posted',
  },
  {
    id: 3,
    time: new Date(Date.now() - 1000 * 60 * 45),
    type: 'journal',
    entity: 'JE-2025-1246',
    description: 'Fee allocation Q4',
    amount: 45000,
    status: 'pending',
  },
  {
    id: 4,
    time: new Date(Date.now() - 1000 * 60 * 90),
    type: 'period',
    entity: 'Dec 2024',
    description: 'Period close initiated',
    status: 'pending',
  },
  {
    id: 5,
    time: new Date(Date.now() - 1000 * 60 * 120),
    type: 'journal',
    entity: 'JE-2025-1245',
    description: 'Dividend income recognition',
    amount: 23500,
    status: 'failed',
  },
];

const MOCK_PERIODS: PostingPeriod[] = [
  {
    id: 1,
    name: 'January 2025',
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-01-31'),
    status: 'current',
  },
  {
    id: 2,
    name: 'December 2024',
    startDate: new Date('2024-12-01'),
    endDate: new Date('2024-12-31'),
    status: 'open',
  },
  {
    id: 3,
    name: 'November 2024',
    startDate: new Date('2024-11-01'),
    endDate: new Date('2024-11-30'),
    status: 'closed',
  },
  {
    id: 4,
    name: 'October 2024',
    startDate: new Date('2024-10-01'),
    endDate: new Date('2024-10-31'),
    status: 'closed',
  },
];

const MOCK_FUNDS: FundSummary[] = [
  { id: 1, name: 'Alpha Growth Fund', nav: 142876543.21, change: 1.24 },
  { id: 2, name: 'Beta Income Fund', nav: 98453210.87, change: -0.32 },
  { id: 3, name: 'Gamma Balanced Portfolio', nav: 215632100.45, change: 2.18 },
  { id: 4, name: 'Delta Equity Partners', nav: 178912345.67, change: -1.05 },
  { id: 5, name: 'Epsilon Fixed Income', nav: 52341234.89, change: 0.15 },
];

const QUICK_ACTIONS: QuickAction[] = [
  { key: 'F1', label: 'Journal Entry', icon: 'bi-journal-plus', route: '/journal-entries' },
  { key: 'F2', label: 'Run NAV', icon: 'bi-calculator', route: '/nav/calculation' },
  { key: 'F3', label: 'Trial Balance', icon: 'bi-file-earmark-spreadsheet', route: '/reports' },
  { key: 'F4', label: 'Load Prices', icon: 'bi-cloud-download', route: '/pricing-valuation/load-prices' },
  { key: 'F5', label: 'Period Close', icon: 'bi-calendar-check', route: '/posting-periods' },
];

// ============================================================
// COMPONENT
// ============================================================

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, DecimalPipe, DatePipe, CurrencyPipe, DashboardChart, DashboardAllocationChart],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard {
  // Signals for reactive data
  readonly heroMetrics = signal<HeroMetric[]>(MOCK_HERO_METRICS);
  readonly tickerItems = signal<TickerItem[]>(MOCK_TICKER_ITEMS);
  readonly activityItems = signal<ActivityItem[]>(MOCK_ACTIVITY);
  readonly postingPeriods = signal<PostingPeriod[]>(MOCK_PERIODS);
  readonly fundSummaries = signal<FundSummary[]>(MOCK_FUNDS);
  readonly quickActions = signal<QuickAction[]>(QUICK_ACTIONS);

  // Computed: duplicate ticker items for seamless scroll
  readonly tickerTrack = computed(() => [...this.tickerItems(), ...this.tickerItems()]);

  // Computed: stats for the grid
  readonly statsData = computed(() => ({
    totalSecurities: 1247,
    activeAccounts: 892,
    pendingSettlements: 34,
    overdueItems: 7,
  }));

  // Format relative time for activity feed
  formatRelativeTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  }

  // Format metric value based on type
  formatMetricValue(metric: HeroMetric): string {
    switch (metric.format) {
      case 'currency':
        return this.formatCompactCurrency(metric.value);
      case 'percent':
        return `${(metric.value * 100).toFixed(2)}%`;
      default:
        return metric.value.toLocaleString();
    }
  }

  // Compact currency format (1.2B, 450M, etc.)
  private formatCompactCurrency(value: number): string {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(0)}K`;
    return `$${value.toFixed(0)}`;
  }
}
