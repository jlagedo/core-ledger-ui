
You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.

## Project Context

Core Ledger UI is a fund accounting ABOR (Accounting Book of Records) application built with Angular 21. It provides comprehensive financial management features including fund management, portfolio tracking, securities management, transactions, NAV calculation, chart of accounts, journal entries, posting periods, and financial reporting.

## Development Commands

- `npm start` - Start dev server with **mock authentication** (default, no Auth0 needed)
- `npm run start:auth` - Start with real Auth0 authentication
- `npm test` - Run Vitest tests
- `npm run watch` - Watch mode with auto-rebuild
- Development server: http://localhost:4200/ (proxy to backend: https://localhost:7109)

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Accessibility Requirements

- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.

## Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- When using external templates/styles, use paths relative to the component TS file.
- Always use Bootstrap 5 utility classes (e.g., `text-primary`, `btn-primary`, `bg-secondary`) - **NEVER** inline styles with custom colors

## State Management

- Use signals for local component state: `signal()`, `computed()`, `toSignal()`
- Services expose read-only signals via `.asReadonly()` (e.g., `ThemeService`, `ToastService`)
- Use `@ngrx/signals` for feature stores (see `src/app/shared/stores/paginated-search-store.ts`)
- Do NOT use `mutate` on signals, use `update` or `set` instead
- Keep state transformations pure and predictable

## Routing Architecture

- **Two-level routing structure**:
  1. Top-level routes in `src/app/app.routes.ts` use `loadChildren` for feature modules
  2. Feature routes (e.g., `funds.routes.ts`) define child routes using exported constants (e.g., `FUNDS_ROUTES`)
- All routes use `loadComponent` for components or `loadChildren` for feature modules
- Routes include `breadcrumb` in route data for automatic breadcrumb generation
- Routes protected with `authGuard` (except `/login`)

## Authentication

- Uses Auth0 OIDC via `angular-auth-oidc-client`
- **Mock authentication available** for development: set `environment.auth.useMock = true` (default in `local-noauth`)
- `AuthService` uses `toSignal()` to convert OIDC observables to signals
- `UserService` fetches user data from backend on login (via reactive `effect()`)
- Mock users: admin, fund-manager, trader, analyst (see `src/app/auth/mock-users.ts`)

## Services Pattern

```typescript
@Injectable({ providedIn: 'root' })
export class MyService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(API_URL); // Use API_URL token, not hardcoded URLs
}
```

- Always use `inject()` function instead of constructor injection
- Use `providedIn: 'root'` for singleton services
- API calls return Observables with typed interfaces from `src/app/models/`
- All models use kebab-case naming (e.g., `account-type.model.ts`)

## Feature Module Structure

Features in `src/app/features/<feature-name>/` follow this pattern:

```
features/<feature>/
├── <feature>.routes.ts       # Exports <FEATURE>_ROUTES constant
├── <feature>-store.ts         # Feature-specific @ngrx/signals store
├── <feature>-list.ts          # List view (uses paginated-search-store)
├── <feature>-details.ts       # Detail view
└── <feature>-form/
    └── <feature>-form.ts      # Form component
```

## Testing

- Uses Vitest (not Jasmine/Karma)
- Test files: `*.spec.ts`
- Mock utilities: `src/app/testing/test-helpers.ts`, `InMemoryStorageService`

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available.
- Do not write arrow functions in templates (they are not supported).

## Logging & Error Handling

- Use `LoggerService` for structured logging with context (debug/info/warn/error)
- Automatic Sentry integration for error tracking
- Use `ToastService` for user-facing notifications (success/error/warning/info)
