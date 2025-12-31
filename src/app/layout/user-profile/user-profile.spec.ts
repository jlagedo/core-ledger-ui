import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserProfile } from './user-profile';
import { ThemeService } from '../../services/theme-service';
import { provideTestDependencies } from '../../testing/test-helpers';

describe('UserProfile', () => {
  let component: UserProfile;
  let fixture: ComponentFixture<UserProfile>;
  let themeService: ThemeService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserProfile],
      providers: provideTestDependencies(),
    }).compileComponents();

    fixture = TestBed.createComponent(UserProfile);
    component = fixture.componentInstance;
    themeService = TestBed.inject(ThemeService);

    // Set required input
    fixture.componentRef.setInput('isCollapsed', false);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('profile icon', () => {
    it('should always display profile icon', () => {
      const profileButton = fixture.nativeElement.querySelector('button[aria-label="User profile"]');
      expect(profileButton).toBeTruthy();
      expect(profileButton.querySelector('.bi-person-circle')).toBeTruthy();
    });

    it('should have proper ARIA label on profile button', () => {
      const profileButton = fixture.nativeElement.querySelector('button[aria-label="User profile"]');
      expect(profileButton.getAttribute('aria-label')).toBe('User profile');
    });
  });

  describe('theme toggle visibility', () => {
    it('should display theme toggle when not collapsed', () => {
      fixture.componentRef.setInput('isCollapsed', false);
      fixture.detectChanges();

      const themeToggle = fixture.nativeElement.querySelector('[aria-label*="Switch to"]');
      expect(themeToggle).toBeTruthy();
    });

    it('should hide theme toggle when collapsed', () => {
      fixture.componentRef.setInput('isCollapsed', true);
      fixture.detectChanges();

      const themeToggle = fixture.nativeElement.querySelector('[aria-label*="Switch to"]');
      expect(themeToggle).toBeFalsy();
    });
  });

  describe('theme toggle functionality', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('isCollapsed', false);
      fixture.detectChanges();
    });

    it('should display sun icon in dark mode', () => {
      themeService.setTheme('dark');
      fixture.detectChanges();

      const themeIcon = fixture.nativeElement.querySelector('.bi-sun-fill');
      expect(themeIcon).toBeTruthy();
    });

    it('should display moon icon in light mode', () => {
      themeService.setTheme('light');
      fixture.detectChanges();

      const themeIcon = fixture.nativeElement.querySelector('.bi-moon-fill');
      expect(themeIcon).toBeTruthy();
    });

    it('should have proper ARIA label in dark mode', () => {
      themeService.setTheme('dark');
      fixture.detectChanges();

      const buttons = fixture.nativeElement.querySelectorAll('button');
      const themeButton = Array.from<Element>(buttons).find((btn) =>
        btn.getAttribute('aria-label')?.includes('light mode')
      ) as HTMLButtonElement;
      expect(themeButton).toBeTruthy();
      expect(themeButton.getAttribute('aria-label')).toBe('Switch to light mode');
    });

    it('should have proper ARIA label in light mode', () => {
      themeService.setTheme('light');
      fixture.detectChanges();

      const buttons = fixture.nativeElement.querySelectorAll('button');
      const themeButton = Array.from<Element>(buttons).find((btn) =>
        btn.getAttribute('aria-label')?.includes('dark mode')
      ) as HTMLButtonElement;
      expect(themeButton).toBeTruthy();
      expect(themeButton.getAttribute('aria-label')).toBe('Switch to dark mode');
    });

    it('should toggle theme when theme button is clicked', () => {
      themeService.setTheme('dark');
      fixture.detectChanges();

      const toggleSpy = vi.spyOn(themeService, 'toggleTheme');
      const themeButton = fixture.nativeElement.querySelector('[aria-label*="Switch to"]');

      themeButton.click();
      expect(toggleSpy).toHaveBeenCalled();
    });
  });

  describe('layout', () => {
    it('should center content when collapsed', () => {
      fixture.componentRef.setInput('isCollapsed', true);
      fixture.detectChanges();

      const container = fixture.nativeElement.querySelector('.d-flex');
      expect(container.classList.contains('justify-content-center')).toBe(true);
      expect(container.classList.contains('justify-content-between')).toBe(false);
    });

    it('should space content between when expanded', () => {
      fixture.componentRef.setInput('isCollapsed', false);
      fixture.detectChanges();

      const container = fixture.nativeElement.querySelector('.d-flex');
      expect(container.classList.contains('justify-content-between')).toBe(true);
      expect(container.classList.contains('justify-content-center')).toBe(false);
    });
  });
});
