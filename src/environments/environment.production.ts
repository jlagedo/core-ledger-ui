// Production environment configuration
export const environment = {
  production: true,
  apiUrl: '/api', // This would be your production API URL
  logLevel: 'warn' as const,
  enableSentry: true,

  // Sentry Configuration
  sentry: {
    dsn: '', // TODO: Add your production Sentry DSN here
    environment: 'production',
    release: '1.0.0', // TODO: This should be updated from your CI/CD pipeline
  },

  // Auth0 / OIDC Configuration
  auth: {
    authority: '', // TODO: Production Auth0 authority URL
    clientId: '', // TODO: Production Auth0 client ID
    scope: 'openid profile email offline_access',
    audience: 'https://core-ledger-api', // TODO: Production API audience
  },

  // Toast Notification Delays (milliseconds)
  toast: {
    defaultDelay: 8000, // Shorter in production
    successDelay: 4000,
    errorDelay: 10000, // Longer for errors in production
    serviceUnavailableDelay: 15000,
  },

  // Pagination Defaults
  pagination: {
    defaultPageSize: 15,
    apiDefaultLimit: 100,
  },

  // Storage Keys (same as dev to maintain user preferences)
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
