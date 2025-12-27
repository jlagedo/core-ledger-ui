import {Component, inject, signal} from '@angular/core';
import {Security} from '../../../../models/security.model';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-deactivate-modal',
  imports: [],
  templateUrl: './deactivate-modal.html',
  styleUrl: './deactivate-modal.scss',
})
export class DeactivateModal {
  activeModal = inject(NgbActiveModal);
  security = signal<Security | null>(null);
}
