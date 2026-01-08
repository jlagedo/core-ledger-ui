import { Injectable, inject, signal, computed, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { fromEvent, filter } from 'rxjs';
import { ENVIRONMENT } from '../config/environment.config';
import { ToastService } from './toast-service';

/** Keyboard shortcut definition */
export interface KeyboardShortcut {
  /** Unique identifier for the shortcut */
  id: string;
  /** Display label for the shortcut */
  label: string;
  /** Key combination (e.g., 'alt+n', 'ctrl+shift+s') */
  keys: string;
  /** Callback function when shortcut is triggered */
  callback: () => void;
  /** Category for grouping in help dialog */
  category?: string;
  /** Whether the shortcut is currently enabled */
  enabled?: boolean;
}

/** Parsed key combination */
interface ParsedKeys {
  ctrl: boolean;
  alt: boolean;
  shift: boolean;
  meta: boolean;
  key: string;
}

/**
 * Global keyboard shortcuts service.
 *
 * Provides a centralized way to register and manage keyboard shortcuts
 * across the application. Supports modifier keys (Ctrl, Alt, Shift, Meta).
 * Automatically detects platform and shows appropriate key symbols.
 *
 * @example
 * ```typescript
 * // In a component
 * private readonly keyboardService = inject(KeyboardShortcutsService);
 *
 * ngOnInit() {
 *   this.keyboardService.register({
 *     id: 'create-fund',
 *     label: 'Create new fund',
 *     keys: 'alt+n',
 *     callback: () => this.router.navigate(['/funds/new']),
 *     category: 'Navigation'
 *   });
 * }
 * ```
 */
@Injectable({ providedIn: 'root' })
export class KeyboardShortcutsService {
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly environment = inject(ENVIRONMENT);
  private readonly toastService = inject(ToastService);

  /** Whether the user is on macOS */
  private readonly isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);

  /** Whether we're in development mode (show debug toasts) */
  private readonly isDevelopment = !this.environment.production;

  /** Registered shortcuts */
  private readonly _shortcuts = signal<Map<string, KeyboardShortcut>>(new Map());

  /** Public readonly list of shortcuts */
  readonly shortcuts = computed(() => Array.from(this._shortcuts().values()));

  /** Shortcuts grouped by category */
  readonly shortcutsByCategory = computed(() => {
    const groups = new Map<string, KeyboardShortcut[]>();
    for (const shortcut of this.shortcuts()) {
      const category = shortcut.category || 'General';
      if (!groups.has(category)) {
        groups.set(category, []);
      }
      groups.get(category)!.push(shortcut);
    }
    return groups;
  });

  /** Whether shortcuts are currently enabled (disabled during modal/form focus) */
  private readonly _enabled = signal(true);
  readonly enabled = this._enabled.asReadonly();

  constructor() {
    // Listen for global keydown events
    fromEvent<KeyboardEvent>(document, 'keydown')
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter(() => this._enabled()),
        filter((event) => this.shouldHandleEvent(event))
      )
      .subscribe((event) => this.handleKeydown(event));

    // Register default global shortcuts
    this.registerDefaults();
  }

  /**
   * Register a keyboard shortcut
   */
  register(shortcut: KeyboardShortcut): void {
    this._shortcuts.update((shortcuts) => {
      const updated = new Map(shortcuts);
      updated.set(shortcut.id, { enabled: true, ...shortcut });
      return updated;
    });
  }

  /**
   * Unregister a keyboard shortcut
   */
  unregister(id: string): void {
    this._shortcuts.update((shortcuts) => {
      const updated = new Map(shortcuts);
      updated.delete(id);
      return updated;
    });
  }

  /**
   * Enable or disable a specific shortcut
   */
  setEnabled(id: string, enabled: boolean): void {
    this._shortcuts.update((shortcuts) => {
      const shortcut = shortcuts.get(id);
      if (shortcut) {
        const updated = new Map(shortcuts);
        updated.set(id, { ...shortcut, enabled });
        return updated;
      }
      return shortcuts;
    });
  }

  /**
   * Enable all shortcuts
   */
  enableAll(): void {
    this._enabled.set(true);
  }

  /**
   * Disable all shortcuts (e.g., when modal is open)
   */
  disableAll(): void {
    this._enabled.set(false);
  }

  /**
   * Get human-readable key combination label (platform-aware)
   */
  getKeyLabel(keys: string): string {
    return this.getKeyParts(keys).join(this.isMac ? '' : '+');
  }

  /**
   * Get key parts as array for display (platform-aware)
   */
  getKeyParts(keys: string): string[] {
    const parsed = this.parseKeys(keys);
    const parts: string[] = [];

    if (this.isMac) {
      // macOS uses symbols: ⌃ Control, ⌥ Option, ⇧ Shift, ⌘ Command
      if (parsed.ctrl) parts.push('⌃');
      if (parsed.alt) parts.push('⌥');
      if (parsed.shift) parts.push('⇧');
      if (parsed.meta) parts.push('⌘');
    } else {
      // Windows/Linux uses text labels
      if (parsed.ctrl) parts.push('Ctrl');
      if (parsed.alt) parts.push('Alt');
      if (parsed.shift) parts.push('Shift');
      if (parsed.meta) parts.push('Win');
    }

    // Capitalize single letter keys, format special keys
    let keyLabel = parsed.key;
    if (keyLabel.length === 1) {
      keyLabel = keyLabel.toUpperCase();
    } else if (keyLabel === '/') {
      keyLabel = '?';
    } else {
      // Capitalize first letter for named keys
      keyLabel = keyLabel.charAt(0).toUpperCase() + keyLabel.slice(1);
    }
    parts.push(keyLabel);

    return parts;
  }

  /**
   * Check if running on macOS
   */
  get isMacPlatform(): boolean {
    return this.isMac;
  }

  /**
   * Register default application-wide shortcuts
   */
  private registerDefaults(): void {
    // Help shortcut (show keyboard shortcuts)
    this.register({
      id: 'show-help',
      label: 'Show keyboard shortcuts',
      keys: 'shift+?',
      callback: () => this.showHelp(),
      category: 'Help',
    });

    // Navigation shortcuts
    this.register({
      id: 'go-dashboard',
      label: 'Go to Dashboard',
      keys: 'alt+d',
      callback: () => this.router.navigate(['/dashboard']),
      category: 'Navigation',
    });

    this.register({
      id: 'go-funds',
      label: 'Go to Funds',
      keys: 'alt+f',
      callback: () => this.router.navigate(['/funds']),
      category: 'Navigation',
    });

    this.register({
      id: 'go-accounts',
      label: 'Go to Chart of Accounts',
      keys: 'alt+a',
      callback: () => this.router.navigate(['/chart-of-accounts']),
      category: 'Navigation',
    });

    this.register({
      id: 'go-transactions',
      label: 'Go to Transactions',
      keys: 'alt+t',
      callback: () => this.router.navigate(['/transactions']),
      category: 'Navigation',
    });

    // Focus shortcuts
    this.register({
      id: 'focus-search',
      label: 'Focus search',
      keys: 'ctrl+k',
      callback: () => this.focusSearch(),
      category: 'Focus',
    });

    this.register({
      id: 'focus-main',
      label: 'Focus main content',
      keys: 'alt+m',
      callback: () => this.focusMain(),
      category: 'Focus',
    });
  }

  /**
   * Handle keydown event and trigger matching shortcut
   */
  private handleKeydown(event: KeyboardEvent): void {
    const shortcuts = this._shortcuts();

    for (const shortcut of shortcuts.values()) {
      if (!shortcut.enabled) continue;

      const parsed = this.parseKeys(shortcut.keys);
      if (this.matchesEvent(event, parsed)) {
        event.preventDefault();
        event.stopPropagation();

        // Show toast notification in development mode
        if (this.isDevelopment) {
          const keyLabel = this.getKeyLabel(shortcut.keys);
          this.toastService.info(
            `[SHORTCUT] ${keyLabel} → ${shortcut.label}`,
            2000 // Short 2-second delay for keyboard feedback
          );
        }

        shortcut.callback();
        return;
      }
    }
  }

  /**
   * Parse key combination string into components
   */
  private parseKeys(keys: string): ParsedKeys {
    const parts = keys.toLowerCase().split('+');
    const key = parts.pop() || '';

    return {
      ctrl: parts.includes('ctrl') || parts.includes('control'),
      alt: parts.includes('alt'),
      shift: parts.includes('shift'),
      meta: parts.includes('meta') || parts.includes('cmd'),
      key: key === '?' ? '/' : key, // Handle ? as Shift+/
    };
  }

  /**
   * Check if keyboard event matches parsed key combination
   */
  private matchesEvent(event: KeyboardEvent, parsed: ParsedKeys): boolean {
    // Check modifiers
    if (event.ctrlKey !== parsed.ctrl) return false;
    if (event.altKey !== parsed.alt) return false;
    if (event.shiftKey !== parsed.shift) return false;
    if (event.metaKey !== parsed.meta) return false;

    const targetKey = parsed.key.toLowerCase();

    // For letter keys, always use event.code (works on all platforms)
    // This handles macOS Option+key producing special characters
    if (targetKey.length === 1 && targetKey >= 'a' && targetKey <= 'z') {
      const expectedCode = `Key${targetKey.toUpperCase()}`;
      return event.code === expectedCode;
    }

    // For special keys, check event.key
    const eventKey = event.key.toLowerCase();

    // Handle ? which requires Shift+/
    if (targetKey === '/' || targetKey === '?') {
      return eventKey === '/' || eventKey === '?';
    }

    return eventKey === targetKey;
  }

  /**
   * Check if the event should be handled (not in input/textarea)
   */
  private shouldHandleEvent(event: KeyboardEvent): boolean {
    const target = event.target as HTMLElement;
    const tagName = target.tagName.toLowerCase();

    // Don't handle shortcuts when typing in form fields
    // unless it's a modifier-key combination
    if (tagName === 'input' || tagName === 'textarea' || target.isContentEditable) {
      // Allow Ctrl/Alt/Meta combinations in inputs
      return event.ctrlKey || event.altKey || event.metaKey;
    }

    return true;
  }

  /**
   * Show keyboard shortcuts help
   */
  private showHelp(): void {
    // For now, log to console. Could be enhanced to show a modal.
    console.group('Keyboard Shortcuts');
    for (const [category, shortcuts] of this.shortcutsByCategory()) {
      console.group(category);
      for (const shortcut of shortcuts) {
        console.log(`${this.getKeyLabel(shortcut.keys)}: ${shortcut.label}`);
      }
      console.groupEnd();
    }
    console.groupEnd();
  }

  /**
   * Focus the search input
   */
  private focusSearch(): void {
    const searchInput = document.querySelector<HTMLInputElement>(
      '.sidenav-search__input, [aria-label*="search" i], [placeholder*="search" i]'
    );
    searchInput?.focus();
  }

  /**
   * Focus the main content area
   */
  private focusMain(): void {
    const mainContent = document.getElementById('main-content');
    mainContent?.focus();
  }
}
