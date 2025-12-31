import {TestBed} from '@angular/core/testing';
import {vi} from 'vitest';
import {SidenavStore} from './sidenav-store';
import {LoggerService} from '../../services/logger';

describe('SidenavStore', () => {
  let store: InstanceType<typeof SidenavStore>;
  let storage: {[key: string]: string};
  let loggerService: any;

  beforeEach(() => {
    // Mock sessionStorage
    storage = {};
    vi.spyOn(sessionStorage, 'getItem').mockImplementation((key: string) => storage[key] || null);
    vi.spyOn(sessionStorage, 'setItem').mockImplementation((key: string, value: string) => {
      storage[key] = value;
      return undefined;
    });
    vi.spyOn(sessionStorage, 'removeItem').mockImplementation((key: string) => {
      delete storage[key];
      return undefined;
    });
    vi.spyOn(sessionStorage, 'clear').mockImplementation(() => {
      storage = {};
      return undefined;
    });

    // Create mock logger
    loggerService = {
      debug: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      info: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [{provide: LoggerService, useValue: loggerService}],
    });

    store = TestBed.runInInjectionContext(() => new SidenavStore());
  });

  afterEach(() => {
    vi.clearAllMocks();
    storage = {};
  });

  describe('Initialization', () => {
    it('should initialize with default state', () => {
      expect(store.menuItemsCollapsedState()).toEqual({});
      expect(store.isSidenavCollapsed()).toBe(false);
    });

    it('should load state from sessionStorage on init', () => {
      const savedState = {
        menuItemsCollapsedState: {Funds: false, Portfolio: true},
        isSidenavCollapsed: true,
      };
      storage['sidenav-state'] = JSON.stringify(savedState);

      // Create new store instance to trigger onInit
      const newStore = TestBed.runInInjectionContext(() => new SidenavStore());

      expect(newStore.menuItemsCollapsedState()).toEqual({Funds: false, Portfolio: true});
      expect(newStore.isSidenavCollapsed()).toBe(true);
      expect(loggerService.debug).toHaveBeenCalledWith(
        'Loaded sidenav state from sessionStorage',
        expect.objectContaining({
          menuItemsCollapsedState: {Funds: false, Portfolio: true},
          isSidenavCollapsed: true,
        }),
        'sidenav-state'
      );
    });

    it('should handle missing sessionStorage gracefully', () => {
      expect(store.menuItemsCollapsedState()).toEqual({});
      expect(store.isSidenavCollapsed()).toBe(false);
      expect(loggerService.debug).toHaveBeenCalledWith(
        'Using initial sidenav state (no stored state found)',
        undefined,
        'sidenav-state'
      );
    });

    it('should handle JSON parse errors gracefully', () => {
      storage['sidenav-state'] = 'invalid json{{{';

      const newStore = TestBed.runInInjectionContext(() => new SidenavStore());

      expect(newStore.menuItemsCollapsedState()).toEqual({});
      expect(newStore.isSidenavCollapsed()).toBe(false);
      expect(loggerService.warn).toHaveBeenCalledWith(
        'Failed to load sidenav state from sessionStorage',
        expect.any(Error),
        'sidenav-state'
      );
    });
  });

  describe('Toggle Menu Item', () => {
    it('should toggle menu item from default collapsed (true) to expanded (false)', () => {
      store.toggleMenuItem('Funds');

      expect(store.menuItemsCollapsedState()['Funds']).toBe(false);
      expect(sessionStorage.setItem).toHaveBeenCalled();
    });

    it('should toggle menu item from expanded to collapsed', () => {
      store.toggleMenuItem('Funds'); // false
      store.toggleMenuItem('Funds'); // true

      expect(store.menuItemsCollapsedState()['Funds']).toBe(true);
    });

    it('should save state to sessionStorage after toggle', () => {
      store.toggleMenuItem('Portfolio');

      const savedState = JSON.parse(storage['sidenav-state']);
      expect(savedState.menuItemsCollapsedState).toEqual({Portfolio: false});
      expect(loggerService.debug).toHaveBeenCalledWith(
        'Saved sidenav state to sessionStorage',
        expect.objectContaining({menuItemsCollapsedState: {Portfolio: false}}),
        'sidenav-state'
      );
    });

    it('should handle multiple menu items independently', () => {
      store.toggleMenuItem('Funds'); // false
      store.toggleMenuItem('Portfolio'); // false
      store.toggleMenuItem('Funds'); // true

      expect(store.menuItemsCollapsedState()).toEqual({
        Funds: true,
        Portfolio: false,
      });
    });
  });

  describe('Set Menu Item Collapsed', () => {
    it('should set menu item to collapsed explicitly', () => {
      store.setMenuItemCollapsed('Funds', true);

      expect(store.menuItemsCollapsedState()['Funds']).toBe(true);
    });

    it('should set menu item to expanded explicitly', () => {
      store.setMenuItemCollapsed('Portfolio', false);

      expect(store.menuItemsCollapsedState()['Portfolio']).toBe(false);
    });

    it('should save state after explicit set', () => {
      store.setMenuItemCollapsed('Admin', false);

      const savedState = JSON.parse(storage['sidenav-state']);
      expect(savedState.menuItemsCollapsedState).toEqual({Admin: false});
    });
  });

  describe('Query Menu Item State', () => {
    it('should return true for unknown menu items (default collapsed)', () => {
      expect(store.isMenuItemCollapsed('UnknownMenu')).toBe(true);
    });

    it('should return correct state for known menu items', () => {
      store.setMenuItemCollapsed('Funds', false);
      store.setMenuItemCollapsed('Portfolio', true);

      expect(store.isMenuItemCollapsed('Funds')).toBe(false);
      expect(store.isMenuItemCollapsed('Portfolio')).toBe(true);
    });
  });

  describe('Toggle Sidenav', () => {
    it('should toggle sidenav from expanded (false) to collapsed (true)', () => {
      store.toggleSidenav();

      expect(store.isSidenavCollapsed()).toBe(true);
      expect(sessionStorage.setItem).toHaveBeenCalled();
    });

    it('should toggle sidenav from collapsed to expanded', () => {
      store.toggleSidenav(); // true
      store.toggleSidenav(); // false

      expect(store.isSidenavCollapsed()).toBe(false);
    });

    it('should save state after toggle', () => {
      store.toggleSidenav();

      const savedState = JSON.parse(storage['sidenav-state']);
      expect(savedState.isSidenavCollapsed).toBe(true);
    });
  });

  describe('Set Sidenav Collapsed', () => {
    it('should set sidenav collapsed state explicitly', () => {
      store.setSidenavCollapsed(true);

      expect(store.isSidenavCollapsed()).toBe(true);
    });

    it('should set sidenav expanded state explicitly', () => {
      store.setSidenavCollapsed(false);

      expect(store.isSidenavCollapsed()).toBe(false);
    });

    it('should save state after explicit set', () => {
      store.setSidenavCollapsed(true);

      const savedState = JSON.parse(storage['sidenav-state']);
      expect(savedState.isSidenavCollapsed).toBe(true);
    });
  });

  describe('Initialize Menu Items', () => {
    it('should initialize new menu items with collapsed state', () => {
      store.initializeMenuItems(['Funds', 'Portfolio', 'Admin']);

      expect(store.menuItemsCollapsedState()).toEqual({
        Funds: true,
        Portfolio: true,
        Admin: true,
      });
    });

    it('should not overwrite existing menu item states', () => {
      store.setMenuItemCollapsed('Funds', false);
      store.initializeMenuItems(['Funds', 'Portfolio']);

      expect(store.menuItemsCollapsedState()).toEqual({
        Funds: false, // Preserved
        Portfolio: true, // New
      });
    });

    it('should only save if changes were made', () => {
      store.initializeMenuItems(['Funds']);
      const savedStateAfterFirst = storage['sidenav-state'];

      // Call again with same items - no changes
      store.initializeMenuItems(['Funds']);
      const savedStateAfterSecond = storage['sidenav-state'];

      // Storage should not have changed
      expect(savedStateAfterSecond).toBe(savedStateAfterFirst);
    });

    it('should handle empty menu labels array', () => {
      store.initializeMenuItems([]);

      expect(store.menuItemsCollapsedState()).toEqual({});
    });
  });

  describe('SessionStorage Error Handling', () => {
    it('should handle sessionStorage.setItem quota exceeded error', () => {
      vi.spyOn(sessionStorage, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });

      expect(() => store.toggleMenuItem('Funds')).not.toThrow();
      expect(loggerService.warn).toHaveBeenCalledWith(
        'Failed to save sidenav state to sessionStorage',
        expect.any(Error),
        'sidenav-state'
      );
    });

    it('should handle sessionStorage.getItem error on init', () => {
      vi.spyOn(sessionStorage, 'getItem').mockImplementation(() => {
        throw new Error('StorageAccessError');
      });

      const newStore = TestBed.runInInjectionContext(() => new SidenavStore());

      expect(newStore.menuItemsCollapsedState()).toEqual({});
      expect(newStore.isSidenavCollapsed()).toBe(false);
      expect(loggerService.warn).toHaveBeenCalled();
    });
  });

  describe('State Persistence Integration', () => {
    it('should persist complete state across multiple operations', () => {
      store.toggleMenuItem('Funds');
      store.toggleMenuItem('Portfolio');
      store.setSidenavCollapsed(true);
      store.setMenuItemCollapsed('Admin', false);

      const savedState = JSON.parse(storage['sidenav-state']);
      expect(savedState).toEqual({
        menuItemsCollapsedState: {
          Funds: false,
          Portfolio: false,
          Admin: false,
        },
        isSidenavCollapsed: true,
      });
    });

    it('should restore complete state on new store instance', () => {
      const originalState = {
        menuItemsCollapsedState: {Funds: false, Portfolio: true, Admin: false},
        isSidenavCollapsed: true,
      };
      storage['sidenav-state'] = JSON.stringify(originalState);

      const newStore = TestBed.runInInjectionContext(() => new SidenavStore());

      expect(newStore.menuItemsCollapsedState()).toEqual(originalState.menuItemsCollapsedState);
      expect(newStore.isSidenavCollapsed()).toBe(originalState.isSidenavCollapsed);
    });
  });
});
