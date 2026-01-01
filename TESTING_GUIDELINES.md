# Angular 21 Testing Guidelines - What to Test & What Not to Test

**Date:** January 1, 2026  
**Based on:** Industry best practices for Angular testing

---

## ✅ **What SHOULD be tested**

### 1. **Business Logic**
- Data transformations
- Calculations
- Validation rules
- State management logic (signals/RxJS/services)

**Example:**
```typescript
it('should calculate total with tax', () => {
  const result = service.calculateTotalWithTax(100, 0.08);
  expect(result).toBe(108);
});
```

### 2. **Services**
- Method behavior
- API calls (mocked)
- Error handling
- Caching logic
- State updates

**Example:**
```typescript
it('should fetch funds with pagination', () => {
  const mockResponse = createMockPaginatedResponse([fund], 1);
  service.getFunds(100, 0).subscribe(response => {
    expect(response.items.length).toBe(1);
  });
  expectHttpRequest(httpMock, 'GET', /\/api\/funds/).flush(mockResponse);
});
```

### 3. **Component Behavior**
- Inputs/outputs
- User interactions (click, input events)
- Conditional rendering logic
- Event emission

**Example:**
```typescript
it('should emit search term when searching', () => {
  const spy = vi.spyOn(component.search, 'emit');
  component.onSearch('test');
  expect(spy).toHaveBeenCalledWith('test');
});

it('should show error message when invalid', () => {
  component.isValid.set(false);
  fixture.detectChanges();
  expect(component.errorMessage()).toBe('Invalid input');
});
```

### 4. **Pipes**
- Pure input → output transformations

**Example:**
```typescript
it('should format currency', () => {
  const result = pipe.transform(1234.56, 'USD');
  expect(result).toBe('$1,234.56');
});
```

### 5. **Critical Routing Flows**
- Guards (allow/deny access)
- Redirects
- Role-based access

**Example:**
```typescript
it('should redirect to login when unauthenticated', () => {
  authService.isAuthenticated.set(false);
  expect(guard.canActivate()).toBe(false);
});
```

### 6. **Form Logic**
- Validation rules
- Default values
- Submission behavior
- Field interactions

**Example:**
```typescript
it('should mark email as invalid when empty', () => {
  form.controls.email.setValue('');
  expect(form.controls.email.hasError('required')).toBe(true);
});
```

---

## ❌ **What should NOT be tested**

### 1. **Angular Framework Internals**
- ❌ Dependency injection system
- ❌ Change detection mechanism
- ❌ HttpClient internals
- ❌ Router internals

**Bad Example:**
```typescript
// ❌ DON'T test that Angular's DI works
it('should inject service', () => {
  expect(TestBed.inject(MyService)).toBeTruthy();
});

// ❌ DON'T test change detection
it('should detect changes', () => {
  fixture.detectChanges();
  expect(fixture.componentRef.changeDetectorRef).toBeTruthy();
});
```

### 2. **HTML Structure or CSS**
- ❌ Tag names
- ❌ Class names
- ❌ Layout details
- ❌ DOM structure

**Bad Example:**
```typescript
// ❌ DON'T test HTML structure
it('should have main tag', () => {
  expect(compiled.querySelector('main')).toBeTruthy();
});

// ❌ DON'T test CSS classes
it('should have btn-primary class', () => {
  expect(element.classList.contains('btn-primary')).toBe(true);
});
```

**Better Alternative:**
```typescript
// ✅ Test behavior, not structure
it('should submit form when button is clicked', () => {
  const spy = vi.spyOn(component, 'onSubmit');
  const button = fixture.nativeElement.querySelector('[type="submit"]');
  button.click();
  expect(spy).toHaveBeenCalled();
});
```

### 3. **Third-Party UI Components**
- ❌ Angular Material components
- ❌ ng-bootstrap components
- ❌ Any third-party library UI

**Bad Example:**
```typescript
// ❌ DON'T test that Angular Material works
it('should render mat-button', () => {
  expect(compiled.querySelector('mat-button')).toBeTruthy();
});
```

