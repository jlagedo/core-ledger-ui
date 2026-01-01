# Angular 21 Test Suite Review & Improvements Guide
k
**Date:** January 1, 2026  
**Framework:** Angular 21 with Vitest  
**Status:** Comprehensive analysis with actionable improvements

---

## Executive Summary

The test suite uses solid Angular testing patterns with Vitest, but has opportunities for simplification and optimization. Key areas:

✅ **Strengths:**
- Consistent use of TestBed for dependency injection
- Proper HTTP mocking with HttpTestingController
- Signal-based state is properly tested
- Good separation of concerns

⚠️ **Areas for Improvement:**
- Excessive TestBed boilerplate that could be simplified
- Redundant setup code across multiple test files
- Manual mock creation that could use `vi.mock()` more effectively
- Missing cleanup and isolation in some tests
- Overly detailed assertions that test implementation details

---

## Best Practices from Vitest & Angular Documentation

### 1. **TestBed Usage Best Practices**

**Current Pattern (Verbose):**
```typescript
beforeEach(() => {
  TestBed.configureTestingModule({
    imports: [Component],
    providers: [
      provideRouter([]),
      provideHttpClient(),
      provideLocationMocks(),
    ]
  }).compileComponents();
});
```

**Improved Pattern (Simplified):**
```typescript
beforeEach(() => {
  TestBed.configureTestingModule({
    imports: [ComponentUnderTest],
    providers: [provideTestDependencies()],
  });
});

const component = TestBed.createComponent(ComponentUnderTest).componentInstance;
```

**Recommendation:** The `provideTestDependencies()` helper in `test-helpers.ts` is excellent—use it consistently across all component tests.

### 2. **Mock Service Pattern**

**Current Pattern (Too Detailed):**
```typescript
const mockMicroSentryService = {
  withScope: vi.fn((fn: (scope: unknown) => void) => {
    const mockScope = {
      setTag: vi.fn(),
      setExtra: vi.fn(),
      report: vi.fn(),
      captureMessage: vi.fn(),
    };
    fn(mockScope);
  }),
  captureMessage: vi.fn(),
  report: vi.fn(),
};
```

**Improved Pattern (Vitest Native):**
```typescript
vi.mock('@micro-sentry/angular', () => ({
  MicroSentryService: {
    withScope: vi.fn(),
    captureMessage: vi.fn(),
    report: vi.fn(),
  }
}));
```

### 3. **Signal Testing Best Practices**

For signal-based state (Angular 21 pattern):
```typescript
// ✅ Good: Test computed signals
it('should calculate collectionSize from fundsResponse', () => {
  expect(component.collectionSize()).toBe(0);
  
  component.fundsResponse.set({
    items: [],
    totalCount: 50,
    limit: 15,
    offset: 0
  });
  
  expect(component.collectionSize()).toBe(50);
});

// ❌ Avoid: Testing signal getters/setters directly
it('should update signal', () => {
  component.mySignal.set('value');
  expect(component.mySignal()).toBe('value');  // Tests framework, not your code
});
```

### 4. **HTTP Testing Pattern**

**Current Pattern (Good):**
```typescript
service.getFunds(100, 0, 'name', 'asc', 'test').subscribe(response => {
  expect(response).toEqual(mockResponse);
});

const req = httpMock.expectOne(request =>
  request.url.includes('/api/funds') &&
  request.url.includes('limit=100')
);
expect(req.request.method).toBe('GET');
req.flush(mockResponse);
```

**Improvement Opportunity:**
- Use `expectOne()` with exact URL matching when possible (cleaner assertions)
- Always call `httpMock.verify()` in `afterEach()` to catch unexpected requests

### 5. **Storage Mocking Pattern**

**Current Pattern (Complex):**
```typescript
localStorageMock = {};
const localStorageGetItemSpy = vi.spyOn(Storage.prototype, 'getItem')
  .mockImplementation((key: string) => localStorageMock[key] || null);
const localStorageSetItemSpy = vi.spyOn(Storage.prototype, 'setItem')
  .mockImplementation((key: string, value: string) => {
    localStorageMock[key] = value;
  });
```

**Improved Pattern:**
```typescript
// Use vi.stubGlobal for simpler storage mocking
const localStorageMock = new Map<string, string>();
vi.stubGlobal('localStorage', {
  getItem: (key: string) => localStorageMock.get(key) ?? null,
  setItem: (key: string, value: string) => localStorageMock.set(key, value),
  clear: () => localStorageMock.clear(),
});
```

Or better: Use `InMemoryStorageService` pattern already in the codebase.

---

