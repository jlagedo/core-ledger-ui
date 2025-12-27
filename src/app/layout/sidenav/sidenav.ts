import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-sidenav',
  imports: [RouterModule, NgbCollapse],
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.scss',
})
export class Sidenav {
  isLedgerCollapsed = signal(true);

  toggleLedger() {
    this.isLedgerCollapsed.update(value => !value);
  }
}
