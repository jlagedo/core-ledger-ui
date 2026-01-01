# Core Ledger UI - GitHub Copilot Instructions

You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.

## Project Overview

Core Ledger UI is a fund accounting ABOR (Accounting Book of Records) application built with Angular 21. It provides comprehensive financial management features including fund management, portfolio tracking, securities management, transactions, NAV calculation, chart of accounts, journal entries, posting periods, and financial reporting.

## Quick Reference

### Development Commands
- `npm start` - Start dev server with mock authentication (default, no Auth0 needed)
- `npm run start:auth` - Start with real Auth0 authentication
- `npm test` - Run Vitest tests (not Jasmine/Karma)
- `npm run watch` - Watch mode with auto-rebuild
- Development server: http://localhost:4200/ (proxies `/api/**` to backend: https://localhost:7109)

### Key Technologies
- **Framework:** Angular 21 with TypeScript 5.9
- **State Management:** @ngrx/signals (signal-based)
- **UI:** Bootstrap 5.3, ng-bootstrap 20, Bootstrap Icons
- **Auth:** Auth0 OIDC via angular-auth-oidc-client
- **Testing:** Vitest 4.0 (not Jasmine/Karma)
- **Build:** Angular CLI with Vite

## File-Specific Instructions

Detailed instructions are organized by file type:
- **TypeScript/Angular files** (`**/*.ts`): See `.github/typescript.instructions.md`
- **Test files** (`**/*.spec.ts`): See `.github/testing.instructions.md`
- **Templates & Styles** (`**/*.html`, `**/*.scss`): See `.github/styling.instructions.md`
- **Authentication** (`src/app/auth/**/*`): See `.github/auth.instructions.md`
- **Environment config** (`src/environments/**/*.ts`): See `.github/environment.instructions.md`
- **State stores** (`**/*-store.ts`): See `.github/store.instructions.md`

## Core Principles

### Angular & TypeScript
- Use standalone components (default in Angular 21+)
- Use signals for state management: `signal()`, `computed()`, `toSignal()`
- Use `inject()` function instead of constructor injection
- Use `input()` and `output()` functions instead of decorators
- Set `changeDetection: ChangeDetectionStrategy.OnPush`
- Use strict TypeScript, avoid `any` type

### Templates & Styling
- Use native control flow: `@if`, `@for`, `@switch` (not `*ngIf`, `*ngFor`)
- Use `class` and `style` bindings (not `ngClass`/`ngStyle`)
- Always use Bootstrap 5 utility classes, never inline styles with custom colors
- Must pass AXE checks and follow WCAG AA standards

### API Integration
- Always use `API_URL` injection token, never hardcode backend URLs
- Proxy configuration forwards `/api/**` to backend automatically
- API calls return Observables with typed interfaces from `src/app/models/`
- All models use kebab-case naming (e.g., `account-type.model.ts`)

### Authentication
- Two modes: Mock (default for local dev) and Real Auth0
- Mock mode enabled with `environment.auth.useMock = true`
- Mock users: admin, fund-manager, trader, analyst
- All routes protected with `authGuard` (except `/login`)

### Testing
- Focus on business logic and behavior, not implementation details
- Do NOT test framework internals, HTML structure, CSS classes, or third-party components
- Remove "should be created" tests - they test Angular's DI, not your code
- Tests should survive HTML/CSS refactoring

## Project Structure

```
src/app/
├── auth/                    # Authentication (Auth0 OIDC + mock)
├── config/                  # Configuration (API URL, etc.)
├── directives/              # Shared directives
├── features/                # Feature modules (lazy-loaded)
│   ├── funds/              # Fund management
│   ├── chart-of-accounts/  # Account management
│   ├── journal-entries/    # Journal entries
│   ├── portfolio/          # Portfolio holdings
│   ├── transactions/       # Transaction management
│   └── [other features]
├── layout/                  # Layout components
├── models/                  # TypeScript interfaces (kebab-case)
├── services/                # Global singleton services
├── shared/                  # Shared utilities
│   ├── storage/            # Storage abstraction
│   └── stores/             # Reusable @ngrx/signals stores
├── testing/                # Test utilities and mocks
├── app.ts                  # Root component
└── app.routes.ts           # Top-level routes
```

## Feature Module Pattern

Features follow a consistent structure in `src/app/features/<feature-name>/`:

```
features/<feature>/
├── <feature>.routes.ts       # Exports <FEATURE>_ROUTES constant
├── <feature>-store.ts        # Feature-specific @ngrx/signals store
├── <feature>-list.ts         # List view (uses paginated-search-store)
├── <feature>-details.ts      # Detail view
└── <feature>-form/
    └── <feature>-form.ts     # Form component
```

## Environment Configuration

- Environment files in `src/environments/` per deployment target
- Use `ENVIRONMENT` injection token (never import directly)
- Use `API_URL` injection token for backend URL
- Configuration includes: API URL, log level, Sentry, Auth0, toast delays, pagination, storage keys, feature flags

## Services Pattern

```typescript
@Injectable({ providedIn: 'root' })
export class MyService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(API_URL);
}
```

Global services:
- `AuthService` - Authentication with signals
- `UserService` - User data management
- `ThemeService` - Dark/light theme
- `ToastService` - Global notifications
- `LoggerService` - Structured logging
- `BreadCrumbService` - Automatic breadcrumbs
- `MenuService` - Navigation state

## Routing Architecture

Two-level structure:
1. **Top-level** (`app.routes.ts`): Feature modules with `loadChildren`
2. **Feature-level** (e.g., `funds.routes.ts`): Child routes with `loadComponent`

Routes include `breadcrumb` in route data for automatic breadcrumb generation.

## Additional Documentation

For comprehensive details, see:
- `README.md` - Setup, installation, mock authentication
- `CLAUDE.md` - Detailed architecture and patterns
- `TESTING_GUIDELINES.md` - What to test and what not to test
- `ENVIRONMENT_SETUP.md` - Environment configuration guide
