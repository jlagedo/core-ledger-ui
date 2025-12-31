import { TestBed } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';
import { ThemeService } from './theme-service';

describe('ThemeService', () => {
  let service: ThemeService;
  let document: Document;
  let localStorageMock: { [key: string]: string };

  beforeEach(() => {
    // Mock localStorage
    localStorageMock = {};
    const localStorageGetItemSpy = vi.spyOn(Storage.prototype, 'getItem')
      .mockImplementation((key: string) => localStorageMock[key] || null);
    const localStorageSetItemSpy = vi.spyOn(Storage.prototype, 'setItem')
      .mockImplementation((key: string, value: string) => {
        localStorageMock[key] = value;
      });

    TestBed.configureTestingModule({});
    document = TestBed.inject(DOCUMENT);
    service = TestBed.inject(ThemeService);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initialization', () => {
    it('should initialize with dark theme by default', () => {
      expect(service.currentTheme()).toBe('dark');
      expect(service.isDarkMode()).toBe(true);
    });

    it('should initialize with dark theme and set data-bs-theme attribute', () => {
      expect(document.documentElement.getAttribute('data-bs-theme')).toBe('dark');
    });

    it('should load theme from localStorage if present', () => {
      // Destroy existing TestBed and create new one with light theme in storage
      TestBed.resetTestingModule();
      localStorageMock['core-ledger-theme'] = 'light';

      TestBed.configureTestingModule({});
      const newService = TestBed.inject(ThemeService);
      expect(newService.currentTheme()).toBe('light');
    });

    it('should fallback to dark theme if localStorage has invalid value', () => {
      // Destroy existing TestBed and create new one with invalid theme
      TestBed.resetTestingModule();
      localStorageMock['core-ledger-theme'] = 'invalid';

      TestBed.configureTestingModule({});
      const newService = TestBed.inject(ThemeService);
      expect(newService.currentTheme()).toBe('dark');
    });

    it('should handle localStorage read errors gracefully', () => {
      // Destroy existing TestBed
      TestBed.resetTestingModule();

      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('localStorage not available');
      });
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      TestBed.configureTestingModule({});
      const newService = TestBed.inject(ThemeService);
      expect(newService.currentTheme()).toBe('dark');
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to read theme from localStorage:',
        expect.any(Error)
      );
    });
  });

  describe('setTheme', () => {
    it('should update theme to light', () => {
      service.setTheme('light');
      expect(service.currentTheme()).toBe('light');
      expect(service.isDarkMode()).toBe(false);
    });

    it('should update data-bs-theme attribute on document', () => {
      service.setTheme('light');
      expect(document.documentElement.getAttribute('data-bs-theme')).toBe('light');
    });

    it('should persist theme to localStorage', () => {
      service.setTheme('light');
      expect(localStorageMock['core-ledger-theme']).toBe('light');
    });

    it('should handle localStorage write errors gracefully', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('localStorage quota exceeded');
      });
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      service.setTheme('light');
      expect(service.currentTheme()).toBe('light'); // Theme still changes
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to persist theme to localStorage:',
        expect.any(Error)
      );
    });
  });

  describe('toggleTheme', () => {
    it('should toggle from dark to light', () => {
      expect(service.currentTheme()).toBe('dark');
      service.toggleTheme();
      expect(service.currentTheme()).toBe('light');
    });

    it('should toggle from light to dark', () => {
      service.setTheme('light');
      service.toggleTheme();
      expect(service.currentTheme()).toBe('dark');
    });

    it('should update DOM attribute when toggling', () => {
      service.toggleTheme();
      expect(document.documentElement.getAttribute('data-bs-theme')).toBe('light');
      service.toggleTheme();
      expect(document.documentElement.getAttribute('data-bs-theme')).toBe('dark');
    });

    it('should persist toggled theme to localStorage', () => {
      service.toggleTheme();
      expect(localStorageMock['core-ledger-theme']).toBe('light');
    });
  });

  describe('computed signals', () => {
    it('should update isDarkMode computed signal when theme changes', () => {
      expect(service.isDarkMode()).toBe(true);
      service.setTheme('light');
      expect(service.isDarkMode()).toBe(false);
      service.setTheme('dark');
      expect(service.isDarkMode()).toBe(true);
    });
  });
});
