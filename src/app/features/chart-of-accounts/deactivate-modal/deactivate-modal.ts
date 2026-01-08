import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Account } from '../../../models/account.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-deactivate-modal',
  imports: [],
  templateUrl: './deactivate-modal.html',
  styleUrl: './deactivate-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'role': 'dialog',
    'aria-modal': 'true',
    '[attr.aria-labelledby]': '"modal-title"',
    '(keydown.escape)': 'onEscape()',
  },
})
export class DeactivateModal {
  activeModal = inject(NgbActiveModal);
  account = signal<Account | null>(null);

  /**
   * Handle Escape key to dismiss modal
   */
  onEscape(): void {
    this.activeModal.dismiss('escape');
  }
}
