import {patchState, signalStore, withHooks, withMethods, withState} from '@ngrx/signals';
import {inject} from '@angular/core';
import {LoggerService} from '../../services/logger';

export type SidenavState = {
  menuItemsCollapsedState: Record<string, boolean>;
  isSidenavCollapsed: boolean;
};

const STORAGE_KEY = 'sidenav-state';

const initialState: SidenavState = {
  menuItemsCollapsedState: {},
  isSidenavCollapsed: false,
};

/**
 * Loads sidenav state from sessionStorage
 */
function loadStateFromSession(logger: LoggerService): SidenavState {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      const loadedState: SidenavState = {...initialState, ...JSON.parse(stored)};
      logger.debug('Loaded sidenav state from sessionStorage', loadedState, STORAGE_KEY);
      return loadedState;
    }
  } catch (error) {
    logger.warn('Failed to load sidenav state from sessionStorage', error, STORAGE_KEY);
  }
  logger.debug('Using initial sidenav state (no stored state found)', undefined, STORAGE_KEY);
  return initialState;
}

/**
 * Saves sidenav state to sessionStorage
 */
function saveStateToSession(state: SidenavState, logger: LoggerService): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    logger.debug('Saved sidenav state to sessionStorage', state, STORAGE_KEY);
  } catch (error) {
    // SessionStorage can fail if:
    // - Storage quota exceeded
    // - Privacy mode/incognito blocks storage
    // - Browser doesn't support sessionStorage
    logger.warn('Failed to save sidenav state to sessionStorage', error, STORAGE_KEY);
  }
}

/**
 * Signal store for managing sidenav state with sessionStorage persistence
 */
export const SidenavStore = signalStore(
  {providedIn: 'root'},
  withState(initialState),
  withMethods((store) => {
    const logger = inject(LoggerService);

    const saveCurrentState = () => {
      const state: SidenavState = {
        menuItemsCollapsedState: store.menuItemsCollapsedState(),
        isSidenavCollapsed: store.isSidenavCollapsed(),
      };
      saveStateToSession(state, logger);
    };

    return {
      /**
       * Toggle a menu item's collapsed state
       */
      toggleMenuItem(label: string) {
        const currentState = store.menuItemsCollapsedState();
        const isCurrentlyCollapsed = currentState[label] ?? true;

        patchState(store, {
          menuItemsCollapsedState: {
            ...currentState,
            [label]: !isCurrentlyCollapsed,
          },
        });
        saveCurrentState();
      },

      /**
       * Set a menu item's collapsed state explicitly
       */
      setMenuItemCollapsed(label: string, collapsed: boolean) {
        const currentState = store.menuItemsCollapsedState();

        patchState(store, {
          menuItemsCollapsedState: {
            ...currentState,
            [label]: collapsed,
          },
        });
        saveCurrentState();
      },

      /**
       * Check if a menu item is collapsed
       */
      isMenuItemCollapsed(label: string): boolean {
        return store.menuItemsCollapsedState()[label] ?? true;
      },

      /**
       * Toggle the entire sidenav collapsed state
       */
      toggleSidenav() {
        patchState(store, {
          isSidenavCollapsed: !store.isSidenavCollapsed(),
        });
        saveCurrentState();
      },

      /**
       * Set the sidenav collapsed state explicitly
       */
      setSidenavCollapsed(collapsed: boolean) {
        patchState(store, {
          isSidenavCollapsed: collapsed,
        });
        saveCurrentState();
      },

      /**
       * Initialize menu items with default collapsed state
       * Called by sidenav component on init with menu items from MenuService
       */
      initializeMenuItems(menuLabels: string[]) {
        const currentState = store.menuItemsCollapsedState();
        const updatedState = {...currentState};
        let hasChanges = false;

        // Only initialize items that don't already have a state
        menuLabels.forEach((label) => {
          if (!(label in updatedState)) {
            updatedState[label] = true; // Default to collapsed
            hasChanges = true;
          }
        });

        if (hasChanges) {
          patchState(store, {menuItemsCollapsedState: updatedState});
          saveCurrentState();
        }
      },
    };
  }),
  withHooks({
    onInit(store) {
      const logger = inject(LoggerService);
      const savedState = loadStateFromSession(logger);
      patchState(store, savedState);
    },
  })
);
