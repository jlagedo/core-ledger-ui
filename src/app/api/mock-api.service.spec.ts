import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { HttpResponse } from '@angular/common/http';
import { MockApiService } from './mock-api.service';
import { ENVIRONMENT } from '../config/environment.config';

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
            const response = service.handleListRequest<any>('/api/securities', params);

            expect(response).not.toBeNull();
            expect(response!.body!.items).toBeDefined();
            expect(response!.body!.items.length).toBeGreaterThan(0);
            expect(response!.body!.totalCount).toBeGreaterThan(0);
        });

        it('should support pagination with limit and offset', () => {
            const params = new URLSearchParams('limit=3&offset=2');
            const response = service.handleListRequest<any>('/api/securities', params);

            expect(response!.body!.items.length).toBeLessThanOrEqual(3);
        });

        it('should support sorting in ascending order', () => {
            const params = new URLSearchParams('sortBy=codigo&sortDirection=asc');
            const response = service.handleListRequest<any>('/api/securities', params);

            const codes = response!.body!.items.map((s) => s.codigo);
            const sortedCodes = [...codes].sort();
            expect(codes).toEqual(sortedCodes);
        });

        it('should support sorting in descending order', () => {
            const params = new URLSearchParams('sortBy=codigo&sortDirection=desc');
            const response = service.handleListRequest<any>('/api/securities', params);

            const codes = response!.body!.items.map((s) => s.codigo);
            const sortedCodes = [...codes].sort().reverse();
            expect(codes).toEqual(sortedCodes);
        });

        it('should support case-insensitive filtering', () => {
            const params = new URLSearchParams('filter=security');
            const response = service.handleListRequest<any>('/api/securities', params);

            expect(response!.body!.items.length).toBeGreaterThan(0);
            response!.body!.items.forEach((security) => {
                const searchableText = JSON.stringify(security).toLowerCase();
                expect(searchableText).toContain('security');
            });
        });

        it('should return null for unsupported URL', () => {
            const params = new URLSearchParams();
            const response = service.handleListRequest('/api/unsupported', params);

            expect(response).toBeNull();
        });

        it('should filter correctly across all entity fields', () => {
            const params = new URLSearchParams('filter=security');
            const response = service.handleListRequest<any>('/api/securities', params);

            expect(response!.body!.items.length).toBeGreaterThan(0);
            // Search should find securities with "security" in their fields
            const hasKeyword = response!.body!.items.some((security) => {
                const searchableText = JSON.stringify(security).toLowerCase();
                return searchableText.includes('security');
            });
            expect(hasKeyword).toBe(true);
        });
    });

    describe('handleGetByIdRequest', () => {
        it('should return existing security by ID', () => {
            const response = service.handleGetByIdRequest<any>('/api/securities', 1);

            expect(response.status).toBe(200);
            expect(response.body!.id).toBe(1);
        });

        it('should return 404 for non-existent ID', () => {
            const response = service.handleGetByIdRequest('/api/securities', 99999);

            expect(response.status).toBe(404);
        });

        it('should return 404 for unsupported URL', () => {
            const response = service.handleGetByIdRequest('/api/unsupported', 1);

            expect(response.status).toBe(404);
        });
    });

    describe('handleCreateRequest', () => {
        it('should create new security with auto-incremented ID', () => {
            const newSecurity = {
                codigo: 'NEWS',
                descricao: 'Test Security',
                tipo: 'Equity',
            };

            const response = service.handleCreateRequest<any>('/api/securities', newSecurity);

            expect(response.status).toBe(201);
            expect(response.body!.id).toBeDefined();
            expect(response.body!.codigo).toBe(newSecurity.codigo);
            expect(response.body!.createdAt).toBeDefined();
            expect(response.body!.updatedAt).toBeDefined();
        });

        it('should auto-generate sequential IDs', () => {
            const security1 = service.handleCreateRequest<any>('/api/securities', { codigo: 'SEC1' });
            const security2 = service.handleCreateRequest<any>('/api/securities', { codigo: 'SEC2' });

            expect(security2.body!.id).toBeGreaterThan(security1.body!.id);
        });

        it('should persist created entities', () => {
            const newSecurity = { codigo: 'PERSIST', descricao: 'Persistent Security' };
            const createResponse = service.handleCreateRequest<any>('/api/securities', newSecurity);
            const createdId = createResponse.body!.id;

            const getResponse = service.handleGetByIdRequest<any>('/api/securities', createdId);

            expect(getResponse.status).toBe(200);
            expect(getResponse.body!.id).toBe(createdId);
            expect(getResponse.body!.codigo).toBe(newSecurity.codigo);
        });

        it('should return 404 for unsupported URL', () => {
            const response = service.handleCreateRequest('/api/unsupported', {});

            expect(response.status).toBe(404);
        });
    });

    describe('handleUpdateRequest', () => {
        it('should update existing security', () => {
            const updates = { descricao: 'Updated Security Description' };
            const response = service.handleUpdateRequest<any>('/api/securities', 1, updates);

            expect(response.status).toBe(200);
            expect(response.body!.descricao).toBe(updates.descricao);
            expect(response.body!.updatedAt).toBeDefined();
        });

        it('should return 404 for non-existent security', () => {
            const response = service.handleUpdateRequest('/api/securities', 99999, { descricao: 'Test' });

            expect(response.status).toBe(404);
        });

        it('should persist updates', () => {
            const updates = { tipo: 'Updated' };
            service.handleUpdateRequest('/api/securities', 1, updates);

            const getResponse = service.handleGetByIdRequest<any>('/api/securities', 1);

            expect(getResponse.body!.tipo).toBe('Updated');
        });

        it('should return 404 for unsupported URL', () => {
            const response = service.handleUpdateRequest('/api/unsupported', 1, {});

            expect(response.status).toBe(404);
        });
    });

    describe('handleDeleteRequest', () => {
        it('should delete existing security', () => {
            const deleteResponse = service.handleDeleteRequest('/api/securities', 1);
            expect(deleteResponse.status).toBe(204);

            const getResponse = service.handleGetByIdRequest('/api/securities', 1);
            expect(getResponse.status).toBe(404);
        });

        it('should return 404 for non-existent security', () => {
            const response = service.handleDeleteRequest('/api/securities', 99999);
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
            const newSecurity = { codigo: 'TEST' };
            service.handleCreateRequest('/api/securities', newSecurity);
            service.handleDeleteRequest('/api/securities', 1);

            // Reset
            service.reset();

            // Verify reset
            const params = new URLSearchParams();
            const listResponse = service.handleListRequest<any>('/api/securities', params);
            const getResponse = service.handleGetByIdRequest<any>('/api/securities', 1);

            expect(listResponse!.body!.totalCount).toBeGreaterThan(0); // Original data restored
            expect(getResponse.status).toBe(200); // Deleted item restored
        });

        it('should reset auto-increment counters', () => {
            // Create some entities
            service.handleCreateRequest('/api/securities', { codigo: 'SEC1' });
            const beforeResetId = service.handleCreateRequest<any>('/api/securities', { codigo: 'SEC2' }).body!.id;

            // Reset
            service.reset();

            // Create new entity
            const afterResetId = service.handleCreateRequest<any>('/api/securities', { codigo: 'SEC3' }).body!.id;

            // ID should be reset to lower value
            expect(afterResetId).toBeLessThan(beforeResetId);
        });
    });

    describe('Entity-specific handling', () => {
        it('should handle security types with string IDs', () => {
            const params = new URLSearchParams();
            const response = service.handleListRequest('/api/securitytypes', params);

            expect(response).not.toBeNull();
            expect(response!.body!.items.length).toBeGreaterThan(0);
            expect(typeof response!.body!.items[0].id).toBe('string');
        });

        it('should handle all supported entity types', () => {
            const urls = [
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
            const response = service.handleListRequest<any>('/api/securities', params);

            expect(response!.body!.items.length).toBe(0);
            expect(response!.body!.totalCount).toBe(0);
        });

        it('should handle large offset gracefully', () => {
            const params = new URLSearchParams('limit=10&offset=1000');
            const response = service.handleListRequest<any>('/api/securities', params);

            expect(response!.body!.items.length).toBe(0);
        });

        it('should handle partial updates without overwriting entire object', () => {
            const originalSecurity = service.handleGetByIdRequest<any>('/api/securities', 1).body!;
            const originalTipo = originalSecurity.tipo;

            const partialUpdate = { descricao: 'Only Description Updated' };
            service.handleUpdateRequest('/api/securities', 1, partialUpdate);

            const updatedSecurity = service.handleGetByIdRequest<any>('/api/securities', 1).body!;

            expect(updatedSecurity.descricao).toBe('Only Description Updated');
            expect(updatedSecurity.tipo).toBe(originalTipo); // Should remain unchanged
        });
    });
});
