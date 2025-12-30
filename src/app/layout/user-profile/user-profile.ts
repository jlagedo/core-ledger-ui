import { ChangeDetectionStrategy, Component, input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  NgbDropdown,
  NgbDropdownToggle,
  NgbDropdownMenu,
  NgbDropdownItem,
} from '@ng-bootstrap/ng-bootstrap';
import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-user-profile',
  imports: [RouterLink, NgbDropdown, NgbDropdownToggle, NgbDropdownMenu, NgbDropdownItem],
  templateUrl: './user-profile.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfile {
  private readonly themeService = inject(ThemeService);
  private readonly authService = inject(AuthService);

  isCollapsed = input.required<boolean>();

  readonly isDarkMode = this.themeService.isDarkMode;
  readonly userProfile = this.authService.userProfile;

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  logout(): void {
    this.authService.logout();
  }
}
