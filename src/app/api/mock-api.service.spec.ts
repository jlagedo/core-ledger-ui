import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { HttpResponse } from '@angular/common/http';
import { MockApiService } from './mock-api.service';
import { ENVIRONMENT } from '../config/environment.config';
import { Fund } from '../models/fund.model';

describe('MockApiService', () => {
    let service: MockApiService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                MockApiService,
                {
                    provide: ENVIRONMENT,
                    useValue: {
                        api: { useMock: true },
                    },
                },
            ],
        });
        service = TestBed.inject(MockApiService);
    });

    describe('production safety checks', () => {
        it('should throw error if useMock is false', () => {
            TestBed.resetTestingModule();
            TestBed.configureTestingModule({
                providers: [
                    MockApiService,
                    {
                        provide: ENVIRONMENT,
                        useValue: {
                            api: { useMock: false },
                        },
                    },
                ],
            });

            expect(() => TestBed.inject(MockApiService)).toThrow(
                /MockApiService should never be used in production/
            );
        });
    });

    describe('handleListRequest', () => {
        it('should return all items without pagination params', () => {
            const params = new URLSearchParams();
            const response = service.handleListRequest<Fund>('/api/funds', params);

            expect(response).not.toBeNull();
            expect(response!.body!.items).toBeDefined();
            expect(response!.body!.items.length).toBeGreaterThan(0);
            expect(response!.body!.totalCount).toBeGreaterThan(0);
        });

        it('should support pagination with limit and offset', () => {
            const params = new URLSearchParams('limit=3&offset=2');
            const response = service.handleListRequest<Fund>('/api/funds', params);

            expect(response!.body!.items.length).toBeLessThanOrEqual(3);
        });

        it('should support sorting in ascending order', () => {
            const params = new URLSearchParams('sortBy=name&sortDirection=asc');
            const response = service.handleListRequest<Fund>('/api/funds', params);

            const names = response!.body!.items.map((f) => f.name);
            const sortedNames = [...names].sort();
            expect(names).toEqual(sortedNames);
        });

        it('should support sorting in descending order', () => {
            const params = new URLSearchParams('sortBy=name&sortDirection=desc');
            const response = service.handleListRequest<Fund>('/api/funds', params);

            const names = response!.body!.items.map((f) => f.name);
            const sortedNames = [...names].sort().reverse();
            expect(names).toEqual(sortedNames);
        });

        it('should support case-insensitive filtering', () => {
            const params = new URLSearchParams('filter=equity');
            const response = service.handleListRequest<Fund>('/api/funds', params);

            expect(response!.body!.items.length).toBeGreaterThan(0);
            response!.body!.items.forEach((fund) => {
                const searchableText = JSON.stringify(fund).toLowerCase();
                expect(searchableText).toContain('equity');
            });
        });

        it('should return null for unsupported URL', () => {
            const params = new URLSearchParams();
            const response = service.handleListRequest('/api/unsupported', params);

            expect(response).toBeNull();
        });

        it('should filter correctly across all entity fields', () => {
            const params = new URLSearchParams('filter=usd');
            const response = service.handleListRequest<Fund>('/api/funds', params);

            expect(response!.body!.items.length).toBeGreaterThan(0);
            // Search should find funds with USD in their fields
            const hasUsd = response!.body!.items.some((fund) => {
                const searchableText = JSON.stringify(fund).toLowerCase();
                return searchableText.includes('usd');
            });
            expect(hasUsd).toBe(true);
        });
    });

    describe('handleGetByIdRequest', () => {
        it('should return existing fund by ID', () => {
            const response = service.handleGetByIdRequest<Fund>('/api/funds', 1);

            expect(response.status).toBe(200);
            expect(response.body!.id).toBe(1);
        });

        it('should return 404 for non-existent ID', () => {
            const response = service.handleGetByIdRequest('/api/funds', 99999);

            expect(response.status).toBe(404);
        });

        it('should return 404 for unsupported URL', () => {
            const response = service.handleGetByIdRequest('/api/unsupported', 1);

            expect(response.status).toBe(404);
        });
    });

    describe('handleCreateRequest', () => {
        it('should create new fund with auto-incremented ID', () => {
            const newFund = {
                name: 'Test Fund',
                description: 'Test Description',
                currency: 'USD',
            };

            const response = service.handleCreateRequest<any>('/api/funds', newFund);

            expect(response.status).toBe(201);
            expect(response.body!.id).toBeDefined();
            expect(response.body!.name).toBe(newFund.name);
            expect(response.body!.createdAt).toBeDefined();
            expect(response.body!.updatedAt).toBeDefined();
        });

        it('should auto-generate sequential IDs', () => {
            const fund1 = service.handleCreateRequest<any>('/api/funds', { name: 'Fund 1' });
            const fund2 = service.handleCreateRequest<any>('/api/funds', { name: 'Fund 2' });

            expect(fund2.body!.id).toBeGreaterThan(fund1.body!.id);
        });

        it('should persist created entities', () => {
            const newFund = { name: 'Persistent Fund', currency: 'EUR' };
            const createResponse = service.handleCreateRequest<any>('/api/funds', newFund);
            const createdId = createResponse.body!.id;

            const getResponse = service.handleGetByIdRequest<Fund>('/api/funds', createdId);

            expect(getResponse.status).toBe(200);
            expect(getResponse.body!.id).toBe(createdId);
            expect(getResponse.body!.name).toBe(newFund.name);
        });

        it('should return 404 for unsupported URL', () => {
            const response = service.handleCreateRequest('/api/unsupported', {});

            expect(response.status).toBe(404);
        });
    });

    describe('handleUpdateRequest', () => {
        it('should update existing fund', () => {
            const updates = { name: 'Updated Fund Name', description: 'Updated description' };
            const response = service.handleUpdateRequest<any>('/api/funds', 1, updates);

            expect(response.status).toBe(200);
            expect(response.body!.name).toBe(updates.name);
            expect(response.body!.description).toBe(updates.description);
            expect(response.body!.updatedAt).toBeDefined();
        });

        it('should return 404 for non-existent fund', () => {
            const response = service.handleUpdateRequest('/api/funds', 99999, { name: 'Test' });

            expect(response.status).toBe(404);
        });

        it('should persist updates', () => {
            const updates = { baseCurrency: 'GBP' };
            service.handleUpdateRequest('/api/funds', 1, updates);

            const getResponse = service.handleGetByIdRequest<Fund>('/api/funds', 1);

            expect(getResponse.body!.baseCurrency).toBe('GBP');
        });

        it('should return 404 for unsupported URL', () => {
            const response = service.handleUpdateRequest('/api/unsupported', 1, {});

            expect(response.status).toBe(404);
        });
    });

    describe('handleDeleteRequest', () => {
        it('should delete existing fund', () => {
            const deleteResponse = service.handleDeleteRequest('/api/funds', 1);
            expect(deleteResponse.status).toBe(204);

            const getResponse = service.handleGetByIdRequest('/api/funds', 1);
            expect(getResponse.status).toBe(404);
        });

        it('should return 404 for non-existent fund', () => {
            const response = service.handleDeleteRequest('/api/funds', 99999);
            expect(response.status).toBe(404);
        });

        it('should return 404 for unsupported URL', () => {
            const response = service.handleDeleteRequest('/api/unsupported', 1);
            expect(response.status).toBe(404);
        });
    });

    describe('reset', () => {
        it('should reset all data to initial state', () => {
            // Modify data
            const newFund = { name: 'Temp Fund' };
            service.handleCreateRequest('/api/funds', newFund);
            service.handleDeleteRequest('/api/funds', 1);

            // Reset
            service.reset();

            // Verify reset
            const params = new URLSearchParams();
            const listResponse = service.handleListRequest<Fund>('/api/funds', params);
            const getResponse = service.handleGetByIdRequest<Fund>('/api/funds', 1);

            expect(listResponse!.body!.totalCount).toBeGreaterThan(0); // Original data restored
            expect(getResponse.status).toBe(200); // Deleted item restored
        });

        it('should reset auto-increment counters', () => {
            // Create some entities
            service.handleCreateRequest('/api/funds', { name: 'Fund 1' });
            const beforeResetId = service.handleCreateRequest<any>('/api/funds', { name: 'Fund 2' }).body!.id;

            // Reset
            service.reset();

            // Create new entity
            const afterResetId = service.handleCreateRequest<any>('/api/funds', { name: 'Fund 3' }).body!.id;

            // ID should be reset to lower value
            expect(afterResetId).toBeLessThan(beforeResetId);
        });
    });

    describe('Entity-specific handling', () => {
        it('should handle account types with string IDs', () => {
            const params = new URLSearchParams();
            const response = service.handleListRequest('/api/accounttypes', params);

            expect(response).not.toBeNull();
            expect(response!.body!.items.length).toBeGreaterThan(0);
            expect(typeof response!.body!.items[0].id).toBe('string');
        });

        it('should handle all supported entity types', () => {
            const urls = [
                '/api/funds',
                '/api/accounts',
                '/api/accounttypes',
                '/api/securities',
                '/api/securitytypes',
                '/api/users',
            ];

            urls.forEach((url) => {
                const params = new URLSearchParams();
                const response = service.handleListRequest(url, params);
                expect(response).not.toBeNull();
                expect(response!.body!.items).toBeDefined();
                expect(response!.body!.totalCount).toBeGreaterThan(0);
            });
        });
    });

    describe('Edge cases', () => {
        it('should handle empty search results', () => {
            const params = new URLSearchParams('filter=XYZ_NONEXISTENT_TERM_XYZ');
            const response = service.handleListRequest<Fund>('/api/funds', params);

            expect(response!.body!.items.length).toBe(0);
            expect(response!.body!.totalCount).toBe(0);
        });

        it('should handle large offset gracefully', () => {
            const params = new URLSearchParams('limit=10&offset=1000');
            const response = service.handleListRequest<Fund>('/api/funds', params);

            expect(response!.body!.items.length).toBe(0);
        });

        it('should handle partial updates without overwriting entire object', () => {
            const originalFund = service.handleGetByIdRequest<Fund>('/api/funds', 1).body!;
            const originalCurrency = originalFund.baseCurrency;

            const partialUpdate = { name: 'Only Name Updated' };
            service.handleUpdateRequest('/api/funds', 1, partialUpdate);

            const updatedFund = service.handleGetByIdRequest<Fund>('/api/funds', 1).body!;

            expect(updatedFund.name).toBe('Only Name Updated');
            expect(updatedFund.baseCurrency).toBe(originalCurrency); // Should remain unchanged
        });
    });
});
