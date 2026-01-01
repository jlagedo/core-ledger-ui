---
applyTo: "src/environments/**/*.ts"
---

# Environment Configuration Instructions

## Environment Structure

Environment files define configuration per deployment target. Each environment file exports an `environment` object with consistent structure:

```typescript
export const environment = {
  production: boolean,
  apiUrl: string,
  logLevel: 'debug' | 'info' | 'warn' | 'error',
  enableSentry: boolean,
  sentry: { dsn, environment, release },
  auth: { useMock, mockUser, authority, clientId, scope, audience },
  toast: { defaultDelay, successDelay, errorDelay, serviceUnavailableDelay },
  pagination: { defaultPageSize, apiDefaultLimit },
  storage: { theme, sidenavState, fundsSearch, accountsSearch, securitiesSearch },
  features: { sidenavDefaultCollapsed }
}
```

## Environment Files

- `environment.local-noauth.ts` - Local dev with **mock authentication** (default)
- `environment.local-auth.ts` - Local dev with real Auth0
- `environment.development.ts` - Development server with real Auth0
- `environment.production.ts` - Production with real Auth0
- `environment.ts` - Base/fallback environment

## Authentication Configuration

### Mock Authentication (Development Only)
- Set `auth.useMock = true` to enable mock authentication
- Set `auth.mockUser` to one of: 'admin', 'fund-manager', 'trader', 'analyst'
- Mock auth is **only available in development** and will error in production

### Real Auth0
- Set `auth.useMock = false` for real Auth0
- Configure `authority`, `clientId`, `scope`, and `audience` with Auth0 credentials

## API URL Configuration

- Use `/api` as the base path (proxied to backend via `src/proxy.conf.json`)
- **Never hardcode backend URLs** in environment files
- The proxy automatically forwards `/api/**` requests to https://localhost:7109

## Accessing Environment

**DO NOT** import environment files directly in application code:
```typescript
// ❌ DON'T DO THIS
import { environment } from 'src/environments/environment';
```

**DO** use the `ENVIRONMENT` injection token:
```typescript
// ✅ DO THIS
import { inject } from '@angular/core';
import { ENVIRONMENT } from '@app/config/environment.config';

export class MyService {
  private readonly env = inject(ENVIRONMENT);
  
  get apiUrl() {
    return this.env.apiUrl;
  }
}
```

## Feature Flags

Use `environment.features` for feature toggles:
- Keep feature flags as boolean values
- Document each feature flag with a comment
- Remove feature flags when features are fully released

## Storage Keys

Define all localStorage/sessionStorage keys in `environment.storage`:
- Use descriptive kebab-case names
- Prefix with 'core-ledger-' to avoid conflicts
- Never hardcode storage keys in components/services

## Toast Configuration

Configure toast notification delays by type in `environment.toast`:
- `defaultDelay` - Default for all types (10000ms)
- `successDelay` - Success messages (5000ms)
- `errorDelay` - Error messages (8000ms)
- `serviceUnavailableDelay` - Critical errors (15000ms)

## Sentry Configuration

Configure error tracking in `environment.sentry`:
- Set appropriate `dsn` per environment
- Use `environment` field to distinguish between dev/prod
- Include `release` version for tracking

## Best Practices

- Keep all environments in sync structurally
- Only vary values, not structure
- Add comments for non-obvious settings
- Never commit secrets or production credentials
- Use environment variables for sensitive data in CI/CD
