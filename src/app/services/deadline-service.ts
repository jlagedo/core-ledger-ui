// ============================================================
// DEADLINE SERVICE — Operational Cutoff Management
//
// Manages operational deadlines with real-time countdown
// calculations and urgency state tracking.
// ============================================================

import { Injectable, signal, computed, OnDestroy } from '@angular/core';
import { Deadline, DeadlineState, DeadlineUrgency } from '../models/deadline.model';

@Injectable({ providedIn: 'root' })
export class DeadlineService implements OnDestroy {
  // Configurable thresholds (in milliseconds)
  private readonly WARNING_THRESHOLD = 60 * 60 * 1000; // 1 hour
  private readonly CRITICAL_THRESHOLD = 15 * 60 * 1000; // 15 minutes

  private readonly _deadlines = signal<Deadline[]>([]);
  private readonly _now = signal<Date>(new Date());
  private intervalId: ReturnType<typeof setInterval> | null = null;

  /** All configured deadlines */
  readonly deadlines = this._deadlines.asReadonly();

  /** Deadlines with calculated state (remaining time, urgency) */
  readonly deadlineStates = computed<DeadlineState[]>(() => {
    const now = this._now();
    return this._deadlines()
      .map(d => this.calculateState(d, now))
      .sort((a, b) => {
        // Expired items last, then by remaining time
        if (a.expired && !b.expired) return 1;
        if (!a.expired && b.expired) return -1;
        return a.remainingMs - b.remainingMs;
      });
  });

  /** Active (non-expired) deadlines sorted by urgency */
  readonly activeDeadlines = computed(() =>
    this.deadlineStates().filter(d => !d.expired)
  );

  /** Most urgent active deadline */
  readonly mostUrgent = computed(() => this.activeDeadlines()[0] ?? null);

  /** Count of critical deadlines */
  readonly criticalCount = computed(() =>
    this.activeDeadlines().filter(d => d.urgency === 'critical').length
  );

  /** Whether any deadline is critical */
  readonly hasCritical = computed(() => this.criticalCount() > 0);

  constructor() {
    this.startTimer();
    this.initializeDefaultDeadlines();
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  /** Add or update a deadline */
  setDeadline(deadline: Deadline): void {
    this._deadlines.update(current => {
      const index = current.findIndex(d => d.id === deadline.id);
      if (index >= 0) {
        const updated = [...current];
        updated[index] = deadline;
        return updated;
      }
      return [...current, deadline];
    });
  }

  /** Remove a deadline by ID */
  removeDeadline(id: string): void {
    this._deadlines.update(current => current.filter(d => d.id !== id));
  }

  /** Set all deadlines at once */
  setDeadlines(deadlines: Deadline[]): void {
    this._deadlines.set(deadlines);
  }

  /** Clear all deadlines */
  clearDeadlines(): void {
    this._deadlines.set([]);
  }

  private startTimer(): void {
    // Update every second for countdown precision
    this.intervalId = setInterval(() => {
      this._now.set(new Date());
    }, 1000);
  }

  private stopTimer(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private calculateState(deadline: Deadline, now: Date): DeadlineState {
    const deadlineTime = new Date(deadline.deadline).getTime();
    const remainingMs = Math.max(0, deadlineTime - now.getTime());
    const expired = remainingMs === 0;

    return {
      ...deadline,
      remainingMs,
      remainingFormatted: this.formatRemaining(remainingMs),
      urgency: this.calculateUrgency(remainingMs, expired),
      expired,
    };
  }

  private calculateUrgency(remainingMs: number, expired: boolean): DeadlineUrgency {
    if (expired) return 'expired';
    if (remainingMs <= this.CRITICAL_THRESHOLD) return 'critical';
    if (remainingMs <= this.WARNING_THRESHOLD) return 'warning';
    return 'safe';
  }

  private formatRemaining(ms: number): string {
    if (ms <= 0) return '00:00:00';

    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 99) {
      // Show days for very long durations
      const days = Math.floor(hours / 24);
      const remainingHours = hours % 24;
      return `${days}d ${String(remainingHours).padStart(2, '0')}h`;
    }

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  private initializeDefaultDeadlines(): void {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Default operational deadlines (configurable per deployment)
    const defaults: Deadline[] = [
      {
        id: 'settlement-t2',
        label: 'SETTLEMENT T+2',
        description: 'Trade settlement deadline',
        deadline: new Date(today.getTime() + 16 * 60 * 60 * 1000), // 4 PM today
        category: 'settlement',
        recurring: true,
        icon: 'bi-arrow-left-right',
      },
      {
        id: 'nav-cutoff',
        label: 'NAV CUTOFF',
        description: 'Net Asset Value calculation cutoff',
        deadline: new Date(today.getTime() + 17 * 60 * 60 * 1000), // 5 PM today
        category: 'nav',
        recurring: true,
        icon: 'bi-calculator',
      },
      {
        id: 'batch-close',
        label: 'BATCH CLOSE',
        description: 'End of day batch processing',
        deadline: new Date(today.getTime() + 23 * 60 * 60 * 1000 + 59 * 60 * 1000), // 11:59 PM
        category: 'batch',
        recurring: true,
        icon: 'bi-collection',
      },
      {
        id: 'market-close',
        label: 'MARKET CLOSE',
        description: 'NYSE market close',
        deadline: new Date(today.getTime() + 16 * 60 * 60 * 1000 + 30 * 60 * 1000), // 4:30 PM
        category: 'market',
        recurring: true,
        icon: 'bi-graph-up',
      },
    ];

    // Filter out already expired deadlines for demo purposes
    // In production, recurring deadlines would roll to next day
    const active = defaults.filter(d => new Date(d.deadline).getTime() > now.getTime());

    // If all expired (end of day), show tomorrow's deadlines
    if (active.length === 0) {
      const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
      this.setDeadlines(
        defaults.map(d => ({
          ...d,
          deadline: new Date(
            tomorrow.getTime() +
              (new Date(d.deadline).getTime() - today.getTime())
          ),
        }))
      );
    } else {
      this.setDeadlines(active);
    }
  }
}
