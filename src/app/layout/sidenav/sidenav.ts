import { Component, signal, output, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbCollapse, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-sidenav',
  imports: [RouterModule, NgbCollapse, NgbTooltip],
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidenav {
  isLedgerCollapsed = signal(true);
  isSidenavCollapsed = signal(false);
  sidenavToggle = output<boolean>();

  toggleLedger() {
    this.isLedgerCollapsed.update(value => !value);
  }

  toggleSidenav() {
    this.isSidenavCollapsed.update(value => !value);
    this.sidenavToggle.emit(this.isSidenavCollapsed());
  }

  handleLogoClick(event: Event) {
    if (this.isSidenavCollapsed()) {
      event.preventDefault();
      this.toggleSidenav();
    }
  }
}
