import { Injectable, inject, signal, computed, effect, DestroyRef } from '@angular/core';
import { ToastService } from './toast-service';
import { LoggerService } from './logger';
import { AuthService } from '../auth/auth-service';
import { ENVIRONMENT } from '../config/environment.config';
import { HubConnectionState, NotificationMessage } from '../models/notification.model';
import { environment } from '../../environments/environment';

/**
 * Mock notification hub service for development and testing.
 * Simulates the SignalR hub behavior without requiring a real connection.
 *
 * IMPORTANT: Only for development. Will throw error if used in production.
 *
 * Usage:
 * - Automatically "connects" when user logs in
 * - Provides methods to trigger test notifications
 * - Simulates connection states for UI testing
 */
@Injectable()
export class MockNotificationHubService {
  private readonly env = inject(ENVIRONMENT);
  private readonly toastService = inject(ToastService);
  private readonly logger = inject(LoggerService);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  // Private writable signals
  private readonly _connectionState = signal<HubConnectionState>('disconnected');
  private readonly _lastError = signal<string | null>(null);
  private readonly _reconnectAttempts = signal<number>(0);

  // Public read-only signals
  readonly connectionState = this._connectionState.asReadonly();
  readonly lastError = this._lastError.asReadonly();
  readonly reconnectAttempts = this._reconnectAttempts.asReadonly();

  // Computed signals
  readonly isConnected = computed(() => this._connectionState() === 'connected');
  readonly isReconnecting = computed(() => this._connectionState() === 'reconnecting');

  constructor() {
    // Production safety check
    if (environment.production) {
      throw new Error('CRITICAL: Mock notification hub cannot be enabled in production!');
    }

    this.logger.debug('MockNotificationHubService initialized', undefined, 'MockNotificationHubService');

    // Reactive effect: simulate connect/disconnect based on auth state
    effect(() => {
      const isLoggedIn = this.authService.isLoggedIn();

      if (isLoggedIn && !this.isConnected()) {
        this.connect();
      } else if (!isLoggedIn && this.isConnected()) {
        this.disconnect();
      }
    });

    // Cleanup on destroy
    this.destroyRef.onDestroy(() => {
      this.disconnect();
    });
  }

  /**
   * Simulates establishing connection to the SignalR hub.
   */
  async connect(): Promise<void> {
    this._connectionState.set('connecting');
    this.logger.debug('Mock: Connecting to notification hub', undefined, 'MockNotificationHubService');

    // Simulate connection delay
    await this.delay(200);

    this._connectionState.set('connected');
    this._lastError.set(null);
    this._reconnectAttempts.set(0);

    this.logger.info('Mock: Connected to notification hub', undefined, 'MockNotificationHubService');

    // Show welcome notification after a short delay
    setTimeout(() => {
      if (this.isConnected()) {
        this.sendTestNotification({
          message: 'Real-time notifications enabled (Mock Mode)',
          type: 'info',
        });
      }
    }, 500);
  }

  /**
   * Simulates disconnecting from the SignalR hub.
   */
  async disconnect(): Promise<void> {
    this._connectionState.set('disconnected');
    this._lastError.set(null);
    this._reconnectAttempts.set(0);

    this.logger.info('Mock: Disconnected from notification hub', undefined, 'MockNotificationHubService');
  }

  /**
   * Sends a test notification through the mock hub.
   * Useful for testing notification handling without a real backend.
   *
   * @param notification The notification to send
   */
  sendTestNotification(notification: NotificationMessage): void {
    if (!this.isConnected()) {
      this.logger.warn(
        'Mock: Cannot send notification - not connected',
        undefined,
        'MockNotificationHubService'
      );
      return;
    }

    this.logger.debug('Mock: Sending test notification', { notification }, 'MockNotificationHubService');

    // Display notification via ToastService
    switch (notification.type) {
      case 'success':
        this.toastService.success(notification.message);
        break;
      case 'warning':
        this.toastService.warning(notification.message);
        break;
      case 'error':
        this.toastService.error(notification.message);
        break;
      case 'info':
      default:
        this.toastService.info(notification.message);
        break;
    }
  }

  /**
   * Simulates a reconnection scenario for testing.
   */
  async simulateReconnect(): Promise<void> {
    this._connectionState.set('reconnecting');
    this._reconnectAttempts.update((n) => n + 1);

    this.logger.debug('Mock: Simulating reconnection', undefined, 'MockNotificationHubService');

    await this.delay(1000);

    this._connectionState.set('connected');
    this._reconnectAttempts.set(0);

    this.logger.info('Mock: Reconnected', undefined, 'MockNotificationHubService');
  }

  /**
   * Simulates a connection failure for testing.
   */
  simulateConnectionFailure(errorMessage: string): void {
    this._connectionState.set('failed');
    this._lastError.set(errorMessage);

    this.logger.error(
      'Mock: Simulated connection failure',
      { error: errorMessage },
      'MockNotificationHubService'
    );
  }

  /**
   * Utility method to create a delay.
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
