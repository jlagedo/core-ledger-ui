import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbCollapse, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { UserProfile } from '../user-profile/user-profile';
import { MenuService } from '../../services/menu-service';
import { SidenavStore } from './sidenav-store';
import { MenuItem } from '../../models/menu-item.model';

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

  // Flyout state - stores full item data for rendering outside scroll container
  readonly flyoutTop = signal<number | null>(null);
  readonly activeFlyoutItem = signal<MenuItem | null>(null);
  private hideTimeout: ReturnType<typeof setTimeout> | null = null;

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

  showFlyout(event: MouseEvent, item: MenuItem) {
    // Cancel any pending hide
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }

    const target = event.currentTarget as HTMLElement;
    // Get position relative to the sidenav-wrapper (positioned ancestor)
    const wrapper = target.closest('.sidenav-wrapper') as HTMLElement;
    const wrapperRect = wrapper?.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    // Calculate top relative to wrapper
    const relativeTop = targetRect.top - (wrapperRect?.top ?? 0);
    this.flyoutTop.set(relativeTop);
    this.activeFlyoutItem.set(item);
  }

  hideFlyout() {
    // Add a small delay before hiding to allow mouse to reach the flyout
    this.hideTimeout = setTimeout(() => {
      this.flyoutTop.set(null);
      this.activeFlyoutItem.set(null);
      this.hideTimeout = null;
    }, 100);
  }

  // Keep flyout visible - cancels any pending hide timeout
  keepFlyoutVisible() {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
  }
}
