---
applyTo: "**/*.spec.ts"
---

# Testing Instructions

## Testing Framework

- Uses Vitest 4.0 (not Jasmine/Karma)
- Test files: `*.spec.ts`
- Mock utilities: `src/app/testing/test-helpers.ts`, `InMemoryStorageService`
- Use `provideTestDependencies()` helper to provide common test providers (router, HTTP, OIDC)

## What SHOULD Be Tested

### Business Logic
- Data transformations
- Calculations
- Validation rules
- State management logic (signals/RxJS/services)

### Services
- Method behavior
- API calls (mocked)
- Error handling
- Caching logic
- State updates

### Component Behavior
- Inputs/outputs
- User interactions (click, input events)
- Conditional rendering logic
- Event emission

### Form Logic
- Validation rules
- Default values
- Submission behavior
- Field interactions

### Critical Routing Flows
- Guards (allow/deny access)
- Redirects
- Role-based access

## What Should NOT Be Tested

### Framework Internals
- ❌ Dependency injection system
- ❌ Change detection mechanism
- ❌ HttpClient internals
- ❌ Router internals

### HTML Structure or CSS
- ❌ Tag names
- ❌ Class names
- ❌ Layout details
- ❌ DOM structure

### Third-Party UI Components
- ❌ Angular Material components
- ❌ ng-bootstrap components
- ❌ Any third-party library UI

### Visual Layout or Styling
- ❌ Spacing, margins, padding
- ❌ Colors
- ❌ Responsiveness
- ❌ Animations

### Implementation Details
- ❌ Private methods
- ❌ Internal variables
- ❌ Specific DOM elements by query selectors

## Tests to Remove or Refactor

### "should be created" / "should create" Tests
**Remove these** - They test Angular's DI system, not your code.

### DOM Structure Tests
**Remove or refactor** - Test behavior, not HTML structure.

### CSS Class Tests
**Remove** - Test behavior, not implementation details.

### Icon/Visual Tests
**Remove or refactor** - Test state/properties, not visual details.

## Testing Principles

1. **Test Behavior, Not Implementation** - Focus on what code does, not how it does it
2. **Test Through Public API** - Don't access private methods or properties
3. **Test Business Value** - Every test should verify something valuable
4. **Avoid Brittle Tests** - Tests should survive HTML/CSS refactoring
5. **Trust The Framework** - Angular's DI, change detection, etc. are well-tested

## Testing Checklist

Before writing a test, ask yourself:
- [ ] Am I testing **my business logic** or framework internals?
- [ ] Am I testing **behavior** or implementation details?
- [ ] Would this test break if I refactor the HTML/CSS?
- [ ] Am I testing through the **public API** only?
- [ ] Does this test add value or just inflate coverage?

**Remember:** Good tests survive refactoring. If changing HTML breaks your tests, you're testing the wrong thing.
