# Environment Configuration Guide

This guide explains how to use environment files in this Angular 21 application.

## File Structure

```
src/
├── environments/
│   ├── environment.ts              # Default/local development
│   ├── environment.development.ts  # Development environment
│   └── environment.production.ts   # Production environment
└── app/
    └── config/
        └── environment.config.ts   # Environment injection token
```

## Environment Files

### environment.ts (Default/Local)
Used when running `ng serve` without a configuration flag.

### environment.development.ts
Used when building with `--configuration development`.

### environment.production.ts
Used when building with `--configuration production` (default for builds).

## Configuration in angular.json

File replacements are configured in `angular.json`:

```json
"configurations": {
  "production": {
    "fileReplacements": [
      {
        "replace": "src/environments/environment.ts",
        "with": "src/environments/environment.production.ts"
      }
    ]
  },
  "development": {
    "fileReplacements": [
      {
        "replace": "src/environments/environment.ts",
        "with": "src/environments/environment.development.ts"
      }
    ]
  }
}
```

## How to Use Environment Variables

### 1. Direct Import (Simple)

```typescript
import {environment} from '../environments/environment';

@Component({...})
export class MyComponent {
  apiUrl = environment.apiUrl;
}
```

### 2. Injection Token (Recommended for Services)

```typescript
import {inject} from '@angular/core';
import {ENVIRONMENT} from '../config/environment.config';

@Injectable({providedIn: 'root'})
export class MyService {
  private env = inject(ENVIRONMENT);

  doSomething() {
    if (this.env.production) {
      // Production logic
    }
  }
}
```

### 3. In Providers (app.config.ts)

```typescript
import {environment} from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideMicroSentry({
      dsn: environment.sentry.dsn,
      environment: environment.sentry.environment,
      release: environment.sentry.release,
    })
  ],
};
```

## Running with Different Environments

### Development (local - no Sentry)
```bash
ng serve
# Uses: environment.ts
```

### Development (with Sentry)
```bash
ng serve --configuration development
# Uses: environment.development.ts
```

### Production Build
```bash
ng build --configuration production
# or simply
ng build
# Uses: environment.production.ts
```

### Development Build
```bash
ng build --configuration development
# Uses: environment.development.ts
```

## Environment Schema

```typescript
interface Environment {
  production: boolean;           // Is production environment?
  apiUrl: string;               // API base URL
  logLevel: LogLevel;           // Logging level (debug, info, warn, error)
  enableSentry: boolean;        // Enable/disable Sentry error tracking
  sentry: {
    dsn: string;                // Sentry Data Source Name
    environment: string;        // Environment name for Sentry
    release: string;            // Release version
  };
  auth?: {
    // Auth0 or other auth configuration
  };
}
```

## Examples

### LoggerService
The `LoggerService` uses environment configuration for:
- `logLevel`: Determines which logs to show
- `production`: Enables/disables console logging
- `enableSentry`: Controls whether errors are sent to Sentry

```typescript
@Injectable({providedIn: 'root'})
export class LoggerService {
  private env = inject(ENVIRONMENT);

  private readonly logLevel = this.env.logLevel;
  private readonly isDevelopment = !this.env.production;
  private readonly enableSentry = this.env.enableSentry;
}
```

### API Configuration
The `API_URL` token uses environment for the base API URL:

```typescript
export const API_URL = new InjectionToken<string>('API_URL', {
  providedIn: 'root',
  factory: () => environment.apiUrl,
});
```

## Best Practices

1. **Never commit secrets**: Use environment variables or secrets management for sensitive data
2. **Keep structure consistent**: All environment files should have the same structure
3. **Use TypeScript types**: Define an interface for your environment configuration
4. **Default to safe values**: Local environment should be the safest (e.g., Sentry disabled)
5. **Document required values**: Comment what each configuration value does

## CI/CD Integration

For production deployments, you can:

1. **Replace environment.production.ts** during build:
   ```bash
   # In your CI/CD pipeline
   echo "export const environment = {...}" > src/environments/environment.production.ts
   ng build --configuration production
   ```

2. **Use environment variables** (recommended):
   - Keep placeholders in environment.production.ts
   - Replace at build time using your CI/CD tool
   - Example: `sed -i "s|SENTRY_DSN|${SENTRY_DSN}|g" src/environments/environment.production.ts`

3. **Runtime configuration** (advanced):
   - Load configuration from a JSON file at app startup
   - See: https://angular.dev/guide/standalone-components#configuring-dependency-injection

## Testing

Tests should provide mock environment values:

```typescript
TestBed.configureTestingModule({
  providers: [
    {
      provide: ENVIRONMENT,
      useValue: {
        production: false,
        apiUrl: '/api',
        logLevel: 'debug',
        enableSentry: false,
        sentry: {dsn: '', environment: 'test', release: '1.0.0'},
      }
    }
  ]
});
```

## Troubleshooting

### Build fails with "Cannot find module '../environments/environment'"
- Make sure all three environment files exist
- Check that imports use the correct relative path

### Changes to environment not reflected
- Stop and restart `ng serve`
- Clear `dist/` folder and rebuild
- Make sure you're running with the correct `--configuration` flag

### Different environments using same config
- Verify `fileReplacements` in `angular.json`
- Check that the replacement paths are correct
- Ensure the file you're importing is `environment.ts` (not a specific variant)