## Findings by Test Category

### A. Service Tests (Excellent Foundation)

**Files Reviewed:**
- `logger.spec.ts` (174 lines)
- `fund.spec.ts` (96 lines)
- `account.spec.ts`
- `security.spec.ts`
- `toast-service.spec.ts` (Minimal - good candidate for expansion)
- `theme-service.spec.ts` (150 lines)

**Key Issues:**
1. **Inconsistent Mock Patterns**: Mix of object literals and `vi.mock()`
2. **Redundant Spy Assertions**: Testing console/toast calls when testing logging
3. **Missing Edge Cases**: Error scenarios, boundary conditions

**Example Issue in `logger.spec.ts`:**
```typescript
// ❌ Too focused on implementation details
it('should log debug messages', () => {
  const consoleSpy = vi.spyOn(console, 'debug');
  service.debug('Test debug message', {foo: 'bar'});
  expect(consoleSpy).toHaveBeenCalled();
});

// ✅ Better: Test actual behavior
it('should include context in debug logs', () => {
  const consoleSpy = vi.spyOn(console, 'debug');
  service.debug('Test message', {correlationId: 'abc-123'});
  
  expect(consoleSpy).toHaveBeenCalledWith(
    expect.stringContaining('Test message'),
    expect.objectContaining({correlationId: 'abc-123'})
  );
});
```

### B. Component Tests (Needs Simplification)

**Files Reviewed:**
- `fund-list.spec.ts`
- `app.spec.ts`
- Several feature component tests

**Key Issues:**
1. **Over-provisioning Dependencies**: All components get full HTTP, Router, Location setup
2. **Weak Assertions**: Many tests just check `component` is created
3. **Missing Integration Tests**: No tests for template rendering with actual data
4. **No Accessibility Tests**: No AXE or ARIA assertions despite project requirements

**Opportunities:**
- Add template-focused tests that verify data binding and user interactions
- Test `computed()` signals with actual template rendering
- Add accessibility checks for critical components

### C. Store Tests (Good Pattern)

**Files Reviewed:**
- `paginated-search-store.spec.ts` (169 lines)

**Strengths:**
- Clear setup with `InMemoryStorageService`
- Tests each method's state changes
- Proper use of `TestBed.runInInjectionContext()`

**Minor Improvements:**
- Could add tests for persistence/hydration from storage
- Could test signal reactivity chains (watch computed values)

### D. Directive Tests (Excellent)

**Files Reviewed:**
- `sortable.directive.spec.ts` (Clean, well-structured)

**Strengths:**
- Good test component pattern
- Tests full interaction lifecycle
- Verifies CSS class mutations

### E. Gaps Identified

**1. Missing Test Coverage:**
- Many feature components have minimal tests (just creation)
- Forms and validation not tested
- Modal/dialog interactions not tested
- Accessibility requirements not validated

**2. No Integration Tests:**
- User workflows across multiple components
- Store state propagation
- Form submission with HTTP

**3. No Utility Tests:**
- Custom directives like `only-numbers`
- Helper functions in stores

---

## Recommended Test Suite Structure

### File Organization
```
src/app/
├── services/
│   ├── logger.ts
│   └── logger.spec.ts              (180 lines - test behavior, not implementation)
├── features/
│   ├── funds/
│   │   ├── fund-list.ts
│   │   ├── fund-list.spec.ts       (80 lines - focused on UI behavior)
│   │   └── fund-list.integration.spec.ts  (NEW - test with real store)
├── testing/
│   ├── test-helpers.ts             (already good)
│   ├── mock-services.ts            (NEW - centralized mocks)
│   └── test-data-builders.ts       (NEW - factory functions for test data)
```

### Recommended Test Helper Expansions

Add to `src/app/testing/test-helpers.ts`:

```typescript
// Mock service builders
export function createMockFundService() { ... }
export function createMockLogger() { ... }

// Test data builders (follows builder pattern)
export class FundBuilder {
  private data: Partial<Fund> = {...};
  
  withName(name: string) {
    this.data.name = name;
    return this;
  }
  
  build(): Fund {
    return {...defaults, ...this.data};
  }
}

// Test utilities
export function expectHttpRequest(
  httpMock: HttpTestingController,
  method: string,
  url: string
) { ... }
```

---

## Specific Test File Improvements

### Priority 1: High Impact (Many Tests Use These Patterns)

1. **logger.spec.ts** - Simplify console spying, test actual behaviors
2. **theme-service.spec.ts** - Use `vi.stubGlobal()` instead of manual Storage mocks
3. **test-helpers.ts** - Add mock service builders and test data factories

