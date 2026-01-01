# Mock API System

## Overview

The Mock API system provides a complete in-memory API implementation for local development and testing. It allows developers to work without a backend server while simulating realistic API behavior including network latency, pagination, sorting, filtering, and error conditions.

## Features

- ✅ **Full CRUD Operations** - GET, POST, PUT, PATCH, DELETE
- ✅ **Pagination Support** - `limit` and `offset` query parameters
- ✅ **Sorting** - `sortBy` and `sortDirection` parameters
- ✅ **Filtering** - Case-insensitive full-text search across all fields
- ✅ **Network Latency Simulation** - Configurable delay (ms)
- ✅ **Error Simulation** - Random errors for testing error handling
- ✅ **Production Safety** - Multi-layered protection against production usage

## Architecture

### Components

1. **`MockApiInterceptor`** - HTTP interceptor that captures `/api/**` requests
2. **`MockApiService`** - In-memory CRUD service with data management
3. **Mock Data Files** - Realistic seed data for all entities
4. **Production Stub** - Safety mechanism for production builds

### Data Flow

```
HTTP Request → MockApiInterceptor → MockApiService → In-Memory Data → HTTP Response
```

## Configuration

### Environment Settings

Add `api` configuration to your environment files:

```typescript
// src/environments/environment.ts
export const environment = {
  // ... other config
  api: {
    useMock: true,          // Enable mock API
    mockDelayMs: 300,       // Simulate 300ms network latency
    mockErrorRate: 0,       // 0% error rate (0 = none, 0.1 = 10%)
  },
};
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `useMock` | boolean | `false` | Enable/disable mock API |
| `mockDelayMs` | number | `0` | Network latency simulation in milliseconds |
| `mockErrorRate` | number | `0` | Probability of random errors (0.0 to 1.0) |

### Environment-Specific Defaults

- **`environment.ts`** (local dev): `useMock: true`, `mockDelayMs: 300`
- **`environment.local-noauth.ts`**: `useMock: true`, `mockDelayMs: 300`
- **`environment.local-auth.ts`**: `useMock: false` (uses real backend)
- **`environment.development.ts`**: `useMock: true`, `mockDelayMs: 500`, `mockErrorRate: 0.05`
- **`environment.production.ts`**: `useMock: false` (MUST be false)

## Usage

### Starting the App with Mock API

```bash
# Default: Mock auth + Mock API
npm start

# With real Auth0 + Real API
npm run start:auth
```

### API Endpoints

The mock API supports all standard Core Ledger API endpoints:

#### Funds
- `GET /api/funds` - List all funds (paginated)
- `GET /api/funds/:id` - Get fund by ID
- `POST /api/funds` - Create new fund
- `PUT /api/funds/:id` - Update fund
- `DELETE /api/funds/:id` - Delete fund

#### Accounts
- `GET /api/accounts` - List all accounts
- `GET /api/accounts/:id` - Get account by ID
- `POST /api/accounts` - Create account
- `PUT /api/accounts/:id` - Update account
- `DELETE /api/accounts/:id` - Delete account

#### Account Types
- `GET /api/accounttypes` - List all account types

#### Securities
- `GET /api/securities` - List all securities
- `GET /api/securities/:id` - Get security by ID
- `POST /api/securities` - Create security
- `PUT /api/securities/:id` - Update security
- `DELETE /api/securities/:id` - Delete security

#### Security Types
- `GET /api/securitytypes` - List all security types

#### Users
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user by ID

### Query Parameters

#### Pagination
```typescript
GET /api/funds?limit=10&offset=0
```

#### Sorting
```typescript
// Ascending
GET /api/funds?sortBy=name&sortDirection=asc

// Descending
GET /api/funds?sortBy=createdAt&sortDirection=desc
```

#### Filtering
```typescript
// Case-insensitive search across all fields
GET /api/funds?filter=equity
```

#### Combining Parameters
```typescript
GET /api/funds?filter=global&sortBy=name&sortDirection=asc&limit=5&offset=0
```

### Testing Error Conditions

#### Force Specific Error Code
```typescript
// Add ?mock-error=<statusCode> to any request
GET /api/funds?mock-error=404  // Returns 404 Not Found
GET /api/funds?mock-error=500  // Returns 500 Internal Server Error
GET /api/funds?mock-error=403  // Returns 403 Forbidden
```

#### Random Errors (via Environment)
```typescript
// Set mockErrorRate in environment
api: {
  useMock: true,
  mockDelayMs: 500,
  mockErrorRate: 0.1, // 10% of requests will fail randomly
}
```

## Mock Data

### Structure

Mock data is organized in `/src/app/api/mock-data/`:

```
mock-data/
├── index.ts               # Barrel export
├── accounts.mock.ts       # Account data
├── account-types.mock.ts  # Account type data
├── funds.mock.ts          # Fund data
├── securities.mock.ts     # Security data
├── security-types.mock.ts # Security type data
└── users.mock.ts          # User data
```

### Example Mock Data

```typescript
// funds.mock.ts
export const MOCK_FUNDS: Fund[] = [
  {
    id: 1,
    code: 'FUND001',
    name: 'Global Equity Growth Fund',
    baseCurrency: 'USD',
    inceptionDate: '2020-01-15',
    valuationFrequency: ValuationFrequency.Daily,
    valuationFrequencyDescription: 'Daily',
    createdAt: '2020-01-15T10:00:00Z',
    updatedAt: '2024-12-01T14:30:00Z',
  },
  // ... more funds
];
```

### Customizing Mock Data

1. **Edit existing data**: Modify files in `/src/app/api/mock-data/`
2. **Add new entities**: Follow the existing pattern
3. **Reset data**: Call `mockApiService.reset()` (useful in tests)

## Production Safety

The mock API includes **multiple layers of protection** to prevent accidental use in production:

### Layer 1: Environment Flag
```typescript
// environment.production.ts
api: {
  useMock: false, // MUST be false in production
}
```

### Layer 2: File Replacement
```json
// angular.json
"fileReplacements": [
  {
    "replace": "src/app/api/mock-data/index.ts",
    "with": "src/app/api/mock-data.production.ts"
  }
]
```

The production stub throws errors when accessed:
```typescript
// mock-data.production.ts
export const MOCK_FUNDS = new Proxy({}, {
  get() {
    throw new Error('Mock data is not available in production');
  }
});
```

### Layer 3: Runtime Checks
```typescript
// MockApiService constructor
if (!this.environment.api?.useMock) {
  throw new Error('MockApiService should never be used in production!');
}

