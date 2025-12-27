import {Component, signal} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {Sidenav} from './layout/sidenav/sidenav';
import {BreadCrumbComponent} from './layout/bread-crumb-component/bread-crumb-component';
import {ToastsContainer} from './layout/toasts-container/toasts-container';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Sidenav, BreadCrumbComponent, ToastsContainer, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('core-ledger-ui');
  protected isSidenavCollapsed = signal(false);

  onSidenavToggle(collapsed: boolean) {
    this.isSidenavCollapsed.set(collapsed);
  }
}