### Priority 2: Important (Component Tests)

1. **fund-list.spec.ts** - Add template rendering tests, test signals with actual binding
2. **app.spec.ts** - Add router outlet verification
3. All feature component tests - Replace "just check creation" with behavior tests

### Priority 3: Enhancement (Expand Coverage)

1. **toast-service.spec.ts** - Expand to test all toast types
2. **Add directive tests** - `only-numbers.directive.spec.ts` is missing
3. **Add form tests** - Test form components in detail

---

## Implementation Roadmap

### Phase 1: Establish Baseline (Immediate)
- [ ] Enhance test-helpers.ts with mock builders
- [ ] Create test data builders
- [ ] Document shared testing patterns

### Phase 2: Refactor High-Impact Tests (Week 1)
- [ ] Simplify service test mocking patterns
- [ ] Update storage mocking to use vi.stubGlobal
- [ ] Ensure all afterEach() includes cleanup

### Phase 3: Improve Component Tests (Week 2)
- [ ] Add template rendering tests
- [ ] Test signal computations with real rendering
- [ ] Test user interactions (click, input)

### Phase 4: Expand Coverage (Week 3)
- [ ] Add missing directive tests
- [ ] Add form validation tests
- [ ] Add integration tests for key workflows

---

## Code Quality Metrics

**Current State:**
- Test files: 28 spec files identified
- Lines of test code: ~2,500
- Average test file length: 89 lines

**After Improvements:**
- **Faster execution:** Fewer unnecessary TestBed setups
- **Better readability:** Less boilerplate, clearer intent
- **Higher maintainability:** Shared test utilities reduce duplication
- **Better coverage:** Focus on behavior over implementation

---

## Vitest-Specific Features to Leverage

1. **Snapshot Testing**: Great for component templates
   ```typescript
   it('renders fund list', () => {
     expect(fixture.nativeElement.innerHTML).toMatchSnapshot();
   });
   ```

2. **Parameterized Tests**: Test multiple scenarios
   ```typescript
   describe.each([
     { theme: 'dark', expected: true },
     { theme: 'light', expected: false },
   ])('theme $theme', ({ theme, expected }) => { ... });
   ```

3. **Inline Mock Definitions**: Cleaner than separate mock files
   ```typescript
   vi.mock('@angular/common/http', () => ({...}));
   ```

4. **beforeEach Hook Optimization**: Use block-scoped beforeEach
   ```typescript
   describe('Feature A', () => {
     beforeEach(() => { /* only for Feature A */ });
   });
   ```

---

## Checklist for Test Review

### For Every Test File:
- [ ] No hardcoded dependencies (use injection)
- [ ] All mocks cleaned in afterEach
- [ ] Test description matches actual behavior tested
- [ ] No implementation details in assertions
- [ ] Related tests grouped in describe blocks
- [ ] One assertion per test (or logically grouped)
- [ ] Clear setup→execute→assert pattern

### For Component Tests:
- [ ] Templates are rendered and tested
- [ ] Inputs are tested with different values
- [ ] Outputs are verified on user interactions
- [ ] Async operations handled with waitFor
- [ ] No spy on internal methods (test through public API)

### For Service Tests:
- [ ] All public methods have tests
- [ ] Error cases are tested
- [ ] Observable error handling is tested
- [ ] No dependency on execution order

### For Integration Tests:
- [ ] Multiple components interact correctly
- [ ] Store state flows properly
- [ ] Forms submit to services
- [ ] HTTP responses trigger proper UI updates

---

## References

### Vitest Documentation
- Component Testing: https://vitest.dev/guide/browser.html
- Mocking Guide: https://vitest.dev/guide/mocking.html
- Advanced Testing: https://vitest.dev/guide/advanced.html

### Angular Testing Documentation
- Unit Testing: https://angular.io/guide/testing
- Components: https://angular.io/guide/testing-components-scenarios
- Services: https://angular.io/guide/testing-services

### Best Practices
- Vitest uses Jest-compatible syntax for familiarity
- MSW (Mock Service Worker) recommended for HTTP mocking (considered for future)
- Testing Library patterns suitable for Angular components

---

## Next Steps

1. **Immediate:** Review and approve this analysis
2. **Week 1:** Implement Phase 1 (baseline establishment)
3. **Week 2:** Execute Phase 2 (high-impact refactoring)
4. **Week 3:** Complete Phase 3 (component test improvements)
5. **Ongoing:** Phase 4 (expand coverage as new features are added)

---

**Document Version:** 1.0  
**Last Updated:** January 1, 2026  
**Review Cycle:** Quarterly