### 4. **Visual Layout or Styling**
- ❌ Spacing, margins, padding
- ❌ Colors
- ❌ Responsiveness
- ❌ Animations

**Bad Example:**
```typescript
// ❌ DON'T test visual properties
it('should have correct padding', () => {
  expect(element.style.padding).toBe('10px');
});
```

### 5. **Implementation Details**
- ❌ Private methods
- ❌ Internal variables
- ❌ Specific DOM elements by query selectors

**Bad Example:**
```typescript
// ❌ DON'T test private methods
it('should call private method', () => {
  const spy = vi.spyOn(component as any, '_privateMethod');
  component.publicMethod();
  expect(spy).toHaveBeenCalled();
});

// ❌ DON'T test internal implementation
it('should have correct internal state', () => {
  expect((component as any)._internalCounter).toBe(5);
});
```

---

## 🔄 Tests to Remove or Refactor

### Type 1: "should be created" / "should create" Tests

**Current Pattern (Remove):**
```typescript
it('should be created', () => {
  expect(service).toBeTruthy();
});
```

**Why Remove:** This tests Angular's DI system, not your code.

**When to Keep:** Never. If the service doesn't instantiate, you'll know from other tests failing.

---

### Type 2: DOM Structure Tests

**Current Pattern (Remove or Refactor):**
```typescript
it('should render main layout', () => {
  const compiled = fixture.nativeElement as HTMLElement;
  expect(compiled.querySelector('main')).toBeTruthy();
  expect(compiled.querySelector('router-outlet')).toBeTruthy();
});
```

**Why Remove:** Tests HTML structure, which is an implementation detail.

**Better Alternative (If Really Needed):**
```typescript
it('should allow navigation to child routes', () => {
  router.navigate(['/dashboard']);
  expect(router.url).toBe('/dashboard');
});
```

---

### Type 3: CSS Class Tests

**Current Pattern (Remove):**
```typescript
it('should have pointer cursor', () => {
  const element = nameElement as HTMLElement;
  expect(element.style.cursor).toBe('pointer');
});

it('should have asc class', () => {
  expect(nameElement.classList.contains('asc')).toBe(true);
});
```

**Why Remove:** Tests implementation details (CSS classes).

**Better Alternative:**
```typescript
it('should emit ascending sort event', () => {
  component.onSort('name');
  expect(component.sortEvent()).toEqual({ column: 'name', direction: 'asc' });
});
```

---

### Type 4: Icon/Visual Tests

**Current Pattern (Remove):**
```typescript
it('should display sun icon in dark mode', () => {
  const themeIcon = fixture.nativeElement.querySelector('.bi-sun-fill');
  expect(themeIcon).toBeTruthy();
});
```

**Why Remove:** Tests visual implementation (icon classes).

**Better Alternative:**
```typescript
it('should use light theme icon when in dark mode', () => {
  themeService.currentTheme.set('dark');
  expect(component.themeIcon()).toBe('sun-fill');
});
```

---

## 🎯 Test Refactoring Patterns

### Pattern 1: Service Tests - Focus on Behavior

**Before (❌):**
```typescript
it('should be created', () => {
  expect(service).toBeTruthy();
});

it('should have getFunds method', () => {
  expect(typeof service.getFunds).toBe('function');
});
```

**After (✅):**
```typescript
describe('getFunds', () => {
  it('should fetch funds with pagination', () => {
    // Test actual behavior
  });

  it('should handle errors gracefully', () => {
    // Test error handling
  });
});
```

### Pattern 2: Component Tests - Focus on Interactions

**Before (❌):**
```typescript
it('should create', () => {
  expect(component).toBeTruthy();
});

it('should have search input', () => {
  expect(compiled.querySelector('input[type="search"]')).toBeTruthy();
});
```

