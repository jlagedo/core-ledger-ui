import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { HttpClient, HttpErrorResponse, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { mockApiInterceptor } from './mock-api.interceptor';
import { MockApiService } from './mock-api.service';
import { ENVIRONMENT } from '../config/environment.config';

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
        it('should intercept /api/securities requests', async () => {
            const response = await firstValueFrom(httpClient.get<any>('/api/securities'));

            expect(response.items).toBeDefined();
            expect(Array.isArray(response.items)).toBe(true);

            // No pending requests because interceptor handles it
            httpMock.expectNone('/api/securities');
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

            httpClient.get('/api/securities').subscribe();

            const req = httpMock.expectOne('/api/securities');
            expect(req.request.method).toBe('GET');
            req.flush({ items: [], totalCount: 0, limit: 10, offset: 0 });
        });
    });

    describe('GET list requests', () => {
        it('should return paginated securities list', async () => {
            const response = await firstValueFrom(httpClient.get<any>('/api/securities?limit=5&offset=0'));

            expect(response.items).toBeDefined();
            expect(response.totalCount).toBeGreaterThan(0);
            expect(response.items.length).toBeLessThanOrEqual(5);

            httpMock.expectNone('/api/securities');
        });

        it('should support sorting', async () => {
            const response = await firstValueFrom(httpClient.get<any>('/api/securities?sortBy=codigo&sortDirection=asc'));

            const codes = response.items.map((s: any) => s.codigo);
            const sortedCodes = [...codes].sort();
            expect(codes).toEqual(sortedCodes);

            httpMock.expectNone('/api/securities');
        });

        it('should support filtering', async () => {
            const response = await firstValueFrom(httpClient.get<any>('/api/securities?filter=security'));

            expect(response.items.length).toBeGreaterThan(0);
            response.items.forEach((security: any) => {
                const searchableText = JSON.stringify(security).toLowerCase();
                expect(searchableText).toContain('security');
            });

            httpMock.expectNone('/api/securities');
        });
    });

    describe('GET by ID requests', () => {
        it('should return a single security by ID', async () => {
            const security = await firstValueFrom(httpClient.get<any>('/api/securities/1'));

            expect(security).toBeDefined();
            expect(security.id).toBe(1);

            httpMock.expectNone('/api/securities/1');
        });

        it('should return 404 for non-existent ID', async () => {
            try {
                await firstValueFrom(httpClient.get('/api/securities/99999'));
                throw new Error('Should have returned 404');
            } catch (error) {
                expect((error as HttpErrorResponse).status).toBe(404);
            }

            httpMock.expectNone('/api/securities/99999');
        });
    });

    describe('POST requests', () => {
        it('should create a new security', async () => {
            const newSecurity = {
                codigo: 'NEWSEC',
                descricao: 'Test Security',
                tipo: 'Equity',
            };

            const security = await firstValueFrom(httpClient.post<any>('/api/securities', newSecurity));

            expect(security).toBeDefined();
            expect(security.id).toBeDefined();
            expect(security.codigo).toBe(newSecurity.codigo);
            expect(security.createdAt).toBeDefined();

            httpMock.expectNone('/api/securities');
        });

        it('should persist created entities', async () => {
            const newSecurity = {
                codigo: 'PERSIST',
                descricao: 'Persistence Test Security',
            };

            const createdSecurity = await firstValueFrom(httpClient.post<any>('/api/securities', newSecurity));
            const createdId = createdSecurity.id;

            // Verify it can be retrieved
            const retrievedSecurity = await firstValueFrom(httpClient.get<any>(`/api/securities/${createdId}`));

            expect(retrievedSecurity.id).toBe(createdId);
            expect(retrievedSecurity.codigo).toBe(newSecurity.codigo);

            httpMock.expectNone('/api/securities');
        });
    });

    describe('PUT/PATCH requests', () => {
        it('should update an existing security', async () => {
            const updates = { descricao: 'Updated Security Description' };

            const security = await firstValueFrom(httpClient.put<any>('/api/securities/1', updates));

            expect(security.descricao).toBe('Updated Security Description');
            expect(security.updatedAt).toBeDefined();

            httpMock.expectNone('/api/securities/1');
        });

        it('should return 404 when updating non-existent security', async () => {
            try {
                await firstValueFrom(httpClient.put('/api/securities/99999', { descricao: 'Test' }));
                throw new Error('Should have returned 404');
            } catch (error) {
                expect((error as HttpErrorResponse).status).toBe(404);
            }

            httpMock.expectNone('/api/securities/99999');
        });

        it('should persist updates', async () => {
            const updates = { tipo: 'Updated' };

            await firstValueFrom(httpClient.put<any>('/api/securities/1', updates));

            // Verify update persisted
            const security = await firstValueFrom(httpClient.get<any>('/api/securities/1'));
            expect(security.tipo).toBe('Updated');

            httpMock.expectNone('/api/securities/1');
        });
    });

    describe('DELETE requests', () => {
        it('should delete an existing security', async () => {
            await firstValueFrom(httpClient.delete('/api/securities/1'));

            // Verify deletion
            try {
                await firstValueFrom(httpClient.get('/api/securities/1'));
                throw new Error('Should have returned 404');
            } catch (error) {
                expect((error as HttpErrorResponse).status).toBe(404);
            }

            httpMock.expectNone('/api/securities/1');
        });

        it('should return 404 when deleting non-existent security', async () => {
            try {
                await firstValueFrom(httpClient.delete('/api/securities/99999'));
                throw new Error('Should have returned 404');
            } catch (error) {
                expect((error as HttpErrorResponse).status).toBe(404);
            }

            httpMock.expectNone('/api/securities/99999');
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
                await firstValueFrom(httpClient.get('/api/securities'));
                throw new Error('Should have thrown error');
            } catch (error) {
                expect((error as HttpErrorResponse).status).toBeGreaterThanOrEqual(500);
            }

            httpMock.expectNone('/api/securities');
        });

        it('should force specific error via query param', async () => {
            try {
                await firstValueFrom(httpClient.get('/api/securities?mock-error=403'));
                throw new Error('Should have thrown 403 error');
            } catch (error) {
                const httpError = error as HttpErrorResponse;
                expect(httpError.status).toBe(403);
                expect(httpError.error.error).toContain('Forbidden');
            }

            httpMock.expectNone('/api/securities');
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

            await firstValueFrom(httpClient.get('/api/securities'));

            const elapsed = Date.now() - startTime;
            expect(elapsed).toBeGreaterThanOrEqual(100);

            httpMock.expectNone('/api/securities');
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
