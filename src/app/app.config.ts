import {ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners,} from '@angular/core';
import {provideRouter} from '@angular/router';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {authInterceptor, OidcSecurityService, provideAuth} from 'angular-auth-oidc-client';
import {firstValueFrom} from 'rxjs';
import {provideMicroSentry} from '@micro-sentry/angular';

import {routes} from './app.routes';
import {authConfig} from './auth/auth.config';

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
    provideMicroSentry({
      dsn: "http://b7728d237cc34ee99eecb03fc6213b80@localhost:8000/1",
      environment: "local_development",
      release: "1.0.0"
    })
  ],
};
