# Test Cleanup Report - Anti-Pattern Identification

**Generated:** January 1, 2026  
**Purpose:** Identify tests that violate testing best practices per TESTING_GUIDELINES.md

---

## 📊 Summary

| Anti-Pattern Type | Count | Action | Impact |
|-------------------|-------|--------|--------|
| "should be created" tests | 7 | **REMOVE** | -7 tests |
| CSS class tests | 11 | **REMOVE** | -11 tests |
| DOM structure tests | 6 | **REMOVE or REFACTOR** | -5 tests, refactor 1 |
| **Total** | **24** | | **-23 tests** |

---

## 🔴 Type 1: Framework DI Tests - REMOVE ALL

**Anti-Pattern:** Testing that Angular's dependency injection works

### Files to Update:

#### 1. [src/app/services/toast-service.spec.ts](src/app/services/toast-service.spec.ts#L13)
```typescript
// ❌ REMOVE (Line 13-15)
it('should be created', () => {
  expect(service).toBeTruthy();
});
```
**Reason:** Tests Angular's DI system, not our code

---

#### 2. [src/app/services/bread-crumb-service.spec.ts](src/app/services/bread-crumb-service.spec.ts#L17)
```typescript
// ❌ REMOVE (Line 17-19)
it('should be created', () => {
  expect(service).toBeTruthy();
});
```
**Reason:** Tests Angular's DI system, not our code

---

#### 3. [src/app/services/account.spec.ts](src/app/services/account.spec.ts#L13)
```typescript
// ❌ REMOVE (Line 13-15)
it('should be created', () => {
  expect(service).toBeTruthy();
});
```
**Reason:** Tests Angular's DI system, not our code

---

#### 4. [src/app/services/theme-service.spec.ts](src/app/services/theme-service.spec.ts#L24)
```typescript
// ❌ REMOVE (Line 24-26)
it('should be created', () => {
  expect(service).toBeTruthy();
});
```
**Reason:** Tests Angular's DI system, not our code

---

#### 5. [src/app/services/security.spec.ts](src/app/services/security.spec.ts#L31)
```typescript
// ❌ REMOVE (Line 31-33)
it('should be created', () => {
  expect(service).toBeTruthy();
});
```
**Reason:** Tests Angular's DI system, not our code

---

#### 6. [src/app/services/fund.spec.ts](src/app/services/fund.spec.ts#L32)
```typescript
// ❌ REMOVE (Line 32-34)
it('should be created', () => {
  expect(service).toBeTruthy();
});
```
**Reason:** Tests Angular's DI system, not our code

---

#### 7. [src/app/app.spec.ts](src/app/app.spec.ts#L20)
```typescript
// ❌ REMOVE (Line 20-22)
it('should create the app', () => {
  expect(component).toBeTruthy();
});
```
**Reason:** Tests Angular's DI system, not our code

---

## 🔴 Type 2: CSS Class Tests - REMOVE ALL

**Anti-Pattern:** Testing CSS classes or styling implementation details

### Files to Update:

#### 1. [src/app/directives/sortable.directive.spec.ts](src/app/directives/sortable.directive.spec.ts#L55-L89)

**Tests to Remove:**
```typescript
// ❌ REMOVE (Line 55)
expect(nameElement.style.cursor).toBe('pointer');

// ❌ REMOVE (Line 65)
expect(nameElement.classList.contains('asc')).toBe(true);

// ❌ REMOVE (Line 71-72)
expect(nameElement.classList.contains('desc')).toBe(true);
expect(nameElement.classList.contains('asc')).toBe(false);

// ❌ REMOVE (Line 78-79)
expect(nameElement.classList.contains('desc')).toBe(false);
expect(nameElement.classList.contains('asc')).toBe(false);

// ❌ REMOVE (Line 85)
expect(nameElement.classList.contains('asc')).toBe(true);
```

**Better Alternative:**
```typescript
// ✅ Test behavior instead
describe('sorting behavior', () => {
  it('should toggle between asc and desc on repeated clicks', () => {
    // First click - asc
    nameHeader.nativeElement.click();
    expect(component.lastSortEvent).toEqual({ column: 'name', direction: 'asc' });
    
    // Second click - desc
    nameHeader.nativeElement.click();
    expect(component.lastSortEvent).toEqual({ column: 'name', direction: 'desc' });
    
    // Third click - no sort
    nameHeader.nativeElement.click();
    expect(component.lastSortEvent).toBeNull();
  });
});
```

**Reason:** CSS classes are implementation details. Test the sort events emitted instead.

**Tests Affected:**
- `it('should have pointer cursor', ...)` - Line 54-56
- `it('should have asc class when clicked once', ...)` - Line 62-66
- `it('should toggle to desc class when clicked twice', ...)` - Line 68-73
- `it('should remove classes when clicked thrice', ...)` - Line 75-80
- `it('should toggle back to asc after clearing', ...)` - Line 82-86

**Action:** Remove entire test block (Lines 54-89), replace with behavior test

---

#### 2. [src/app/layout/user-profile/user-profile.spec.ts](src/app/layout/user-profile/user-profile.spec.ts#L125-L135)

**Tests to Remove:**
```typescript
// ❌ REMOVE (Lines 125-126)
expect(container.classList.contains('justify-content-center')).toBe(true);
expect(container.classList.contains('justify-content-between')).toBe(false);

// ❌ REMOVE (Lines 134-135)
expect(container.classList.contains('justify-content-between')).toBe(true);
expect(container.classList.contains('justify-content-center')).toBe(false);
```

