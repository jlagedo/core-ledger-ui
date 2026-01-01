import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import { FundService } from './fund';
import { CreateFund, Fund, PaginatedResponse, UpdateFund } from '../models/fund.model';
import { API_URL } from '../config/api.config';
import { expectHttpRequest, FundBuilder, createMockPaginatedResponse } from '../testing/test-helpers';

describe('FundService', () => {
  let service: FundService;
  let httpMock: HttpTestingController;
  const apiUrl = '/api';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_URL, useValue: apiUrl }
      ]
    });
    service = TestBed.inject(FundService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getFunds', () => {
    it('should get funds with pagination and filters', () => {
      const mockFund = new FundBuilder()
        .withId(1)
        .withName('Test Fund')
        .build();

      const mockResponse = createMockPaginatedResponse([mockFund], 1, 100, 0);

      service.getFunds(100, 0, 'name', 'asc', 'test').subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(response.items.length).toBe(1);
      });

      const req = expectHttpRequest(httpMock, 'GET', /\/api\/funds\?/);
      expect(req.request.url).toContain('limit=100');
      expect(req.request.url).toContain('offset=0');
      expect(req.request.url).toContain('sortBy=name');
      expect(req.request.url).toContain('sortDirection=asc');
      expect(req.request.url).toContain('filter=test');
      req.flush(mockResponse);
    });

    it('should handle empty results', () => {
      const mockResponse = createMockPaginatedResponse([], 0, 100, 0);

      service.getFunds(100, 0).subscribe(response => {
        expect(response.items.length).toBe(0);
        expect(response.totalCount).toBe(0);
      });

      expectHttpRequest(httpMock, 'GET', /\/api\/funds\?/).flush(mockResponse);
    });
  });

  describe('getFundById', () => {
    it('should get fund by id', () => {
      const mockFund = new FundBuilder()
        .withId(1)
        .withName('Test Fund')
        .build();

      service.getFundById(1).subscribe(fund => {
        expect(fund).toEqual(mockFund);
      });

      expectHttpRequest(httpMock, 'GET', `${apiUrl}/funds/1`).flush(mockFund);
    });
  });

  describe('createFund', () => {
    it('should create fund', () => {
      const createFund = {
        name: 'New Fund',
        description: 'Test',
        baseCurrencyCode: 'USD'
      } as unknown as CreateFund;

      const mockResponse = new FundBuilder()
        .withId(1)
        .withName('New Fund')
        .build();

      service.createFund(createFund).subscribe(fund => {
        expect(fund).toEqual(mockResponse);
      });

      const req = expectHttpRequest(httpMock, 'POST', `${apiUrl}/funds`);
      expect(req.request.body).toEqual(createFund);
      req.flush(mockResponse);
    });
  });

  describe('updateFund', () => {
    it('should update fund', () => {
      const updateFund = {
        name: 'Updated Fund',
        description: 'Updated'
      } as unknown as UpdateFund;

      service.updateFund(1, updateFund).subscribe();

      const req = expectHttpRequest(httpMock, 'PUT', `${apiUrl}/funds/1`);
      expect(req.request.body).toEqual(updateFund);
      req.flush(null);
    });
  });
});
