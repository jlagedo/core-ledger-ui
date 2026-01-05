import { Injectable, inject, signal, computed, effect, DestroyRef } from '@angular/core';
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState as SignalRState,
  LogLevel,
} from '@microsoft/signalr';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { firstValueFrom } from 'rxjs';
import { ToastService } from './toast-service';
import { LoggerService } from './logger';
import { AuthService } from '../auth/auth-service';
import { MockAuthService } from '../auth/mock-auth.service';
import { ENVIRONMENT } from '../config/environment.config';
import { HubConnectionState, NotificationMessage } from '../models/notification.model';
import { environment } from '../../environments/environment';

/**
 * Service for managing SignalR hub connection and receiving real-time notifications.
 * Connects automatically after user authentication and handles reconnection with exponential backoff.
 *
 * Usage:
 * - Automatically connects when user logs in (via AuthService integration)
 * - Automatically disconnects when user logs out
 * - Received notifications are displayed via ToastService
 *
 * @example
 * // Connection state can be observed via signal
 * const hubService = inject(NotificationHubService);
 * const isConnected = hubService.isConnected();
 */
@Injectable({
  providedIn: 'root',
})
export class NotificationHubService {
  private readonly env = inject(ENVIRONMENT);
  private readonly toastService = inject(ToastService);
  private readonly logger = inject(LoggerService);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly oidcSecurityService = inject(OidcSecurityService);
  private readonly mockAuthService = inject(MockAuthService, { optional: true });

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

  // Hub connection instance
  private hubConnection: HubConnection | null = null;

  // Configuration with defaults
  private readonly config = this.env.signalr ?? {
    useMock: false,
    hubUrl: '/api/hub/notifications',
    reconnectDelays: [0, 2000, 5000, 10000, 30000],
    maxReconnectAttempts: 5,
  };

  constructor() {
    // Skip real SignalR if mock mode is enabled (handled by MockNotificationHubService)
    if (this.config.useMock) {
      this.logger.debug(
        'SignalR mock mode enabled, skipping real connection',
        undefined,
        'NotificationHubService'
      );
      return;
    }

    // Reactive effect: connect/disconnect based on auth state
    effect(() => {
      const isLoggedIn = this.authService.isLoggedIn();

      if (isLoggedIn && !this.isConnected()) {
        this.connect();
      } else if (!isLoggedIn && this.hubConnection) {
        this.disconnect();
      }
    });

    // Cleanup on destroy
    this.destroyRef.onDestroy(() => {
      this.disconnect();
    });
  }

  /**
   * Establishes connection to the SignalR hub.
   * Called automatically when user logs in.
   */
  async connect(): Promise<void> {
    if (this.config.useMock) {
      return;
    }

    if (this.hubConnection?.state === SignalRState.Connected) {
      this.logger.debug('Already connected to notification hub', undefined, 'NotificationHubService');
      return;
    }

    try {
      this._connectionState.set('connecting');
      this._lastError.set(null);

      this.hubConnection = new HubConnectionBuilder()
        .withUrl(this.config.hubUrl, {
          accessTokenFactory: () => this.getAccessToken(),
        })
        .withAutomaticReconnect({
          nextRetryDelayInMilliseconds: (retryContext) => {
            const attempt = retryContext.previousRetryCount;
            this._reconnectAttempts.set(attempt + 1);

            if (attempt >= this.config.maxReconnectAttempts) {
              this._connectionState.set('failed');
              this.logger.error(
                'Max reconnection attempts reached',
                { attempts: attempt },
                'NotificationHubService'
              );
              return null; // Stop reconnecting
            }

            const delay =
              this.config.reconnectDelays[Math.min(attempt, this.config.reconnectDelays.length - 1)];
            this.logger.debug(
              'Scheduling reconnection',
              { attempt: attempt + 1, delayMs: delay },
              'NotificationHubService'
            );
            return delay;
          },
        })
        .configureLogging(this.env.production ? LogLevel.Warning : LogLevel.Information)
        .build();

      // Register event handlers
      this.registerEventHandlers();

      // Start the connection
      await this.hubConnection.start();
      this._connectionState.set('connected');
      this._reconnectAttempts.set(0);

      this.logger.info('Connected to notification hub', undefined, 'NotificationHubService');
    } catch (error) {
      this._connectionState.set('failed');
      this._lastError.set(error instanceof Error ? error.message : 'Connection failed');

      this.logger.error('Failed to connect to notification hub', { error }, 'NotificationHubService');
    }
  }

  /**
   * Disconnects from the SignalR hub.
   * Called automatically when user logs out.
   */
  async disconnect(): Promise<void> {
    if (!this.hubConnection) {
      return;
    }

    try {
      await this.hubConnection.stop();
      this.logger.info('Disconnected from notification hub', undefined, 'NotificationHubService');
    } catch (error) {
      this.logger.error(
        'Error disconnecting from notification hub',
        { error },
        'NotificationHubService'
      );
    } finally {
      this.hubConnection = null;
      this._connectionState.set('disconnected');
      this._reconnectAttempts.set(0);
    }
  }

  /**
   * Registers event handlers for the hub connection.
   */
  private registerEventHandlers(): void {
    if (!this.hubConnection) return;

    // Handle incoming notifications
    this.hubConnection.on('ReceiveNotification', (notification: NotificationMessage) => {
      this.handleNotification(notification);
    });

    // Handle reconnecting
    this.hubConnection.onreconnecting((error) => {
      this._connectionState.set('reconnecting');
      this._lastError.set(error?.message ?? null);

      this.logger.warn(
        'Reconnecting to notification hub',
        { error: error?.message },
        'NotificationHubService'
      );
    });

    // Handle reconnected
    this.hubConnection.onreconnected((connectionId) => {
      this._connectionState.set('connected');
      this._lastError.set(null);
      this._reconnectAttempts.set(0);

      this.logger.info(
        'Reconnected to notification hub',
        { connectionId },
        'NotificationHubService'
      );
    });

    // Handle close
    this.hubConnection.onclose((error) => {
      this._connectionState.set('disconnected');
      if (error) {
        this._lastError.set(error.message);
        this.logger.error(
          'Connection to notification hub closed with error',
          { error: error.message },
          'NotificationHubService'
        );
      } else {
        this.logger.info('Connection to notification hub closed', undefined, 'NotificationHubService');
      }
    });
  }

  /**
   * Handles incoming notification messages.
   */
  private handleNotification(notification: NotificationMessage): void {
    this.logger.debug('Received notification', { notification }, 'NotificationHubService');

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
   * Gets the access token for SignalR hub authentication.
   * Uses mock token in mock mode, otherwise gets token from OIDC service.
   */
  private async getAccessToken(): Promise<string> {
    // In mock auth mode, use mock token
    if (environment.auth.useMock && this.mockAuthService) {
      return this.mockAuthService.getAccessToken();
    }

    // In real auth mode, get token from OIDC service
    try {
      const result = await firstValueFrom(this.oidcSecurityService.getAccessToken());
      return result ?? '';
    } catch (error) {
      this.logger.error('Failed to get access token for SignalR', { error }, 'NotificationHubService');
      return '';
    }
  }
}
