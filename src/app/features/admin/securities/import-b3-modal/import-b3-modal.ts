import {Component, inject} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-import-b3-modal',
  imports: [],
  templateUrl: './import-b3-modal.html',
  styleUrl: './import-b3-modal.scss',
})
export class ImportB3Modal {
  activeModal = inject(NgbActiveModal);
}
