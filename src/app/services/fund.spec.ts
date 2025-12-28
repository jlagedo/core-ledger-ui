import {TestBed} from '@angular/core/testing';
import {provideHttpClient} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';

import {FundService} from './fund';
import {CreateFund, Fund, PaginatedResponse, UpdateFund} from '../models/fund.model';
import {API_URL} from '../config/api.config';

describe('FundService', () => {
  let service: FundService;
  let httpMock: HttpTestingController;
  const apiUrl = '/api';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {provide: API_URL, useValue: apiUrl}
      ]
    });
    service = TestBed.inject(FundService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get funds with pagination and filters', () => {
    const mockResponse: PaginatedResponse<Fund> = {
      items: [{id: 1, name: 'Test Fund', description: 'Test', baseCurrencyCode: 'USD'}] as unknown as Fund[],
      totalCount: 1,
      limit: 100,
      offset: 0
    };

    service.getFunds(100, 0, 'name', 'asc', 'test').subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(response.items.length).toBe(1);
    });

    const req = httpMock.expectOne(request =>
      request.url.includes('/api/funds') &&
      request.url.includes('limit=100') &&
      request.url.includes('offset=0') &&
      request.url.includes('sortBy=name') &&
      request.url.includes('sortDirection=asc') &&
      request.url.includes('filter=test')
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get fund by id', () => {
    const mockFund = {id: 1, name: 'Test Fund', description: 'Test', baseCurrencyCode: 'USD'} as unknown as Fund;

    service.getFundById(1).subscribe(fund => {
      expect(fund).toEqual(mockFund);
    });

    const req = httpMock.expectOne(`${apiUrl}/funds/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockFund);
  });

  it('should create fund', () => {
    const createFund = {name: 'New Fund', description: 'Test', baseCurrencyCode: 'USD'} as unknown as CreateFund;
    const mockResponse = {id: 1, ...createFund} as unknown as Fund;

    service.createFund(createFund).subscribe(fund => {
      expect(fund).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/funds`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(createFund);
    req.flush(mockResponse);
  });

  it('should update fund', () => {
    const updateFund = {name: 'Updated Fund', description: 'Updated'} as unknown as UpdateFund;

    service.updateFund(1, updateFund).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/funds/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updateFund);
    req.flush(null);
  });
});
