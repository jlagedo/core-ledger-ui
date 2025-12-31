import {TestBed} from '@angular/core/testing';
import {LoggerService} from './logger';
import {ToastService} from './toast-service';
import {MicroSentryService} from '@micro-sentry/angular';
import {ENVIRONMENT} from '../config/environment.config';

describe('LoggerService', () => {
  let service: LoggerService;
  let toastService: ToastService;
  let microSentryService: MicroSentryService;

  // Mock MicroSentryService
  const mockMicroSentryService = {
    withScope: vi.fn((fn: (scope: unknown) => void) => {
      const mockScope = {
        setTag: vi.fn(),
        setExtra: vi.fn(),
        report: vi.fn(),
        captureMessage: vi.fn(),
      };
      fn(mockScope);
    }),
    captureMessage: vi.fn(),
    report: vi.fn(),
  };

  // Mock Environment
  const mockEnvironment = {
    production: false,
    apiUrl: '/api',
    logLevel: 'debug' as const,
    enableSentry: true,
    sentry: {
      dsn: 'test-dsn',
      environment: 'test',
      release: '1.0.0',
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: MicroSentryService, useValue: mockMicroSentryService},
        {provide: ENVIRONMENT, useValue: mockEnvironment},
      ],
    });
    service = TestBed.inject(LoggerService);
    toastService = TestBed.inject(ToastService);
    microSentryService = TestBed.inject(MicroSentryService);

    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should log debug messages', () => {
    const consoleSpy = vi.spyOn(console, 'debug');
    service.debug('Test debug message', {foo: 'bar'});
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should log info messages', () => {
    const consoleSpy = vi.spyOn(console, 'info');
    service.info('Test info message');
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should log warning messages', () => {
    const consoleSpy = vi.spyOn(console, 'warn');
    service.warn('Test warning message');
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should log error messages', () => {
    const consoleSpy = vi.spyOn(console, 'error');
    service.error('Test error message');
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should log HTTP errors and show toast', () => {
    const consoleSpy = vi.spyOn(console, 'error');
    const toastSpy = vi.spyOn(toastService, 'error');

    const error = {
      status: 500,
      error: {
        message: 'Internal Server Error',
        correlationId: '123',
      },
    };

    service.logHttpError('fetchData', error, 'Failed to load data');

    expect(consoleSpy).toHaveBeenCalled();
    expect(toastSpy).toHaveBeenCalledWith('Failed to load data');
  });

  it('should log HTTP errors without showing toast when showToast is false', () => {
    const consoleSpy = vi.spyOn(console, 'error');
    const toastSpy = vi.spyOn(toastService, 'error');

    const error = {
      status: 404,
      error: {message: 'Not Found'},
    };

    service.logHttpError('fetchData', error, undefined, false);

    expect(consoleSpy).toHaveBeenCalled();
    expect(toastSpy).not.toHaveBeenCalled();
  });

  it('should send errors to Sentry', () => {
    service.error('Test error', {foo: 'bar'}, 'TestContext');

    expect(microSentryService.withScope).toHaveBeenCalled();
  });

  it('should send warnings to Sentry', () => {
    service.warn('Test warning', {foo: 'bar'}, 'TestContext');

    expect(microSentryService.withScope).toHaveBeenCalled();
  });

  it('should not send info logs to Sentry', () => {
    service.info('Test info', {foo: 'bar'}, 'TestContext');

    expect(microSentryService.withScope).not.toHaveBeenCalled();
  });

  it('should not send debug logs to Sentry', () => {
    service.debug('Test debug', {foo: 'bar'}, 'TestContext');

    expect(microSentryService.withScope).not.toHaveBeenCalled();
  });

  it('should send HTTP errors to Sentry with proper context', () => {
    const error = {
      status: 500,
      error: {
        errorCode: 'ERR_500',
        message: 'Internal Server Error',
        correlationId: '123-abc',
        traceId: '456-def',
      },
    };

    service.logHttpError('fetchData', error, 'Failed to load data');

    expect(microSentryService.withScope).toHaveBeenCalled();
  });

  it('should not send errors to Sentry when Sentry is disabled', () => {
    // Reconfigure with Sentry disabled
    const disabledEnvironment = {...mockEnvironment, enableSentry: false};
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        {provide: MicroSentryService, useValue: mockMicroSentryService},
        {provide: ENVIRONMENT, useValue: disabledEnvironment},
      ],
    });
    const disabledService = TestBed.inject(LoggerService);
    vi.clearAllMocks();

    disabledService.error('Test error', {foo: 'bar'});

    expect(microSentryService.withScope).not.toHaveBeenCalled();
  });
});
