# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Core Ledger UI is a fund accounting application built with Angular 21. It provides comprehensive financial management features including fund management, portfolio tracking, transactions, NAV calculation, chart of accounts, journal entries, posting periods, and financial reporting.

## Development Commands

### Development Server
```bash
ng serve
# or
npm start
```
Application runs at http://localhost:4200/

### Testing
```bash
ng test      # Run all tests with Vitest
npm test     # Same as above
```

### Building
```bash
ng build                              # Development build
ng build --configuration production   # Production build (outputs to dist/)
npm run watch                         # Watch mode (auto-rebuild on changes)
```

### Code Generation
```bash
ng generate component features/my-feature/my-component
ng generate service services/my-service
ng generate directive directives/my-directive
```

## Architecture

### Routing & Lazy Loading

The application uses a two-level routing structure:
1. Top-level routes in `src/app/app.routes.ts` define feature modules with lazy loading
2. Feature-level routes (e.g., `funds.routes.ts`) define child routes within features

All routes use `loadComponent` for individual components or `loadChildren` for feature modules with child routes. This ensures optimal bundle splitting and performance.

Route data includes `breadcrumb` property used by `BreadCrumbService` to generate navigation breadcrumbs automatically.

### State Management

The application uses Angular signals for state management (@ngrx/signals):
- Services expose read-only signals via `.asReadonly()`
- Private signals prefixed with `_` (e.g., `_toasts`)
- Use `signal()`, `computed()`, and `toSignal()` for reactive state
- Example pattern: see `ToastService` (src/app/services/toast-service.ts)

### API Integration

API calls are proxied through `src/proxy.conf.json` which forwards `/api/**` to `https://localhost:7109`.

Services follow this pattern:
- Inject `API_URL` token from `src/app/config/api.config.ts` (default: `/api`)
- Inject `HttpClient` using `inject()` function
- Return Observables for async operations
- Use typed interfaces from `src/app/models/` for request/response
- Example: see `FundService` (src/app/services/fund.ts)

### Services

Global singleton services use `providedIn: 'root'` and the `inject()` function instead of constructor injection:

```typescript
@Injectable({ providedIn: 'root' })
export class MyService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(API_URL);
}
```

Key services:
- **ToastService**: Global toast notifications (success/warning/error/info)
- **BreadCrumbService**: Automatic breadcrumb generation from route data
- **FundService** / **AccountService**: API integration for domain entities

### Layout Components

Core layout components in `src/app/layout/`:
- **sidenav**: Main navigation sidebar
- **bread-crumb-component**: Breadcrumb navigation
- **toasts-container**: Global toast notification display

### Features Structure

Features follow a consistent pattern:
- Each feature module in `src/app/features/<feature-name>/`
- Child routes defined in `<feature-name>.routes.ts`
- Components are standalone (no NgModules)
- Feature exports named constant for routes (e.g., `FUNDS_ROUTES`)

Example feature structure (Funds):
```
features/funds/
├── funds.routes.ts       # Child routes
├── funds.ts              # Feature shell component (if needed)
├── fund-list.ts          # List view
├── fund-details.ts       # Detail view
├── fund-form/
│   └── fund-form.ts      # Form component
└── share-classes.ts      # Related feature
```

### Models

TypeScript interfaces and types in `src/app/models/`:
- Domain models (e.g., `fund.model.ts`, `account.model.ts`)
- Request/response DTOs (`CreateFund`, `UpdateFund`, `PaginatedResponse<T>`)
- Enum-like models (e.g., `account_type.model.ts`)

## Code Standards & Conventions

### Angular & TypeScript Requirements

**DO:**
- Use standalone components (default in Angular 20+, don't set `standalone: true`)
- Use signals for state management (`signal()`, `computed()`, `toSignal()`)
- Use `inject()` function instead of constructor injection
- Use `input()` and `output()` functions instead of decorators
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in components
- Use native control flow: `@if`, `@for`, `@switch` (not `*ngIf`, `*ngFor`, etc.)
- Use `class` and `style` bindings instead of `ngClass`/`ngStyle`
- Use Reactive Forms (not Template-driven)
- Put host bindings in the `host` object of `@Component`/`@Directive` decorator
- Use strict TypeScript (`strict: true` enabled)
- Prefer type inference when obvious; avoid `any` (use `unknown` if type uncertain)

**DON'T:**
- Use `@HostBinding` or `@HostListener` decorators
- Use `mutate` on signals (use `update` or `set` instead)
- Write arrow functions in templates (not supported)
- Assume globals like `new Date()` are available in templates

### Styling

- SCSS is the stylesheet format (configured in `angular.json`)
- Use Bootstrap 5 utility classes where possible
- Avoid inline styles
- Prettier formatting: printWidth 100, singleQuote true

### Accessibility

- All changes must pass AXE checks
- Follow WCAG AA minimums (focus management, color contrast, ARIA attributes)

### File Organization

- Relative imports from component files (e.g., `./my-component.html`, `./my-component.scss`)
- Components, services, directives have co-located `.spec.ts` test files
- Shared directives in `src/app/directives/`
- Shared services in `src/app/services/`

## Testing

Tests use Vitest 4.0. Test files use `.spec.ts` extension and are co-located with source files.

Configuration:
- TypeScript strict mode enabled
- Vitest configured via Angular CLI
- Tests run with `ng test` or `npm test`

## TypeScript Configuration

Strict mode enabled with:
- `strict: true`
- `noImplicitOverride: true`
- `noPropertyAccessFromIndexSignature: true`
- `noImplicitReturns: true`
- `noFallthroughCasesInSwitch: true`
- `strictInjectionParameters: true`
- `strictInputAccessModifiers: true`
- `strictTemplates: true`

Target: ES2022