// mockApiInterceptor
if (environment.production) {
  throw new Error('mockApiInterceptor is active in production build');
}
```

### Layer 4: Conditional Providers
```typescript
// app.config.ts
providers: [
  // Only provide MockApiService when useMock is true
  ...(environment.api?.useMock ? [MockApiService] : []),
  
  // Conditional interceptor
  provideHttpClient(
    withInterceptors([
      ...(environment.api?.useMock ? [mockApiInterceptor] : []),
    ])
  ),
]
```

### Testing Production Safety

```bash
# Run production safety tests
npm test -- production-safety.spec.ts
```

## Testing

### Unit Tests

The mock API includes comprehensive test coverage:

- **`mock-api.interceptor.spec.ts`** - Interceptor tests
- **`mock-api.service.spec.ts`** - Service tests
- **`production-safety.spec.ts`** - Production safety tests

### Using Mock API in Tests

```typescript
import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { mockApiInterceptor } from '@/app/api/mock-api.interceptor';
import { MockApiService } from '@/app/api/mock-api.service';

TestBed.configureTestingModule({
  providers: [
    provideHttpClient(withInterceptors([mockApiInterceptor])),
    MockApiService,
    {
      provide: ENVIRONMENT,
      useValue: {
        api: { useMock: true, mockDelayMs: 0, mockErrorRate: 0 },
      },
    },
  ],
});

const httpClient = TestBed.inject(HttpClient);

// Make requests - they'll be handled by the mock API
httpClient.get('/api/funds').subscribe(funds => {
  // Test your logic
});
```

### Resetting Mock Data

```typescript
const mockApiService = TestBed.inject(MockApiService);
mockApiService.reset(); // Resets all data to initial state
```

## Troubleshooting

### Mock API Not Working

**Problem**: Requests are going to the real API instead of being intercepted.

**Solutions**:
1. Check `environment.api.useMock` is `true`
2. Verify interceptor is registered in `app.config.ts`
3. Ensure requests use `/api/**` prefix
4. Check browser console for errors

### Data Not Persisting

**Problem**: Changes don't persist across requests.

**Explanation**: This is intentional - data resets when the app reloads. For persistent testing:
- Use the real backend with `npm run start:auth`
- Or implement localStorage persistence (custom enhancement)

### TypeScript Errors on Mock Data

**Problem**: Import errors for mock data types.

**Solution**: Ensure your entity models match the mock data structure.

```typescript
// Verify model exports
import { Fund } from '@/app/models/fund.model';
import { MOCK_FUNDS } from '@/app/api/mock-data';

// Type check
const fund: Fund = MOCK_FUNDS[0]; // Should not error
```

### Production Build Includes Mock Code

**Problem**: Mock API code in production bundle.

**Solution**: Verify build configuration:
```bash
ng build --configuration=production

# Check that file replacements occurred
# mock-data/index.ts should be replaced with mock-data.production.ts
```

## Development Workflow

### Adding a New Entity

1. **Create model** in `src/app/models/`
2. **Create mock data** in `src/app/api/mock-data/`
3. **Export from index** in `mock-data/index.ts`
4. **Add to service** in `mock-api.service.ts`:
   - Add Map storage
   - Add to `getDataMapForUrl()`
   - Add to `getNextIdForUrl()`
   - Add to `reset()`
5. **Test** - Create spec file

### Debugging Requests

Enable console logging in the interceptor:

```typescript
// mock-api.interceptor.ts
export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('[MockAPI]', req.method, req.url);
  // ... rest of interceptor
};
```

## Best Practices

1. **Always use `/api` prefix** for API calls
2. **Set `mockDelayMs` > 0** to test loading states
3. **Use `mockErrorRate`** to test error handling
4. **Never commit** `useMock: true` in production environments
5. **Keep mock data realistic** - use actual formats and edge cases
6. **Document edge cases** in mock data (special characters, nulls, etc.)
7. **Test with mock disabled** before deploying

## Future Enhancements

- [ ] WebSocket mock support
- [ ] Request/response logging UI
- [ ] Mock data generator CLI
- [ ] Persistence to localStorage
- [ ] GraphQL mock support
- [ ] Swagger/OpenAPI integration

## Related Documentation

- [Authentication System](./authentication.md)
- [API Documentation](./api.md)
- [Environment Configuration](../ENVIRONMENT_MIGRATION.md)
- [Testing Guide](./testing.md)

## Support

For questions or issues with the Mock API system:
1. Check this documentation
2. Review test files for examples
3. Open an issue in the project repository
