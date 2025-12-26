import { Component, inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { CommonModule } from '@angular/common';
import { LoginButtonComponent } from './login-button.component';
import { LogoutButtonComponent } from './logout-button.component';
import { ProfileComponent } from './profile.component';

@Component({
    selector: 'app-auth0-demo',
    standalone: true,
    imports: [CommonModule, LoginButtonComponent, LogoutButtonComponent, ProfileComponent],
    template: `
    <div class="app-container">
      @if (auth.isLoading$ | async) {
        <div class="loading-state">
          <div class="loading-text">Loading...</div>
        </div>
      }

      @if (auth.error$ | async; as error) {
        <div class="error-state">
          <div class="error-title">Oops!</div>
          <div class="error-message">Something went wrong</div>
          <div class="error-sub-message">{{ error.message }}</div>
        </div>
      }

      @if (!(auth.isLoading$ | async) && !(auth.error$ | async)) {
        <div class="main-card-wrapper">
          <img 
            src="https://cdn.auth0.com/quantum-assets/dist/latest/logos/auth0/auth0-lockup-en-ondark.png" 
            alt="Auth0 Logo" 
            class="auth0-logo"
          />
          <h1 class="main-title">Welcome to Sample0</h1>
          
          @if (auth.isAuthenticated$ | async) {
            <div class="logged-in-section">
              <div class="logged-in-message">✅ Successfully authenticated!</div>
              <h2 class="profile-section-title">Your Profile</h2>
              <div class="profile-card">
                <app-profile />
              </div>
              <app-logout-button />
            </div>
          } @else {
            <div class="action-card">
              <p class="action-text">Get started by signing in to your account</p>
              <app-login-button />
            </div>
          }
        </div>
      }
    </div>
  `,
    styles: []
})
export class Auth0DemoComponent {
    protected auth = inject(AuthService);
}
