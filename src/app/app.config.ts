import {ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners,} from '@angular/core';
import {provideRouter} from '@angular/router';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {authInterceptor, OidcSecurityService, provideAuth} from 'angular-auth-oidc-client';
import {firstValueFrom} from 'rxjs';
import {provideMicroSentry} from '@micro-sentry/angular';

import {routes} from './app.routes';
import {authConfig} from './auth/auth.config';
import {environment} from '../environments/environment';
import {mockAuthInterceptor} from './auth/mock-auth.interceptor';
import {MockAuthService} from './auth/mock-auth.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    // Conditional HTTP interceptor based on mock auth flag
    provideHttpClient(
      withInterceptors([
        environment.auth.useMock ? mockAuthInterceptor : authInterceptor()
      ])
    ),
    // Conditionally provide MockAuthService only when useMock is true
    ...(environment.auth.useMock ? [MockAuthService] : []),
    // Always provide OIDC (needed for types even in mock mode)
    provideAuth(authConfig),
    // Conditional auth initializer
    provideAppInitializer(() => {
      if (environment.auth.useMock) {
        const mockAuthService = inject(MockAuthService);
        return firstValueFrom(mockAuthService.checkAuth());
      } else {
        const oidcSecurityService = inject(OidcSecurityService);
        return firstValueFrom(oidcSecurityService.checkAuth());
      }
    }),
    // Configure Sentry from environment
    provideMicroSentry({
      dsn: environment.sentry.dsn,
      environment: environment.sentry.environment,
      release: environment.sentry.release,
    })
  ],
};
