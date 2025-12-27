import {TestBed} from '@angular/core/testing';
import {LoggerService} from './logger';
import {ToastService} from './toast-service';

describe('LoggerService', () => {
  let service: LoggerService;
  let toastService: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoggerService);
    toastService = TestBed.inject(ToastService);
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
});