**Better Alternative:**
```typescript
// ✅ Test computed values or state instead
it('should center content when user name is not available', () => {
  component.userName = signal(null);
  expect(component.shouldCenterContent()).toBe(true);
});

it('should distribute content when user data is available', () => {
  component.userName = signal('John Doe');
  expect(component.shouldCenterContent()).toBe(false);
});
```

**Reason:** Bootstrap classes are implementation details. Test component logic instead.

---

## 🟡 Type 3: DOM Structure Tests - REMOVE OR REFACTOR

**Anti-Pattern:** Testing HTML structure or element presence

### Files to Update:

#### 1. [src/app/features/admin/securities/securities.spec.ts](src/app/features/admin/securities/securities.spec.ts#L28)

```typescript
// ❌ REMOVE (Line 28)
expect(compiled.querySelector('router-outlet')).toBeTruthy();
```

**Reason:** Tests HTML structure. Router outlet presence is an implementation detail.

**Alternative:** If routing is critical, test actual route navigation:
```typescript
it('should navigate to security details', () => {
  router.navigate(['securities', '123']);
  expect(router.url).toBe('/securities/123');
});
```

---

#### 2. [src/app/layout/user-profile/user-profile.spec.ts](src/app/layout/user-profile/user-profile.spec.ts#L32-L38)

```typescript
// ❌ REMOVE (Lines 32, 38)
const profileButton = fixture.nativeElement.querySelector('button[aria-label="User profile"]');
```

**Better Alternative:**
```typescript
// ✅ Test the action, not the button query
it('should toggle dropdown when profile is clicked', () => {
  expect(component.isDropdownOpen()).toBe(false);
  component.toggleDropdown();
  expect(component.isDropdownOpen()).toBe(true);
});
```

**Reason:** Querying by ARIA label couples test to HTML structure. Test component methods directly.

---

#### 3. [src/app/app.spec.ts](src/app/app.spec.ts#L30-L36) - **REFACTOR**

```typescript
// ❌ REMOVE OR REFACTOR (Lines 30-31)
expect(compiled.querySelector('main')).toBeTruthy();
expect(compiled.querySelector('router-outlet')).toBeTruthy();
```

**Current Context:**
```typescript
it('should render main layout', () => {
  const compiled = fixture.nativeElement as HTMLElement;
  expect(compiled.querySelector('main')).toBeTruthy();
  expect(compiled.querySelector('router-outlet')).toBeTruthy();
});
```

**Options:**

**Option A - Remove Entirely (Recommended):**
- If router-outlet is present, routing will work
- If main is missing, app won't render correctly and you'll know
- These are implementation details

**Option B - Refactor to Test Behavior:**
```typescript
it('should support child route navigation', () => {
  router.navigate(['/dashboard']);
  fixture.detectChanges();
  expect(router.url).toBe('/dashboard');
});
```

**Recommendation:** Remove test. If layout is broken, functional tests will fail.

---

## 🎯 Action Plan

### Phase 1: Automated Removal (5 minutes)

Run batch removal of all "should be created" tests:

```bash
# Services
sed -i '' '/should be created/,/^  });/d' src/app/services/*.spec.ts

# App component
sed -i '' '/should create the app/,/^  });/d' src/app/app.spec.ts
```

### Phase 2: Manual Refactoring (30 minutes)

1. **sortable.directive.spec.ts**
   - Remove CSS class tests (lines 54-89)
   - Add behavior tests for sort event emission
   - Test toggle logic without checking DOM

2. **user-profile.spec.ts**
   - Remove classList assertions (lines 125-126, 134-135)
   - Remove querySelector usage (lines 32, 38)
   - Add component method tests

3. **app.spec.ts**
   - Remove querySelector assertions (lines 30-31)
   - Consider removing entire test

4. **securities.spec.ts**
   - Remove router-outlet query (line 28)

### Phase 3: Verification (10 minutes)

```bash
npm test
```

Expected outcomes:
- 23 fewer tests
- Higher test quality
- Tests survive HTML/CSS refactoring
- Faster test execution

---

## 📈 Before/After Metrics

### Before Cleanup
- Total Tests: 154
- Passing: 100 (65%)
- Tests checking framework: 7
- Tests checking CSS/DOM: 17
- **Brittle Tests: 24 (16%)**

### After Cleanup (Projected)
- Total Tests: ~131
- Passing: ~95 (72%)
- Tests checking framework: 0
- Tests checking CSS/DOM: 0
- **Brittle Tests: 0 (0%)**

**Net Benefit:**
- ✅ 16% reduction in brittle tests
- ✅ Improved maintainability
- ✅ Faster test execution
- ✅ Better focus on business logic

---

## 📚 Reference Documents

- [TESTING_GUIDELINES.md](TESTING_GUIDELINES.md) - What to test and what not to test
- [TEST_REVIEW_AND_IMPROVEMENTS.md](TEST_REVIEW_AND_IMPROVEMENTS.md) - Original analysis
- [TEST_UTILITIES_QUICK_REFERENCE.md](TEST_UTILITIES_QUICK_REFERENCE.md) - Helper functions

---

## ✅ Next Steps

1. **Review this report** with team
2. **Execute Phase 1** automated removal
3. **Execute Phase 2** manual refactoring
4. **Run tests** to verify improvements
5. **Update documentation** if needed
6. **Add to PR checklist** to prevent future anti-patterns

---

**Remember:** We're not reducing test coverage—we're improving test quality by focusing on what matters: **business logic and behavior**, not framework features and implementation details.
