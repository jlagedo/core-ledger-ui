---
applyTo: "**/*.ts,**/*.tsx"
---

# TypeScript & Angular Development Instructions

## Component Development

- Use standalone components (default in Angular 21+, don't explicitly set `standalone: true`)
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Use `inject()` function instead of constructor injection

## Signals & State Management

- Use signals for local component state: `signal()`, `computed()`, `toSignal()`
- Services expose read-only signals via `.asReadonly()`
- Use `@ngrx/signals` for feature stores
- DO NOT use `mutate` on signals, use `update` or `set` instead
- Keep state transformations pure and predictable

## Services Pattern

```typescript
@Injectable({ providedIn: 'root' })
export class MyService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(API_URL); // Use API_URL token
}
```

- Always use `inject()` function instead of constructor injection
- Use `providedIn: 'root'` for singleton services
- API calls return Observables with typed interfaces from `src/app/models/`
- Use `API_URL` injection token, never hardcode backend URLs

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain
- All models use kebab-case naming (e.g., `account-type.model.ts`)

## Routing

- Two-level routing structure:
  1. Top-level routes in `src/app/app.routes.ts` use `loadChildren` for feature modules
  2. Feature routes (e.g., `funds.routes.ts`) define child routes using exported constants
- All routes use `loadComponent` for components or `loadChildren` for feature modules
- Routes include `breadcrumb` in route data for automatic breadcrumb generation
- Routes protected with `authGuard` (except `/login`)

## Directives & Decorators

- DO NOT use `@HostBinding` and `@HostListener` decorators
- Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead

## Configuration & Environment

- Use `ENVIRONMENT` injection token to access environment config (never import directly)
- Use `API_URL` injection token for backend URL (from `src/app/config/api.config.ts`)
- The proxy configuration in `src/proxy.conf.json` forwards `/api/**` to backend
- Always use `/api` as the base path, never hardcode backend URLs
