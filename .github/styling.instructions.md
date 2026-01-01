---
applyTo: "**/*.html,**/*.scss,**/*.css"
---

# Template & Styling Instructions

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like `new Date()` are available
- Do not write arrow functions in templates (they are not supported)
- DO NOT use `ngClass`, use `class` bindings instead
- DO NOT use `ngStyle`, use `style` bindings instead

## Styling

- SCSS is the stylesheet format
- Always use Bootstrap 5 utility classes (e.g., `text-primary`, `btn-primary`, `bg-secondary`)
- **NEVER** use inline styles with custom colors
- Use Bootstrap 5 utility classes where possible
- Avoid inline styles
- When using external templates/styles, use paths relative to the component TS file

## Bootstrap 5 Utilities

Prefer Bootstrap utility classes over custom CSS:
- Typography: `text-primary`, `text-secondary`, `text-muted`, `fw-bold`, `fs-4`
- Spacing: `m-3`, `p-4`, `mx-auto`, `py-2`
- Layout: `d-flex`, `flex-column`, `align-items-center`, `justify-content-between`
- Buttons: `btn`, `btn-primary`, `btn-secondary`, `btn-outline-primary`
- Background: `bg-primary`, `bg-secondary`, `bg-light`, `bg-dark`

## Images

- Use `NgOptimizedImage` for all static images
- `NgOptimizedImage` does not work for inline base64 images

## Accessibility Requirements

- Must pass all AXE checks
- Must follow all WCAG AA minimums:
  - Focus management
  - Color contrast
  - ARIA attributes
- Ensure proper semantic HTML
- Add appropriate ARIA labels and roles
