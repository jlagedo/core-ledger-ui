import {ChangeDetectionStrategy, Component, output, signal} from '@angular/core';
import {RouterModule} from '@angular/router';
import {NgbCollapse, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-sidenav',
  imports: [RouterModule, NgbCollapse, NgbTooltip],
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidenav {
  isFundsCollapsed = signal(true);
  isPortfolioCollapsed = signal(true);
  isTransactionsCollapsed = signal(true);
  isPricingCollapsed = signal(true);
  isNavCollapsed = signal(true);
  isReportsCollapsed = signal(true);
  isAdminCollapsed = signal(true);
  isLedgerCollapsed = signal(true);
  isSidenavCollapsed = signal(false);
  sidenavToggle = output<boolean>();

  toggleFunds() {
    this.isFundsCollapsed.update(value => !value);
  }

  togglePortfolio() {
    this.isPortfolioCollapsed.update(value => !value);
  }

  toggleTransactions() {
    this.isTransactionsCollapsed.update(value => !value);
  }

  togglePricing() {
    this.isPricingCollapsed.update(value => !value);
  }

  toggleNav() {
    this.isNavCollapsed.update(value => !value);
  }

  toggleReports() {
    this.isReportsCollapsed.update(value => !value);
  }

  toggleAdmin() {
    this.isAdminCollapsed.update(value => !value);
  }

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
