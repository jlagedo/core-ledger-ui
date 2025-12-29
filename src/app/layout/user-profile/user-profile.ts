import { ChangeDetectionStrategy, Component, input, inject } from '@angular/core';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-user-profile',
  template: `
    <div [class.justify-content-center]="isCollapsed()" [class.justify-content-between]="!isCollapsed()"
         class="d-flex align-items-center p-3">
      <!-- Profile Icon -->
      <button
        [attr.aria-label]="'User profile'"
        class="btn btn-link text-white p-0"
        type="button">
        <i class="bi bi-person-circle" style="font-size: 1.5rem;"></i>
      </button>

      <!-- Theme Toggle (hidden when collapsed) -->
      @if (!isCollapsed()) {
        <button
          (click)="toggleTheme()"
          [attr.aria-label]="isDarkMode() ? 'Switch to light mode' : 'Switch to dark mode'"
          class="btn btn-link text-white p-0"
          type="button">
          <i [class]="isDarkMode() ? 'bi bi-sun-fill' : 'bi bi-moon-fill'" style="font-size: 1.25rem;"></i>
        </button>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserProfile {
  private readonly themeService = inject(ThemeService);

  isCollapsed = input.required<boolean>();
  readonly isDarkMode = this.themeService.isDarkMode;

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
