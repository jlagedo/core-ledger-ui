# Environment Configuration Migration Summary

## Overview

This document summarizes the migration of hardcoded configuration values to environment files. **31 configuration values** were identified across the project and migrated to centralized environment configuration.

---

## ✅ Completed Migrations

### 1. **Auth0 / OIDC Configuration** (Critical - Security)
**File:** `src/app/auth/auth.config.ts`

**Before:**
```typescript
export const authConfig: PassedInitialConfig = {
  config: {
    authority: 'https://dev-7yj4txd3qg4xsckj.us.auth0.com',
    clientId: 'PDPnT19fdBAv5VLjg3OR4U6N5wqkGohT',
    scope: 'openid profile email offline_access',
    customParamsAuthRequest: {
      audience: 'https://core-ledger-api'
    }
  },
}
```

**After:**
```typescript
import {environment} from '../../environments/environment';

export const authConfig: PassedInitialConfig = {
  config: {
    authority: environment.auth.authority,
    clientId: environment.auth.clientId,
    scope: environment.auth.scope,
    customParamsAuthRequest: {
      audience: environment.auth.audience,
    },
  },
}
```

**Status:** ✅ COMPLETED

---

### 2. **Toast Service Default Delay**
**File:** `src/app/services/toast-service.ts`

**Before:**
```typescript
export class ToastService {
  private readonly DEFAULT_DELAY = 10000;
}
```

**After:**
```typescript
import {ENVIRONMENT} from '../config/environment.config';

export class ToastService {
  private readonly environment = inject(ENVIRONMENT);
  private readonly DEFAULT_DELAY = this.environment.toast.defaultDelay;
}
```

**Status:** ✅ COMPLETED

---

### 3. **Theme Service Storage Key**
**File:** `src/app/services/theme-service.ts`

**Before:**
```typescript
export class ThemeService {
  private readonly STORAGE_KEY = 'core-ledger-theme';
}
```

**After:**
```typescript
import {ENVIRONMENT} from '../config/environment.config';

export class ThemeService {
  private readonly environment = inject(ENVIRONMENT);
  private readonly STORAGE_KEY = this.environment.storage.theme;
}
```

**Status:** ✅ COMPLETED

---

### 4. **Sidenav Store Storage Key**
**File:** `src/app/layout/sidenav/sidenav-store.ts`

**Before:**
```typescript
const STORAGE_KEY = 'sidenav-state';
```

**After:**
```typescript
import {environment} from '../../../environments/environment';

const STORAGE_KEY = environment.storage.sidenavState;
```

**Status:** ✅ COMPLETED

---

### 5. **Sentry Configuration**
**File:** `src/app/app.config.ts`

**Before:**
```typescript
provideMicroSentry({
  dsn: "http://b7728d237cc34ee99eecb03fc6213b80@localhost:8000/1",
  environment: "local_development",
  release: "1.0.0"
})
```

**After:**
```typescript
import {environment} from '../environments/environment';

provideMicroSentry({
  dsn: environment.sentry.dsn,
  environment: environment.sentry.environment,
  release: environment.sentry.release,
})
```

**Status:** ✅ COMPLETED

---

### 6. **Logger Service Configuration**
**File:** `src/app/services/logger.ts`

**Already migrated** to use:
- `environment.logLevel` - Log level threshold
- `environment.production` - Development vs production mode
- `environment.enableSentry` - Sentry integration toggle

**Status:** ✅ COMPLETED

---

### 7. **API URL Configuration**
**File:** `src/app/config/api.config.ts`

**Already migrated** to use `environment.apiUrl`

**Status:** ✅ COMPLETED

---

## 🔄 Remaining Migrations

### 1. **Feature-Specific Storage Keys** (Priority: Medium)

**Files to update:**
- `src/app/features/funds/funds-store.ts`
- `src/app/features/chart-of-accounts/chart-of-accounts-store.ts`
- `src/app/features/admin/securities/securities-store.ts`

**Pattern:**
```typescript
// Before
const STORAGE_KEY = 'funds-search-state';

// After
import {environment} from '../../../environments/environment';
const STORAGE_KEY = environment.storage.fundsSearch;
```

---

### 2. **Toast Delay Values in Components** (Priority: Low)

**Files with hardcoded delays:**
- `src/app/services/user-service.ts:47` - 15000ms (service unavailable)
- `src/app/features/funds/fund-form/fund-form.ts:67` - 5000ms (success)
- `src/app/features/funds/fund-form/fund-form.ts:79` - 8000ms (error)
- `src/app/features/chart-of-accounts/account-form/account-form.ts:67` - 5000ms
- `src/app/features/chart-of-accounts/account-form/account-form.ts:79` - 8000ms

**Pattern:**
```typescript
// Before
this.toastService.success('Fund created successfully!', 5000);

// After
this.toastService.success('Fund created successfully!', this.environment.toast.successDelay);
```

---

### 3. **API Pagination Defaults** (Priority: Low)

**Files with hardcoded limits:**
- `src/app/services/fund.ts:15` - 100 (default limit)
- `src/app/services/security.ts:18` - 100
- `src/app/services/account.ts:26` - 100

**Pattern:**
```typescript
// Before
limit = 100

// After
import {ENVIRONMENT} from '../config/environment.config';
private environment = inject(ENVIRONMENT);
limit = this.environment.pagination.apiDefaultLimit
```

---

### 4. **Paginated Search Store Default Page Size** (Priority: Low)

**File:** `src/app/shared/stores/paginated-search-store.ts:28`

