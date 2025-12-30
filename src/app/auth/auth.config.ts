import { PassedInitialConfig } from 'angular-auth-oidc-client';

export const authConfig: PassedInitialConfig = {
  config: {
    authority: 'https://dev-7yj4txd3qg4xsckj.us.auth0.com',
    redirectUrl: window.location.origin,
    postLogoutRedirectUri: window.location.origin + '/login',
    clientId: 'PDPnT19fdBAv5VLjg3OR4U6N5wqkGohT',
    scope: 'openid profile email offline_access',
    responseType: 'code',
    silentRenew: true,
    useRefreshToken: true,
    secureRoutes: ['/api'],
    customParamsAuthRequest: {
      audience: 'https://core-ledger-api'
    }
  },
}
