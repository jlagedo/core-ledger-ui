import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  output,
  signal,
  viewChild,
  viewChildren,
  QueryList,
  afterNextRender,
  Injector,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { NgbCollapse, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { UserProfile } from '../user-profile/user-profile';
import { DeadlineTicker } from '../deadline-ticker/deadline-ticker';
import { MenuService } from '../../services/menu-service';
import { SidenavStore } from './sidenav-store';
import { MenuItem } from '../../models/menu-item.model';
import { map } from 'rxjs';

@Component({
  selector: 'app-sidenav',
  imports: [RouterModule, NgbCollapse, NgbTooltip, UserProfile, DeadlineTicker],
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(keydown)': 'onKeydown($event)',
  },
})
export class Sidenav {
  private readonly menuService = inject(MenuService);
  private readonly router = inject(Router);
  private readonly injector = inject(Injector);
  readonly store = inject(SidenavStore);

  readonly menuItems = this.menuService.menuItems;
  sidenavToggle = output<boolean>();

  // Track current URL for parent active state detection
  private readonly currentUrl = toSignal(
    this.router.events.pipe(map(() => this.router.url)),
    { initialValue: this.router.url }
  );

  // Search functionality
  readonly searchQuery = signal('');
  readonly isSearchFocused = signal(false);
  private readonly searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  // Keyboard navigation
  /** Reference to the navigation element for keyboard navigation */
  private readonly navElement = viewChild<ElementRef<HTMLElement>>('navElement');

  /** Currently focused menu item index (for keyboard navigation) */
  private readonly focusedItemIndex = signal<number>(-1);

  // Filtered menu items based on search query
  readonly filteredMenuItems = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const items = this.menuItems();

    if (!query) return items;

