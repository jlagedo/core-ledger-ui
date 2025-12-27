import { inject, Injectable } from '@angular/core';
import { ToastService } from './toast-service';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  message: string;
  data?: unknown;
  context?: string;
}

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  private toastService = inject(ToastService);

  // In production, this would be configurable via environment
  private readonly logLevel: LogLevel = 'debug';
  private readonly isDevelopment = true; // Should come from environment

  private readonly levelPriority: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  };

  debug(message: string, data?: unknown, context?: string) {
    this.log('debug', message, data, context);
  }

  info(message: string, data?: unknown, context?: string) {
    this.log('info', message, data, context);
  }

  warn(message: string, data?: unknown, context?: string) {
    this.log('warn', message, data, context);
  }

  error(message: string, data?: unknown, context?: string) {
    this.log('error', message, data, context);
  }

  /**
   * Log an HTTP error and optionally show a toast notification to the user
   */
  logHttpError(
    operation: string,
    error: unknown,
    userMessage?: string,
    showToast = true
  ): void {
    const httpError = error as {
      status?: number;
      error?: {
        errorCode?: string;
        message?: string;
        correlationId?: string;
        traceId?: string;
        errors?: Record<string, string[]>;
      };
    };

    const errorMessage = `HTTP Error in ${operation}`;
    const errorData = {
      status: httpError.status,
      errorCode: httpError.error?.errorCode,
      message: httpError.error?.message,
      correlationId: httpError.error?.correlationId,
      traceId: httpError.error?.traceId,
      validationErrors: httpError.error?.errors,
    };

    this.error(errorMessage, errorData, operation);

    if (showToast) {
      const displayMessage =
        userMessage ||
        httpError.error?.message ||
        `An error occurred during ${operation}`;
      this.toastService.error(displayMessage);
    }
  }

  private log(level: LogLevel, message: string, data?: unknown, context?: string) {
    if (!this.shouldLog(level)) {
      return;
    }

    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      data,
      context,
    };

    // In development, log to console with appropriate method
    if (this.isDevelopment) {
      this.logToConsole(entry);
    }

    // In production, you would send logs to a logging service
    // e.g., Application Insights, Sentry, LogRocket, etc.
    // this.sendToLoggingService(entry);
  }

  private shouldLog(level: LogLevel): boolean {
    return this.levelPriority[level] >= this.levelPriority[this.logLevel];
  }

  private logToConsole(entry: LogEntry) {
    const prefix = `[${entry.timestamp.toISOString()}]${entry.context ? ` [${entry.context}]` : ''}`;
    const message = `${prefix} ${entry.message}`;

    switch (entry.level) {
      case 'debug':
        console.debug(message, entry.data ?? '');
        break;
      case 'info':
        console.info(message, entry.data ?? '');
        break;
      case 'warn':
        console.warn(message, entry.data ?? '');
        break;
      case 'error':
        console.error(message, entry.data ?? '');
        break;
    }
  }

  // Placeholder for production logging
  // private sendToLoggingService(entry: LogEntry) {
  //   // Send to Application Insights, Sentry, etc.
  // }
}
