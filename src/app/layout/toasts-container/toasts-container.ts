import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {ToastService} from '../../services/toast-service';
import {NgbToast} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-toasts-container',
  imports: [NgbToast],
  templateUrl: './toasts-container.html',
  styleUrl: './toasts-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'toast-container position-fixed top-0 end-0 p-3',
    style: 'z-index: 1050',
  },
})
export class ToastsContainer {
  readonly toastService = inject(ToastService);

  getToastClass(type: string): string {
    const classMap: Record<string, string> = {
      success: 'bg-success text-white',
      error: 'bg-danger text-white',
      warning: 'bg-warning text-bg-warning',
      info: 'bg-info text-white'
    };
    return classMap[type] || '';
  }
}
