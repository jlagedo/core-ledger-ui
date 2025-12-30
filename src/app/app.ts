import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidenav } from './layout/sidenav/sidenav';
import { ToastsContainer } from './layout/toasts-container/toasts-container';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Sidenav, ToastsContainer],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('core-ledger-ui');
  protected isSidenavCollapsed = signal(false);

  private readonly authService = inject(AuthService);

  readonly isLoggedIn = this.authService.isLoggedIn;

  onSidenavToggle(collapsed: boolean): void {
    this.isSidenavCollapsed.set(collapsed);
  }
}
