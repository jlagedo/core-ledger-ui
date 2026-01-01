import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { HttpClient, HttpErrorResponse, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { mockApiInterceptor } from './mock-api.interceptor';
import { MockApiService } from './mock-api.service';
import { ENVIRONMENT } from '../config/environment.config';
import { Fund } from '../models/fund.model';

describe('mockApiInterceptor', () => {
    let httpClient: HttpClient;
    let httpMock: HttpTestingController;
    let mockApiService: MockApiService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(withInterceptors([mockApiInterceptor])),
                provideHttpClientTesting(),
                MockApiService,
                {
                    provide: ENVIRONMENT,
                    useValue: {
                        api: { useMock: true, mockDelayMs: 0, mockErrorRate: 0 },
                    },
                },
            ],
        });

        httpClient = TestBed.inject(HttpClient);
        httpMock = TestBed.inject(HttpTestingController);
        mockApiService = TestBed.inject(MockApiService);
    });

    afterEach(() => {
        httpMock.verify();
    });

    describe('URL pattern matching', () => {
        it('should intercept /api/funds requests', async () => {
            const response = await firstValueFrom(httpClient.get<any>('/api/funds'));

            expect(response.items).toBeDefined();
            expect(Array.isArray(response.items)).toBe(true);

            // No pending requests because interceptor handles it
            httpMock.expectNone('/api/funds');
        });

        it('should intercept /api/accounts requests', async () => {
            const response = await firstValueFrom(httpClient.get<any>('/api/accounts'));

            expect(response.items).toBeDefined();

            httpMock.expectNone('/api/accounts');
        });

        it('should NOT intercept non-API requests', () => {
            httpClient.get('/assets/config.json').subscribe();

            const req = httpMock.expectOne('/assets/config.json');
            expect(req.request.method).toBe('GET');
            req.flush({ data: 'test' });
        });

        it('should NOT intercept when useMock is false', () => {
            TestBed.resetTestingModule();
            TestBed.configureTestingModule({
                providers: [
                    provideHttpClient(withInterceptors([mockApiInterceptor])),
                    provideHttpClientTesting(),
                    {
                        provide: ENVIRONMENT,
                        useValue: {
                            api: { useMock: false },
                        },
                    },
                ],
            });

            httpClient = TestBed.inject(HttpClient);
            httpMock = TestBed.inject(HttpTestingController);

            httpClient.get('/api/funds').subscribe();

            const req = httpMock.expectOne('/api/funds');
            expect(req.request.method).toBe('GET');
            req.flush({ items: [], totalCount: 0, limit: 10, offset: 0 });
        });
    });

    describe('GET list requests', () => {
        it('should return paginated funds list', async () => {
            const response = await firstValueFrom(httpClient.get<any>('/api/funds?limit=5&offset=0'));

            expect(response.items).toBeDefined();
            expect(response.totalCount).toBeGreaterThan(0);
            expect(response.items.length).toBeLessThanOrEqual(5);

            httpMock.expectNone('/api/funds');
        });

        it('should support sorting', async () => {
            const response = await firstValueFrom(httpClient.get<any>('/api/funds?sortBy=name&sortDirection=asc'));

            const names = response.items.map((f: Fund) => f.name);
            const sortedNames = [...names].sort();
            expect(names).toEqual(sortedNames);

            httpMock.expectNone('/api/funds');
        });

        it('should support filtering', async () => {
            const response = await firstValueFrom(httpClient.get<any>('/api/funds?filter=equity'));

            expect(response.items.length).toBeGreaterThan(0);
            response.items.forEach((fund: Fund) => {
                const searchableText = JSON.stringify(fund).toLowerCase();
                expect(searchableText).toContain('equity');
            });

            httpMock.expectNone('/api/funds');
        });
    });

    describe('GET by ID requests', () => {
        it('should return a single fund by ID', async () => {
            const fund = await firstValueFrom(httpClient.get<Fund>('/api/funds/1'));

            expect(fund).toBeDefined();
            expect(fund.id).toBe(1);

            httpMock.expectNone('/api/funds/1');
        });

        it('should return 404 for non-existent ID', async () => {
            try {
                await firstValueFrom(httpClient.get('/api/funds/99999'));
                throw new Error('Should have returned 404');
            } catch (error) {
                expect((error as HttpErrorResponse).status).toBe(404);
            }

            httpMock.expectNone('/api/funds/99999');
        });
    });

    describe('POST requests', () => {
        it('should create a new fund', async () => {
            const newFund = {
                code: 'TST',
                name: 'Test Fund',
                baseCurrency: 'USD',
                inceptionDate: '2024-01-01',
                valuationFrequency: 1,
            };

            const fund = await firstValueFrom(httpClient.post<Fund>('/api/funds', newFund));

            expect(fund).toBeDefined();
            expect(fund.id).toBeDefined();
            expect(fund.name).toBe(newFund.name);
            expect(fund.createdAt).toBeDefined();

            httpMock.expectNone('/api/funds');
        });

        it('should persist created entities', async () => {
            const newFund = {
                name: 'Persistence Test Fund',
                baseCurrency: 'EUR',
            };

            const createdFund = await firstValueFrom(httpClient.post<Fund>('/api/funds', newFund));
            const createdId = createdFund.id;

            // Verify it can be retrieved
            const retrievedFund = await firstValueFrom(httpClient.get<Fund>(`/api/funds/${createdId}`));

            expect(retrievedFund.id).toBe(createdId);
            expect(retrievedFund.name).toBe(newFund.name);

            httpMock.expectNone('/api/funds');
        });
    });

    describe('PUT/PATCH requests', () => {
        it('should update an existing fund', async () => {
            const updates = { name: 'Updated Fund Name' };

            const fund = await firstValueFrom(httpClient.put<Fund>('/api/funds/1', updates));

            expect(fund.name).toBe('Updated Fund Name');
            expect(fund.updatedAt).toBeDefined();

            httpMock.expectNone('/api/funds/1');
        });

        it('should return 404 when updating non-existent fund', async () => {
            try {
                await firstValueFrom(httpClient.put('/api/funds/99999', { name: 'Test' }));
                throw new Error('Should have returned 404');
            } catch (error) {
                expect((error as HttpErrorResponse).status).toBe(404);
            }

            httpMock.expectNone('/api/funds/99999');
        });

        it('should persist updates', async () => {
            const updates = { code: 'UPD' };

            await firstValueFrom(httpClient.put<Fund>('/api/funds/1', updates));

            // Verify update persisted
            const fund = await firstValueFrom(httpClient.get<Fund>('/api/funds/1'));
            expect(fund.code).toBe('UPD');

            httpMock.expectNone('/api/funds/1');
        });
    });

    describe('DELETE requests', () => {
        it('should delete an existing fund', async () => {
            await firstValueFrom(httpClient.delete('/api/funds/1'));

            // Verify deletion
            try {
                await firstValueFrom(httpClient.get('/api/funds/1'));
                throw new Error('Should have returned 404');
            } catch (error) {
                expect((error as HttpErrorResponse).status).toBe(404);
            }

            httpMock.expectNone('/api/funds/1');
        });

        it('should return 404 when deleting non-existent fund', async () => {
            try {
                await firstValueFrom(httpClient.delete('/api/funds/99999'));
                throw new Error('Should have returned 404');
            } catch (error) {
                expect((error as HttpErrorResponse).status).toBe(404);
            }

            httpMock.expectNone('/api/funds/99999');
        });
    });

    describe('Error simulation', () => {
        it('should simulate random errors based on mockErrorRate', async () => {
            TestBed.resetTestingModule();
            TestBed.configureTestingModule({
                providers: [
                    provideHttpClient(withInterceptors([mockApiInterceptor])),
                    provideHttpClientTesting(),
                    MockApiService,
                    {
                        provide: ENVIRONMENT,
                        useValue: {
                            api: { useMock: true, mockDelayMs: 0, mockErrorRate: 1 }, // 100% error rate
                        },
                    },
                ],
            });

            httpClient = TestBed.inject(HttpClient);
            httpMock = TestBed.inject(HttpTestingController);

            try {
                await firstValueFrom(httpClient.get('/api/funds'));
                throw new Error('Should have thrown error');
            } catch (error) {
                expect((error as HttpErrorResponse).status).toBeGreaterThanOrEqual(500);
            }

            httpMock.expectNone('/api/funds');
        });

        it('should force specific error via query param', async () => {
            try {
                await firstValueFrom(httpClient.get('/api/funds?mock-error=403'));
                throw new Error('Should have thrown 403 error');
            } catch (error) {
                const httpError = error as HttpErrorResponse;
                expect(httpError.status).toBe(403);
                expect(httpError.error.error).toContain('Forbidden');
            }

            httpMock.expectNone('/api/funds');
        });
    });

    describe('Response delay simulation', () => {
        it('should delay responses based on mockDelayMs', async () => {
            TestBed.resetTestingModule();
            TestBed.configureTestingModule({
                providers: [
                    provideHttpClient(withInterceptors([mockApiInterceptor])),
                    provideHttpClientTesting(),
                    MockApiService,
                    {
                        provide: ENVIRONMENT,
                        useValue: {
                            api: { useMock: true, mockDelayMs: 100, mockErrorRate: 0 },
                        },
                    },
                ],
            });

            httpClient = TestBed.inject(HttpClient);
            httpMock = TestBed.inject(HttpTestingController);

            const startTime = Date.now();

            await firstValueFrom(httpClient.get('/api/funds'));

            const elapsed = Date.now() - startTime;
            expect(elapsed).toBeGreaterThanOrEqual(100);

            httpMock.expectNone('/api/funds');
        });
    });

    describe('Unsupported URL patterns', () => {
        it('should return 404 for unsupported endpoints', async () => {
            try {
                await firstValueFrom(httpClient.get('/api/unsupported'));
                throw new Error('Should have returned 404');
            } catch (error) {
                const httpError = error as HttpErrorResponse;
                expect(httpError.status).toBe(404);
                expect(httpError.error.error).toContain('Unsupported');
            }

            httpMock.expectNone('/api/unsupported');
        });
    });
});
