import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidenav } from './layout/sidenav/sidenav';
import { ToastsContainer } from './layout/toasts-container/toasts-container';
import { AuthService } from './auth/auth-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Sidenav, ToastsContainer],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly title = signal('core-ledger-ui');
  protected isSidenavCollapsed = signal(false);

  private readonly authService = inject(AuthService);

  readonly isLoggedIn = this.authService.isLoggedIn;

  onSidenavToggle(collapsed: boolean): void {
    this.isSidenavCollapsed.set(collapsed);
  }

  /**
   * Skip to main content for keyboard navigation accessibility.
   * Prevents default anchor behavior and programmatically focuses main content.
   */
  skipToMain(event: Event): void {
    event.preventDefault();
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
