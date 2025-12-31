import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbCollapse, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { UserProfile } from '../user-profile/user-profile';
import { MenuService } from '../../services/menu-service';
import { SidenavStore } from './sidenav-store';

@Component({
  selector: 'app-sidenav',
  imports: [RouterModule, NgbCollapse, NgbTooltip, UserProfile],
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidenav {
  private readonly menuService = inject(MenuService);
  readonly store = inject(SidenavStore);

  readonly menuItems = this.menuService.menuItems;
  sidenavToggle = output<boolean>();

  constructor() {
    // Initialize collapsed state for all menu items with children
    const menuLabelsWithChildren = this.menuItems()
      .filter((item) => item.children && item.children.length > 0)
      .map((item) => item.label);

    this.store.initializeMenuItems(menuLabelsWithChildren);
  }

  toggleSidenav() {
    this.store.toggleSidenav();
    this.sidenavToggle.emit(this.store.isSidenavCollapsed());
  }

  handleLogoClick(event: Event) {
    if (this.store.isSidenavCollapsed()) {
      event.preventDefault();
      this.toggleSidenav();
    }
  }
}