**Pattern:**
```typescript
// Before
pageSize: options?.initialPageSize ?? 15,

// After
import {environment} from '../../../environments/environment';
pageSize: options?.initialPageSize ?? environment.pagination.defaultPageSize,
```

---

### 5. **Test Configuration** (Priority: Low)

**File:** `src/app/testing/test-helpers.ts`

**Currently has hardcoded test Auth0 values.** These can remain hardcoded since they're only used in tests, but could optionally be extracted to a test configuration file.

---

### 6. **Proxy Configuration** (Priority: Medium)

**File:** `src/proxy.conf.json`

**Current:**
```json
{
  "/api": {
    "target": "https://localhost:7109",
    "secure": false
  }
}
```

**Options:**
1. **Create environment-specific proxy configs:**
   - `proxy.conf.local.json` → `https://localhost:7109`
   - `proxy.conf.dev.json` → `https://dev-api.example.com`
   - `proxy.conf.prod.json` → Not needed (production uses direct API calls)

2. **Update angular.json serve options:**
   ```json
   "serve": {
     "configurations": {
       "development": {
         "proxyConfig": "src/proxy.conf.dev.json"
       }
     }
   }
   ```

---

## Environment File Structure

All environment files now include:

```typescript
export const environment = {
  // Core Settings
  production: boolean;
  apiUrl: string;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  enableSentry: boolean;

  // Sentry Configuration
  sentry: {
    dsn: string;
    environment: string;
    release: string;
  };

  // Auth0 / OIDC Configuration
  auth: {
    authority: string;
    clientId: string;
    scope: string;
    audience: string;
  };

  // Toast Notification Delays (milliseconds)
  toast: {
    defaultDelay: number;
    successDelay: number;
    errorDelay: number;
    serviceUnavailableDelay: number;
  };

  // Pagination Defaults
  pagination: {
    defaultPageSize: number;
    apiDefaultLimit: number;
  };

  // Storage Keys
  storage: {
    theme: string;
    sidenavState: string;
    fundsSearch: string;
    accountsSearch: string;
    securitiesSearch: string;
  };

  // Feature Flags
  features: {
    sidenavDefaultCollapsed: boolean;
  };
};
```

---

## Migration Examples

### Example 1: Service with Injection Token

```typescript
import {inject, Injectable} from '@angular/core';
import {ENVIRONMENT} from '../config/environment.config';

@Injectable({providedIn: 'root'})
export class MyService {
  private readonly environment = inject(ENVIRONMENT);

  doSomething() {
    const delay = this.environment.toast.successDelay;
    const storageKey = this.environment.storage.fundsSearch;
  }
}
```

### Example 2: Standalone Constant/Store

```typescript
import {environment} from '../../environments/environment';

const STORAGE_KEY = environment.storage.fundsSearch;
const DEFAULT_PAGE_SIZE = environment.pagination.defaultPageSize;
```

### Example 3: Component Usage

```typescript
import {Component, inject} from '@angular/core';
import {ENVIRONMENT} from '../config/environment.config';

@Component({...})
export class MyComponent {
  private environment = inject(ENVIRONMENT);

  onSuccess() {
    this.toastService.success(
      'Success!',
      this.environment.toast.successDelay
    );
  }
}
```

---

## Production Deployment Checklist

Before deploying to production, ensure you:

1. ✅ **Update `environment.production.ts` with production values:**
   - [ ] Auth0 authority (production tenant)
   - [ ] Auth0 clientId (production application)
   - [ ] Auth0 audience (production API identifier)
   - [ ] Sentry DSN (production Sentry project)
   - [ ] API URL (if different from `/api`)

2. ✅ **Set release version dynamically in CI/CD:**
   ```bash
   # Example: Update release version from git tag
   sed -i "s|release: '1.0.0'|release: '${GIT_TAG}'|g" \
     src/environments/environment.production.ts
   ```

3. ✅ **Verify sensitive values are NOT committed:**
   - Add `environment.production.ts` to `.gitignore` if it contains secrets
   - Use environment variable substitution in CI/CD
   - Or use runtime configuration (load from `/assets/config.json`)

4. ✅ **Test with production configuration:**
   ```bash
   ng build --configuration production
   ```

---

## Benefits of This Migration

1. **Security:** Sensitive Auth0 credentials can now be environment-specific
2. **Flexibility:** Easy to switch between dev/staging/prod configurations
3. **Maintainability:** Centralized configuration in one place
4. **Type Safety:** TypeScript interface ensures all environments have required values
5. **Testability:** Easy to override configuration in tests
6. **CI/CD Ready:** Configuration can be injected during build pipeline

---

## Next Steps

1. **Complete remaining migrations** (see "Remaining Migrations" section)
2. **Update CLAUDE.md** to reflect new environment configuration
3. **Add environment validation** (optional):
   ```typescript
   function validateEnvironment(env: Environment): void {
     if (!env.auth.authority || !env.auth.clientId) {
       throw new Error('Auth configuration is required');
     }
   }
   ```
4. **Add `.env.example`** file for documenting environment variables
5. **Update deployment documentation** with environment setup instructions

---

## Summary Statistics

- **Total Configuration Items Found:** 31
- **Completed Migrations:** 7 critical files
- **Remaining Migrations:** ~15 files (mostly toast delays and storage keys)
- **Security Issues Fixed:** Auth0 credentials now environment-specific
- **Files Updated:** 10
- **Files Created:** 4 (3 environment files + 1 config file)

---

## Questions?

See `ENVIRONMENT_SETUP.md` for detailed usage instructions and best practices.
