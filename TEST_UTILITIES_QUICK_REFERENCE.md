# Test Utilities Quick Reference

**Location:** `src/app/testing/test-helpers.ts`

Quick guide to using the new test utilities in your tests.

---

## 1. `provideTestDependencies()`

**What it does:** Provides all common test providers (Router, HTTP, Auth, Sentry, etc.)

**When to use:** In every component or service test

**Example:**
```typescript
beforeEach(async () => {
  await TestBed.configureTestingModule({
    imports: [MyComponent],
    providers: [provideTestDependencies()],
  }).compileComponents();
});
```

**Includes:**
- Router
- Location mocks
- HTTP Client
- Auth (OIDC)
- MicroSentryService mock

---

## 2. `setupLocalStorageMock()`

**What it does:** Creates a mocked localStorage with cleanup

**When to use:** When testing services that use localStorage (ThemeService, etc.)

**Example:**
```typescript
let storageMock: ReturnType<typeof setupLocalStorageMock>;

beforeEach(() => {
  storageMock = setupLocalStorageMock();
  TestBed.configureTestingModule({...});
});

afterEach(() => {
  storageMock.clear();
});

// In test:
storageMock.store.set('key', 'value');
expect(storageMock.store.get('key')).toBe('value');
```

---

## 3. `createMockService<T>()`

**What it does:** Creates a typed mock service object

**When to use:** For mocking service dependencies

**Example:**
```typescript
const mockLogger = createMockService({
  debug: vi.fn(),
  info: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
});

TestBed.configureTestingModule({
  providers: [
    { provide: LoggerService, useValue: mockLogger },
  ]
});
```

---

## 4. `expectHttpRequest()`

**What it does:** Expects an HTTP request with cleaner syntax

**When to use:** In HTTP service tests instead of `httpMock.expectOne()`

**Example:**
```typescript
const req = expectHttpRequest(httpMock, 'GET', '/api/funds');
// OR with regex:
const req = expectHttpRequest(httpMock, 'GET', /\/api\/funds\?/);

expect(req.request.url).toContain('limit=100');
req.flush(mockResponse);
```

**vs Traditional:**
```typescript
// More verbose:
const req = httpMock.expectOne(request =>
  request.url.includes('/api/funds') &&
  request.url.includes('limit=100') &&
  request.method === 'GET'
);
```

---

## 5. `FundBuilder`

**What it does:** Builder for creating test Fund objects

**When to use:** In any test that needs Fund test data

**Example:**
```typescript
const fund = new FundBuilder()
  .withId(1)
  .withName('Test Fund')
  .withDescription('A test fund')
  .withBaseCurrency('USD')
  .build();

// vs without builder:
const fund = {
  id: 1,
  name: 'Test Fund',
  description: 'A test fund',
  baseCurrencyCode: 'USD'
};
```

**Available Methods:**
- `.withId(id: number)`
- `.withName(name: string)`
- `.withDescription(description: string)`
- `.withBaseCurrency(code: string)`
- `.build()` - Returns the object

---

## 6. `createMockPaginatedResponse<T>()`

**What it does:** Creates a properly typed paginated response

**When to use:** For mocking API responses in service tests

**Example:**
```typescript
const funds = [
  new FundBuilder().withId(1).build(),
  new FundBuilder().withId(2).build(),
];

const response = createMockPaginatedResponse(funds, 2, 100, 0);

expect(response.items.length).toBe(2);
expect(response.totalCount).toBe(2);
expect(response.limit).toBe(100);
expect(response.offset).toBe(0);
```

**Parameters:**
- `items: T[]` - Array of items
- `totalCount: number` - Total count
- `limit?: number` - Default: 100
- `offset?: number` - Default: 0

---

## Common Test Patterns

