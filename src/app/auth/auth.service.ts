import { Injectable, inject, computed, effect } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { UserService } from '../services/user.service';

export interface UserProfile {
  name: string;
  email: string;
  picture: string;
  sub: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly oidcSecurityService = inject(OidcSecurityService);
  private readonly userService = inject(UserService);

  private readonly authState = toSignal(this.oidcSecurityService.isAuthenticated$);

  private readonly userData = toSignal(this.oidcSecurityService.userData$);

  readonly isLoggedIn = computed(() => this.authState()?.isAuthenticated ?? false);

  readonly userProfile = computed<UserProfile | null>(() => {
    const data = this.userData();
    if (!data?.userData) return null;

    return {
      name: data.userData.name ?? data.userData.nickname ?? 'User',
      email: data.userData.email ?? '',
      picture: data.userData.picture ?? '',
      sub: data.userData.sub ?? '',
    };
  });

  constructor() {
    // Reactive effect: fetch user from backend when login state changes to true
    effect(() => {
      if (this.isLoggedIn()) {
        this.userService.fetchCurrentUser().subscribe({
          next: (user) => this.userService.setUser(user),
          error: () => {
            // Error already logged in UserService
            // App remains functional without database user data
          },
        });
      }
    });
  }

  login(): void {
    this.oidcSecurityService.authorize();
  }

  logout(): void {
    // Clear user data before OIDC logout
    this.userService.clearUser();
    this.oidcSecurityService.logoff().subscribe();
  }
}
