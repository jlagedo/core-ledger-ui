import {ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners,} from '@angular/core';
import {provideRouter} from '@angular/router';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {authInterceptor, OidcSecurityService, provideAuth} from 'angular-auth-oidc-client';
import {firstValueFrom} from 'rxjs';
import {provideMicroSentry} from '@micro-sentry/angular';

import {routes} from './app.routes';
import {authConfig} from './auth/auth.config';
import {environment} from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor()])),
    provideAuth(authConfig),
    provideAppInitializer(() => {
      const oidcSecurityService = inject(OidcSecurityService);
      return firstValueFrom(oidcSecurityService.checkAuth());
    }),
    // Configure Sentry from environment
    provideMicroSentry({
      dsn: environment.sentry.dsn,
      environment: environment.sentry.environment,
      release: environment.sentry.release,
    })
  ],
};
