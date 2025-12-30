import { Injectable, inject, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { OidcSecurityService } from 'angular-auth-oidc-client';

export interface UserProfile {
  name: string;
  email: string;
  picture: string;
  sub: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly oidcSecurityService = inject(OidcSecurityService);

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

  login(): void {
    this.oidcSecurityService.authorize();
  }

  logout(): void {
    this.oidcSecurityService.logoff().subscribe();
  }
}
