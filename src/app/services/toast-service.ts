import {Injectable, signal} from '@angular/core';

export type ToastType = 'success' | 'warning' | 'error' | 'info';

export interface Toast {
  message: string;
  type: ToastType;
  delay?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private readonly DEFAULT_DELAY = 10000;

  private readonly _toasts = signal<Toast[]>([]);
  readonly toasts = this._toasts.asReadonly();

  success(message: string, delay = this.DEFAULT_DELAY) {
    this.show({message, type: 'success', delay});
  }

  warning(message: string, delay = this.DEFAULT_DELAY) {
    this.show({message, type: 'warning', delay});
  }

  error(message: string, delay = this.DEFAULT_DELAY) {
    this.show({message, type: 'error', delay});
  }

  info(message: string, delay = this.DEFAULT_DELAY) {
    this.show({message, type: 'info', delay});
  }

  remove(toast: Toast) {
    this._toasts.update((toasts) => toasts.filter((t) => t !== toast));
  }

  clear() {
    this._toasts.set([]);
  }

  private show(toast: Toast) {
    this._toasts.update((toasts) => [...toasts, toast]);
  }

}
