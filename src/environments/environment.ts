// Local development environment configuration
export const environment = {
  production: false,
  apiUrl: '/api',
  logLevel: 'debug' as const,
  enableSentry: false, // Disable Sentry in local development

  // Sentry Configuration
  sentry: {
    dsn: 'http://b7728d237cc34ee99eecb03fc6213b80@localhost:8000/1',
    environment: 'local_development',
    release: '1.0.0',
  },

  // Auth0 / OIDC Configuration
  auth: {
    authority: 'https://dev-7yj4txd3qg4xsckj.us.auth0.com',
    clientId: 'PDPnT19fdBAv5VLjg3OR4U6N5wqkGohT',
    scope: 'openid profile email offline_access',
    audience: 'https://core-ledger-api',
  },

  // Toast Notification Delays (milliseconds)
  toast: {
    defaultDelay: 10000,
    successDelay: 5000,
    errorDelay: 8000,
    serviceUnavailableDelay: 15000,
  },

  // Pagination Defaults
  pagination: {
    defaultPageSize: 15,
    apiDefaultLimit: 100,
  },

  // Storage Keys
  storage: {
    theme: 'core-ledger-theme',
    sidenavState: 'sidenav-state',
    fundsSearch: 'funds-search-state',
    accountsSearch: 'chart-of-accounts-search-state',
    securitiesSearch: 'securities-search-state',
  },

  // Feature Flags
  features: {
    sidenavDefaultCollapsed: true,
  },
};
