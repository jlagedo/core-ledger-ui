import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbCollapse, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { UserProfile } from '../user-profile/user-profile';
import { MenuService } from '../../services/menu.service';

@Component({
  selector: 'app-sidenav',
  imports: [RouterModule, NgbCollapse, NgbTooltip, UserProfile],
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidenav {
  private readonly menuService = inject(MenuService);

  readonly menuItems = this.menuService.menuItems;
  private readonly menuCollapsedState = signal<Map<string, boolean>>(new Map());
  isSidenavCollapsed = signal(false);
  sidenavToggle = output<boolean>();

  constructor() {
    // Initialize collapsed state for all menu items with children
    this.menuItems().forEach((item) => {
      if (item.children) {
        this.menuCollapsedState.update((map) => {
          map.set(item.label, true);
          return new Map(map);
        });
      }
    });
  }

  isMenuItemCollapsed(label: string): boolean {
    return this.menuCollapsedState().get(label) ?? true;
  }

  toggleMenuItem(label: string): void {
    this.menuCollapsedState.update((map) => {
      map.set(label, !map.get(label));
      return new Map(map);
    });
  }

  toggleSidenav() {
    this.isSidenavCollapsed.update((value) => !value);
    this.sidenavToggle.emit(this.isSidenavCollapsed());
  }

  handleLogoClick(event: Event) {
    if (this.isSidenavCollapsed()) {
      event.preventDefault();
      this.toggleSidenav();
    }
  }
}
