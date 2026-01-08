import {
  Directive,
  ElementRef,
  inject,
  OnInit,
  OnDestroy,
  input,
  afterNextRender,
  Injector,
} from '@angular/core';

/** Selector for focusable elements */
const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
].join(', ');

/**
 * Focus trap directive for modals and dialogs.
 *
 * Traps focus within the element, preventing keyboard navigation
 * from leaving the modal. Automatically focuses the first focusable
 * element on initialization and restores focus on destroy.
 *
 * @example
 * ```html
 * <div class="modal" appFocusTrap [autoFocus]="true">
 *   <button>First focusable</button>
 *   <input type="text" />
 *   <button>Close</button>
 * </div>
 * ```
 */
@Directive({
  selector: '[appFocusTrap]',
  host: {
    '(keydown)': 'onKeydown($event)',
  },
})
export class FocusTrapDirective implements OnInit, OnDestroy {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly injector = inject(Injector);

  /** Whether to auto-focus the first focusable element on init */
  readonly autoFocus = input<boolean>(true);

  /** Element that had focus before the trap was activated */
  private previouslyFocusedElement: HTMLElement | null = null;

  ngOnInit(): void {
    // Store the currently focused element to restore later
    this.previouslyFocusedElement = document.activeElement as HTMLElement;

    if (this.autoFocus()) {
      afterNextRender(
        () => {
          this.focusFirstElement();
        },
        { injector: this.injector }
      );
    }
  }

  ngOnDestroy(): void {
    // Restore focus to the previously focused element
    if (this.previouslyFocusedElement?.focus) {
      this.previouslyFocusedElement.focus();
    }
  }

  /**
   * Handle keydown events to trap Tab/Shift+Tab within the element
   */
  onKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Tab') {
      return;
    }

    const focusableElements = this.getFocusableElements();
    if (focusableElements.length === 0) {
      event.preventDefault();
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement;

    if (event.shiftKey) {
      // Shift+Tab: wrap from first to last
      if (activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab: wrap from last to first
      if (activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }

  /**
   * Focus the first focusable element in the trap
   */
  focusFirstElement(): void {
    const focusableElements = this.getFocusableElements();
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
  }

  /**
   * Focus the last focusable element in the trap
   */
  focusLastElement(): void {
    const focusableElements = this.getFocusableElements();
    if (focusableElements.length > 0) {
      focusableElements[focusableElements.length - 1].focus();
    }
  }

  /**
   * Get all focusable elements within the trap
   */
  private getFocusableElements(): HTMLElement[] {
    const element = this.elementRef.nativeElement;
    const nodeList = element.querySelectorAll(FOCUSABLE_SELECTOR);
    const elements: HTMLElement[] = [];
    nodeList.forEach((el: Element) => {
      if (el instanceof HTMLElement && this.isVisible(el)) {
        elements.push(el);
      }
    });
    return elements;
  }

  /**
   * Check if an element is visible and focusable
   */
  private isVisible(element: HTMLElement): boolean {
    return !!(
      element.offsetWidth ||
      element.offsetHeight ||
      element.getClientRects().length
    );
  }
}
