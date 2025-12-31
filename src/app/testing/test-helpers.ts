import { EnvironmentProviders, Provider } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideAuth } from 'angular-auth-oidc-client';
import { provideRouter } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';

/**
 * Provides common test providers including router, HTTP client, and OIDC authentication
 * with test configuration. Use this in test files to avoid duplication.
 */
export function provideTestDependencies(): (Provider | EnvironmentProviders)[] {
  return [
    provideRouter([]),
    provideLocationMocks(),
    provideHttpClient(),
    provideAuth({
      config: {
        authority: 'https://test.auth.com',
        redirectUrl: window.location.origin,
        postLogoutRedirectUri: window.location.origin,
        clientId: 'test-client-id',
        scope: 'openid profile email',
        responseType: 'code',
        silentRenew: true,
        useRefreshToken: true,
      },
    }),
  ];
}
