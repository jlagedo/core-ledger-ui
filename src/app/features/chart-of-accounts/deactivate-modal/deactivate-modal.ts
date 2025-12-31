import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {Account} from '../../../models/account.model';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-deactivate-modal',
  imports: [],
  templateUrl: './deactivate-modal.html',
  styleUrl: './deactivate-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeactivateModal {
  activeModal = inject(NgbActiveModal);
  account = signal<Account | null>(null);
}
