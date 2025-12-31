import {inject, Injectable} from '@angular/core';
import {MicroSentryService} from '@micro-sentry/angular';
import {Severity} from '@micro-sentry/core';
import {ToastService} from './toast-service';

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
  private microSentry = inject(MicroSentryService);

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

    // Send to Sentry with enhanced context
    this.sendHttpErrorToSentry(operation, errorMessage, errorData);

    // Also log locally
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

    // Send errors and warnings to Sentry
    this.sendToSentry(entry);
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

  private sendToSentry(entry: LogEntry) {
    // Only send errors and warnings to Sentry
    if (entry.level !== 'error' && entry.level !== 'warn') {
      return;
    }

    try {
      // Use withScope to add context for this specific log entry
      this.microSentry.withScope((scope) => {
        // Add context as tags
        if (entry.context) {
          scope.setTag('context', entry.context);
        }

        // Add level as tag
        scope.setTag('logLevel', entry.level);

        // Add any additional data as extras
        if (entry.data) {
          scope.setExtra('data', JSON.stringify(entry.data));
        }

        // Add timestamp
        scope.setExtra('timestamp', entry.timestamp.toISOString());

        // For errors, if data is an Error object, report it directly
        // Otherwise, capture as a message
        if (entry.level === 'error' && entry.data instanceof Error) {
          scope.report(entry.data);
        } else {
          const severity = entry.level === 'error' ? Severity.error : Severity.warning;
          scope.captureMessage(entry.message, severity);
        }
      });
    } catch (error) {
      // Prevent logging errors from breaking the application
      console.error('Failed to send log to Sentry:', error);
    }
  }

  private sendHttpErrorToSentry(
    operation: string,
    message: string,
    errorData: {
      status?: number;
      errorCode?: string;
      message?: string;
      correlationId?: string;
      traceId?: string;
      validationErrors?: Record<string, string[]>;
    }
  ) {
    try {
      this.microSentry.withScope((scope) => {
        // Add operation context
        scope.setTag('operation', operation);
        scope.setTag('errorType', 'http');

        // Add HTTP status as tag for easier filtering
        if (errorData.status) {
          scope.setTag('httpStatus', errorData.status.toString());
        }

        // Add error code if available
        if (errorData.errorCode) {
          scope.setTag('errorCode', errorData.errorCode);
        }

        // Add correlation/trace IDs as tags for tracing
        if (errorData.correlationId) {
          scope.setExtra('correlationId', errorData.correlationId);
        }
        if (errorData.traceId) {
          scope.setExtra('traceId', errorData.traceId);
        }

        // Add validation errors if present
        if (errorData.validationErrors) {
          scope.setExtra('validationErrors', JSON.stringify(errorData.validationErrors));
        }

        // Add all error data as extras
        scope.setExtra('httpErrorData', JSON.stringify(errorData));

        // Capture the error message
        scope.captureMessage(message, Severity.error);
      });
    } catch (error) {
      console.error('Failed to send HTTP error to Sentry:', error);
    }
  }
}