    return items
      .map(item => {
        // Check if parent label matches
        const parentMatches = item.label.toLowerCase().includes(query);

        // Check if any children match
        const matchingChildren = item.children?.filter(child =>
          child.label.toLowerCase().includes(query)
        );

        // Include item if parent matches OR has matching children
        if (parentMatches) {
          return item; // Return full item with all children
        } else if (matchingChildren && matchingChildren.length > 0) {
          return { ...item, children: matchingChildren }; // Return with filtered children
        }
        return null;
      })
      .filter((item): item is MenuItem => item !== null);
  });

  // Check if search has results
  readonly hasSearchResults = computed(() => this.filteredMenuItems().length > 0);

  // Check if we're actively searching
  readonly isSearching = computed(() => this.searchQuery().trim().length > 0);

  // Determine if a submenu should be shown expanded
  // When searching: always expand to show matching children
  // When not searching: use the stored collapsed state
  shouldShowExpanded(itemLabel: string): boolean {
    if (this.isSearching()) {
      return true; // Always expand when searching
    }
    return !this.store.isMenuItemCollapsed(itemLabel);
  }

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

  // Check if a parent menu item has any active child route
  isParentActive(item: MenuItem): boolean {
    if (!item.children) return false;
    const url = this.currentUrl();
    return item.children.some((child) => {
      if (!child.route) return false;
      // Check if current URL starts with the child route
      return url.startsWith(child.route);
    });
  }

  // Search methods
  onSearchInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  clearSearch() {
    this.searchQuery.set('');
    this.searchInput()?.nativeElement.focus();
  }

  onSearchKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.clearSearch();
      this.searchInput()?.nativeElement.blur();
    }
  }

  // Highlight matching text in labels
  highlightMatch(text: string): string {
    const query = this.searchQuery().trim();
    if (!query) return text;

    const regex = new RegExp(`(${this.escapeRegex(query)})`, 'gi');
    return text.replace(regex, '<mark class="search-highlight">$1</mark>');
  }

  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // ============================================================
  // KEYBOARD NAVIGATION
  // ============================================================

  /**
   * Handle keyboard events for menu navigation.
   * Supports arrow keys, Enter, Space, Home, End, and Escape.
   */
  onKeydown(event: KeyboardEvent): void {
    const target = event.target as HTMLElement;

    // Don't interfere with search input typing
    if (target.matches('input')) {
      return;
    }

    const navLinks = this.getNavigableElements();
    if (navLinks.length === 0) return;

    const currentIndex = this.focusedItemIndex();

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.focusNextItem(navLinks, currentIndex);
        break;

      case 'ArrowUp':
        event.preventDefault();
        this.focusPreviousItem(navLinks, currentIndex);
        break;

      case 'ArrowRight':
        // Expand submenu or show flyout
        if (this.store.isSidenavCollapsed()) {
          this.handleFlyoutOpen(event, navLinks, currentIndex);
        } else {
          this.handleExpandSubmenu(navLinks, currentIndex);
        }
        break;

      case 'ArrowLeft':
        // Collapse submenu or close flyout
        if (this.store.isSidenavCollapsed()) {
          this.handleFlyoutClose();
        } else {
          this.handleCollapseSubmenu(navLinks, currentIndex);
        }
        break;

      case 'Home':
        event.preventDefault();
        this.focusFirstItem(navLinks);
        break;

      case 'End':
        event.preventDefault();
        this.focusLastItem(navLinks);
        break;

      case 'Enter':
      case ' ':
        event.preventDefault();
        this.activateItem(navLinks, currentIndex);
        break;

      case 'Escape':
        // Close flyout if open, otherwise blur
        if (this.activeFlyoutItem()) {
          this.handleFlyoutClose();
        } else {
          (document.activeElement as HTMLElement)?.blur();
        }
        break;
    }
  }

  /**
   * Get all navigable elements in the menu (links and parent buttons)
   */
  private getNavigableElements(): HTMLElement[] {
    const nav = this.navElement()?.nativeElement;
    if (!nav) return [];

    return Array.from(
      nav.querySelectorAll<HTMLElement>(
        '.nav-link:not(.btn-toggle-nav .nav-link), .nav-flyout__link'
      )
    ).filter((el) => this.isVisible(el));
  }

  /**
   * Check if element is visible
   */
  private isVisible(el: HTMLElement): boolean {
    return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
  }

  /**
   * Focus the next menu item
   */
  private focusNextItem(navLinks: HTMLElement[], currentIndex: number): void {
    const nextIndex = currentIndex < navLinks.length - 1 ? currentIndex + 1 : 0;
    this.focusItem(navLinks, nextIndex);
  }

  /**
   * Focus the previous menu item
   */
  private focusPreviousItem(navLinks: HTMLElement[], currentIndex: number): void {
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : navLinks.length - 1;
    this.focusItem(navLinks, prevIndex);
  }

  /**
   * Focus the first menu item
   */
  private focusFirstItem(navLinks: HTMLElement[]): void {
    this.focusItem(navLinks, 0);
  }

  /**
   * Focus the last menu item
   */
  private focusLastItem(navLinks: HTMLElement[]): void {
    this.focusItem(navLinks, navLinks.length - 1);
  }

  /**
   * Focus a specific menu item
   */
  private focusItem(navLinks: HTMLElement[], index: number): void {
    if (index >= 0 && index < navLinks.length) {
      navLinks[index].focus();
      this.focusedItemIndex.set(index);
    }
  }

  /**
   * Activate the focused item (click or navigate)
   */
  private activateItem(navLinks: HTMLElement[], currentIndex: number): void {
    if (currentIndex >= 0 && currentIndex < navLinks.length) {
      const element = navLinks[currentIndex];

      // Check if it's a parent menu with children (has aria-expanded)
      const isParent = element.hasAttribute('aria-expanded');
      if (isParent) {
        // Toggle the submenu
        element.click();
      } else {
        // Navigate to the route
        element.click();
      }
    }
  }

  /**
   * Handle expanding submenu with right arrow
   */
  private handleExpandSubmenu(navLinks: HTMLElement[], currentIndex: number): void {
    if (currentIndex >= 0 && currentIndex < navLinks.length) {
      const element = navLinks[currentIndex];
      const isParent = element.hasAttribute('aria-expanded');

      if (isParent && element.getAttribute('aria-expanded') === 'false') {
        element.click(); // Expand the submenu
      } else if (isParent) {
        // Already expanded, focus first child
        afterNextRender(
          () => {
            const submenuId = element.getAttribute('aria-controls');
            if (submenuId) {
              const submenu = document.getElementById(submenuId);
              const firstChild = submenu?.querySelector<HTMLElement>('.nav-link');
              if (firstChild) {
                firstChild.focus();
              }
            }
          },
          { injector: this.injector }
        );
      }
    }
  }

  /**
   * Handle collapsing submenu with left arrow
   */
  private handleCollapseSubmenu(navLinks: HTMLElement[], currentIndex: number): void {
    if (currentIndex >= 0 && currentIndex < navLinks.length) {
      const element = navLinks[currentIndex];
      const isParent = element.hasAttribute('aria-expanded');

      // If we're in a submenu, focus the parent
      const submenuParent = element.closest('.btn-toggle-nav');
      if (submenuParent) {
        const parentLink = submenuParent.previousElementSibling as HTMLElement;
        if (parentLink?.classList.contains('nav-link')) {
          parentLink.focus();
          return;
        }
      }

      // If on a parent that's expanded, collapse it
      if (isParent && element.getAttribute('aria-expanded') === 'true') {
        element.click();
      }
    }
  }

  /**
   * Handle opening flyout with keyboard (collapsed mode)
   */
  private handleFlyoutOpen(event: KeyboardEvent, navLinks: HTMLElement[], currentIndex: number): void {
    if (currentIndex >= 0 && currentIndex < navLinks.length) {
      const element = navLinks[currentIndex];
      const menuItem = this.getMenuItemFromElement(element);

      if (menuItem?.children) {
        // Simulate mouse enter to show flyout
        const rect = element.getBoundingClientRect();
        const wrapper = element.closest('.sidenav-wrapper') as HTMLElement;
        const wrapperRect = wrapper?.getBoundingClientRect();
        const relativeTop = rect.top - (wrapperRect?.top ?? 0);

        this.flyoutTop.set(relativeTop);
        this.activeFlyoutItem.set(menuItem);

        // Focus first item in flyout after render
        afterNextRender(
          () => {
            const flyout = document.querySelector('.nav-flyout');
            const firstLink = flyout?.querySelector<HTMLElement>('.nav-flyout__link');
            if (firstLink) {
              firstLink.focus();
            }
          },
          { injector: this.injector }
        );
      }
    }
  }

  /**
   * Handle closing flyout with keyboard
   */
  private handleFlyoutClose(): void {
    this.flyoutTop.set(null);
    this.activeFlyoutItem.set(null);
  }

  /**
   * Get menu item data from DOM element
   */
  private getMenuItemFromElement(element: HTMLElement): MenuItem | null {
    const items = this.filteredMenuItems();
    const parentItems = items.filter((item) => item.children && item.children.length > 0);
    const allParentLinks = element.closest('.sidenav-nav')?.querySelectorAll('.nav-item--parent > .nav-link');
    if (!allParentLinks) return null;

    const index = Array.from(allParentLinks).indexOf(element);
    return index >= 0 && index < parentItems.length ? parentItems[index] : null;
  }

  /**
   * Show flyout from keyboard event (Enter/Space)
   */
  showFlyoutFromKeyboard(item: MenuItem, event: Event): void {
    event.preventDefault();
    const target = event.target as HTMLElement;
    const wrapper = target.closest('.sidenav-wrapper') as HTMLElement;
    const wrapperRect = wrapper?.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const relativeTop = targetRect.top - (wrapperRect?.top ?? 0);

    this.flyoutTop.set(relativeTop);
    this.activeFlyoutItem.set(item);

    // Focus first item in flyout after render
    afterNextRender(
      () => {
        const flyout = document.querySelector('.nav-flyout');
        const firstLink = flyout?.querySelector<HTMLElement>('.nav-flyout__link');
        if (firstLink) {
          firstLink.focus();
        }
      },
      { injector: this.injector }
    );
  }

  /**
   * Track focus changes for roving tabindex
   */
  onMenuItemFocus(index: number): void {
    this.focusedItemIndex.set(index);
  }
}