**After (✅):**
```typescript
describe('search functionality', () => {
  it('should emit search term when user types', () => {
    component.onSearch('test');
    expect(component.searchTerm()).toBe('test');
  });

  it('should reset results when search is cleared', () => {
    component.onSearch('');
    expect(component.results()).toEqual([]);
  });
});
```

### Pattern 3: Directive Tests - Focus on Behavior, Not DOM

**Before (❌):**
```typescript
it('should have pointer cursor', () => {
  const element = nameHeader.nativeElement as HTMLElement;
  expect(element.style.cursor).toBe('pointer');
});
```

**After (✅):**
```typescript
it('should emit sort event on click', () => {
  const element = nameHeader.nativeElement as HTMLElement;
  element.click();
  expect(component.lastSortEvent).toEqual({ column: 'name', direction: 'asc' });
});
```

---

## 📝 Testing Checklist

Before writing a test, ask yourself:

- [ ] Am I testing **my business logic** or framework internals?
- [ ] Am I testing **behavior** or implementation details?
- [ ] Would this test break if I refactor the HTML/CSS?
- [ ] Am I testing through the **public API** only?
- [ ] Does this test add value or just inflate coverage?

**If you answered "framework", "implementation", "yes", "no", or "inflate" to any question, reconsider the test.**

---

## 🚀 Quick Decision Guide

| What You're Testing | Should Test? | Why |
|---------------------|--------------|-----|
| Method returns calculated value | ✅ Yes | Business logic |
| API call with correct params | ✅ Yes | Service behavior |
| Button click emits event | ✅ Yes | Component behavior |
| Form validates email format | ✅ Yes | Validation logic |
| Guard redirects unauthenticated users | ✅ Yes | Critical flow |
| Service can be injected | ❌ No | Framework feature |
| Component has `<div>` tag | ❌ No | HTML structure |
| Element has 'btn-primary' class | ❌ No | CSS/implementation |
| Icon shows in UI | ❌ No | Visual detail |
| Private method is called | ❌ No | Implementation detail |

---

## 💡 Key Principles

1. **Test Behavior, Not Implementation** - Focus on what code does, not how it does it
2. **Test Through Public API** - Don't access private methods or properties
3. **Test Business Value** - Every test should verify something valuable
4. **Avoid Brittle Tests** - Tests should survive HTML/CSS refactoring
5. **Trust The Framework** - Angular's DI, change detection, etc. are well-tested

---

## 📊 Estimated Impact on Current Test Suite

Based on analysis of current tests:

| Category | Current Count | Should Remove | Should Refactor |
|----------|---------------|---------------|-----------------|
| "should be created" tests | ~20 | 20 | 0 |
| DOM structure tests | ~15 | 10 | 5 |
| CSS class tests | ~10 | 10 | 0 |
| Icon/visual tests | ~8 | 8 | 0 |
| **Total** | **~53** | **~48** | **~5** |

**Net Effect:** Remove ~48 unnecessary tests, refactor ~5 to focus on behavior. This will:
- Reduce test maintenance burden
- Improve test reliability
- Focus on actual business value
- Speed up test execution

---

## 🔄 Migration Plan

### Phase 1: Remove Obvious Anti-Patterns (30 min)
1. Remove all "should be created" tests
2. Remove all DOM structure query tests
3. Remove all CSS class verification tests

### Phase 2: Refactor Borderline Tests (1 hour)
1. Convert icon tests to state/property tests
2. Convert HTML query tests to behavior tests
3. Add missing behavior tests for coverage

### Phase 3: Document Standards (30 min)
1. Add examples to team wiki
2. Update PR review checklist
3. Add linting rules if possible

---

## 📖 References

- [Testing Best Practices - Angular Docs](https://angular.io/guide/testing)
- [Testing Trophy - Kent C. Dodds](https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications)
- [Avoid Testing Implementation Details](https://kentcdodds.com/blog/testing-implementation-details)

---

**Remember:** Good tests survive refactoring. If changing HTML breaks your tests, you're testing the wrong thing.