### Service Test with HTTP
```typescript
describe('FundService', () => {
  let service: FundService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_URL, useValue: '/api' }
      ]
    });
    service = TestBed.inject(FundService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should get funds', () => {
    const funds = [new FundBuilder().withId(1).build()];
    const response = createMockPaginatedResponse(funds, 1);

    service.getFunds(100, 0).subscribe(result => {
      expect(result.items.length).toBe(1);
    });

    const req = expectHttpRequest(httpMock, 'GET', /\/api\/funds/);
    req.flush(response);
  });
});
```

### Service Test with Storage
```typescript
describe('ThemeService', () => {
  let service: ThemeService;
  let storageMock: ReturnType<typeof setupLocalStorageMock>;

  beforeEach(() => {
    storageMock = setupLocalStorageMock();
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
  });

  afterEach(() => {
    storageMock.clear();
  });

  it('should persist theme', () => {
    service.setTheme('light');
    expect(storageMock.store.get('core-ledger-theme')).toBe('light');
  });
});
```

### Component Test
```typescript
describe('FundList', () => {
  let component: FundList;
  let fixture: ComponentFixture<FundList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FundList],
      providers: [provideTestDependencies()],
    }).compileComponents();

    fixture = TestBed.createComponent(FundList);
    component = fixture.componentInstance;
  });

  it('should display funds', () => {
    const fund = new FundBuilder().withId(1).build();
    component.funds.set([fund]);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Test Fund');
  });
});
```

---

## Tips & Tricks

### ✅ Do's
- Use builders for complex test data
- Group related tests with describe blocks
- Clear mocks in afterEach
- Use `provideTestDependencies()` in all component tests
- Use regex in `expectHttpRequest()` when matching URLs with parameters

### ❌ Don'ts
- Don't manually mock localStorage - use `setupLocalStorageMock()`
- Don't repeat mock setup - extract to beforeEach
- Don't use `TestBed.inject()` before `TestBed.configureTestingModule()`
- Don't forget to call `httpMock.verify()` in afterEach
- Don't test implementation details - test behavior

---

## Extending the Utilities

### Adding a New Builder

```typescript
export class AccountBuilder {
  private data: Record<string, any> = {
    id: Math.random(),
    name: 'Test Account',
    number: '001',
  };

  withId(id: number): AccountBuilder {
    this.data.id = id;
    return this;
  }

  withName(name: string): AccountBuilder {
    this.data.name = name;
    return this;
  }

  build() {
    return this.data;
  }
}
```

### Adding a New Mock Helper

```typescript
export function createMockRouter() {
  return {
    navigate: vi.fn(),
    navigateByUrl: vi.fn(),
    url: '/test',
  };
}
```

---

## Troubleshooting

### "Cannot configure the test module when already instantiated"
**Cause:** `TestBed.inject()` called before `TestBed.configureTestingModule()`

**Fix:** Move `configureTestingModule()` to first line of beforeEach

### "No provider found for X"
**Cause:** Missing provider in configureTestingModule

**Fix:** Add to providers or use `provideTestDependencies()`

### "httpMock.verify() failed"
**Cause:** Unflushed HTTP requests

**Fix:** Make sure all expected requests are matched and flushed

### "Storage is not defined"
**Cause:** Calling storage without `setupLocalStorageMock()`

**Fix:** Call `setupLocalStorageMock()` in beforeEach

---

## Quick Checklist

- [ ] Using `provideTestDependencies()` in component tests?
- [ ] Using `setupLocalStorageMock()` for localStorage tests?
- [ ] Using builders for test data?
- [ ] Using `expectHttpRequest()` for HTTP tests?
- [ ] Clearing mocks in `afterEach()`?
- [ ] Calling `httpMock.verify()` in `afterEach()`?
- [ ] Calling `storageMock.clear()` in `afterEach()`?
- [ ] Grouping tests with `describe()` blocks?
- [ ] Descriptive test names?

---

**For more details, see `TEST_REVIEW_AND_IMPROVEMENTS.md`**
