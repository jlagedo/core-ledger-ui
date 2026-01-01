import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { SecurityService } from './security';
import { CreateSecurity, PaginatedResponse, Security, UpdateSecurity } from '../models/security.model';
import { SecurityType } from '../models/security-type.model';
import { provideTestDependencies } from '../testing/test-helpers';

describe('SecurityService', () => {
  let service: SecurityService;
  let httpMock: HttpTestingController;
  const apiUrl = '/api';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [...provideTestDependencies(), provideHttpClientTesting()]
    });
    service = TestBed.inject(SecurityService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should get securities with pagination and filters', () => {
    const mockResponse = {
      items: [{ id: 1, ticker: 'AAPL', name: 'Apple Inc.', typeId: 1 }] as unknown as Security[],
      totalCount: 1,
      limit: 100,
      offset: 0
    } as PaginatedResponse<Security>;

    service.getSecurities(100, 0, 'ticker', 'asc', 'AAPL').subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(response.items.length).toBe(1);
    });

    const req = httpMock.expectOne(request =>
      request.url.includes('/api/securities') &&
      request.url.includes('limit=100') &&
      request.url.includes('offset=0') &&
      request.url.includes('sortBy=ticker') &&
      request.url.includes('sortDirection=asc') &&
      request.url.includes('filter=AAPL')
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get security by id', () => {
    const mockSecurity = { id: 1, ticker: 'AAPL', name: 'Apple Inc.', typeId: 1 } as unknown as Security;

    service.getSecurityById(1).subscribe(security => {
      expect(security).toEqual(mockSecurity);
    });

    const req = httpMock.expectOne(`${apiUrl}/securities/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockSecurity);
  });

  it('should create security', () => {
    const createSecurity = { ticker: 'MSFT', name: 'Microsoft', typeId: 1 } as unknown as CreateSecurity;
    const mockResponse = { id: 1, ...createSecurity } as unknown as Security;

    service.createSecurity(createSecurity).subscribe(security => {
      expect(security).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/securities`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(createSecurity);
    req.flush(mockResponse);
  });

  it('should update security', () => {
    const updateSecurity = { name: 'Microsoft Corp' } as unknown as UpdateSecurity;

    service.updateSecurity(1, updateSecurity).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/securities/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updateSecurity);
    req.flush(null);
  });

  it('should deactivate security', () => {
    service.deactivateSecurity(1).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/securities/1/deactivate`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toBeNull();
    req.flush(null);
  });

  it('should handle deactivate security error', () => {
    return new Promise<void>((resolve) => {
      service.deactivateSecurity(1).subscribe({
        error: (error) => {
          expect(error.status).toBe(400);
          resolve();
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/securities/1/deactivate`);
      req.flush({ message: 'Cannot deactivate' }, { status: 400, statusText: 'Bad Request' });
    });
  });

  it('should get security types', () => {
    const mockTypes = [
      { name: 'Stock', description: 'Common Stock' },
      { name: 'Bond', description: 'Corporate Bond' }
    ] as unknown as SecurityType[];

    service.getSecurityTypes().subscribe(types => {
      expect(types).toEqual(mockTypes);
      expect(types.length).toBe(2);
    });

    const req = httpMock.expectOne(`${apiUrl}/securitytypes`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTypes);
  });
});
