import { Injectable, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ENVIRONMENT } from '../config/environment.config';
import {
    MOCK_ACCOUNTS,
    MOCK_ACCOUNTS_BY_TYPE_REPORT,
    MOCK_ACCOUNT_TYPES,
    MOCK_FUNDS,
    MOCK_SECURITIES,
    MOCK_SECURITY_TYPES,
    MOCK_TRANSACTIONS,
    MOCK_TRANSACTION_STATUSES,
    MOCK_TRANSACTION_SUBTYPES,
    MOCK_USERS,
} from './mock-data';
import { PaginatedResponse } from '../models/fund.model';

/**
 * Mock API Service provides in-memory CRUD operations for all API entities.
 * Supports pagination, sorting, and filtering to simulate real API behavior.
 *
 * @internal - Only used when environment.api.useMock === true
 */
@Injectable({ providedIn: 'root' })
export class MockApiService {
    private readonly environment = inject(ENVIRONMENT);

    // In-memory storage with auto-reset on instantiation
    private accounts = new Map(MOCK_ACCOUNTS.map(a => [a.id, { ...a }]));
    private accountTypes = new Map(MOCK_ACCOUNT_TYPES.map(at => [at.id, { ...at }]));
    private funds = new Map(MOCK_FUNDS.map(f => [f.id, { ...f }]));
    private securities = new Map(MOCK_SECURITIES.map(s => [s.id, { ...s }]));
    private securityTypes = new Map(MOCK_SECURITY_TYPES.map(st => [st.value, { ...st }]));
    private transactions = new Map(MOCK_TRANSACTIONS.map(t => [t.id, { ...t }]));
    private transactionStatuses = new Map(MOCK_TRANSACTION_STATUSES.map(s => [s.id, { ...s }]));
    private transactionSubTypes = new Map(MOCK_TRANSACTION_SUBTYPES.map(st => [st.id, { ...st }]));
    private users = new Map(MOCK_USERS.map(u => [u.id, { ...u }]));

    // Auto-increment ID counters
    private nextAccountId = Math.max(...MOCK_ACCOUNTS.map(a => a.id), 0) + 1;
    private nextAccountTypeId = 6; // Account types use string IDs
    private nextFundId = Math.max(...MOCK_FUNDS.map(f => f.id), 0) + 1;
    private nextSecurityId = Math.max(...MOCK_SECURITIES.map(s => s.id), 0) + 1;
    private nextTransactionId = Math.max(...MOCK_TRANSACTIONS.map(t => t.id), 0) + 1;
    private nextUserId = Math.max(...MOCK_USERS.map(u => u.id), 0) + 1;

    constructor() {
        // Production safety check
        if (typeof window !== 'undefined' && !this.environment.api?.useMock) {
            throw new Error(
                'MockApiService should never be used in production! Please verify:\n' +
                '1. environment.api.useMock is false in environment.production.ts\n' +
                '2. MockApiService is not imported or provided in production code paths\n' +
                '3. Build was executed with --configuration=production'
            );
        }
    }

    /**
     * Handle GET requests for list endpoints with pagination, sorting, and filtering
     */
    handleListRequest<T extends { id: string | number;[key: string]: any }>(
        url: string,
        params: URLSearchParams
    ): HttpResponse<PaginatedResponse<T>> | null {
        const dataMap = this.getDataMapForUrl(url);
        if (!dataMap) return null;

        let items = Array.from(dataMap.values()) as T[];

        // Apply filtering
        const filter = params.get('filter');
        if (filter) {
            const lowerFilter = filter.toLowerCase();
            items = items.filter(item =>
                Object.values(item).some(value =>
                    String(value).toLowerCase().includes(lowerFilter)
                )
            );
        }

        // Apply sorting
        const sortBy = params.get('sortBy') || 'id';
        const sortDirection = params.get('sortDirection') || 'asc';
        items.sort((a, b) => {
            const aVal = a[sortBy];
            const bVal = b[sortBy];

            if (aVal === null || aVal === undefined) return 1;
            if (bVal === null || bVal === undefined) return -1;

            let comparison = 0;
            if (typeof aVal === 'string' && typeof bVal === 'string') {
                comparison = aVal.localeCompare(bVal, undefined, { sensitivity: 'base' });
            } else if (typeof aVal === 'number' && typeof bVal === 'number') {
                comparison = aVal - bVal;
            } else {
                comparison = String(aVal).localeCompare(String(bVal));
            }

            return sortDirection === 'desc' ? -comparison : comparison;
        });

        // Apply pagination
        const limit = parseInt(params.get('limit') || '100', 10);
        const offset = parseInt(params.get('offset') || '0', 10);
        const totalCount = items.length;
        const paginatedItems = items.slice(offset, offset + limit);

        return new HttpResponse({
            status: 200,
            statusText: 'OK',
            body: {
                items: paginatedItems,
                totalCount,
                limit,
                offset,
            },
        });
    }

    /**
     * Handle GET requests for single entity by ID
     */
    handleGetByIdRequest<T>(url: string, id: string | number): HttpResponse<T> | HttpResponse<any> {
        const dataMap = this.getDataMapForUrl(url);
        if (!dataMap) {
            return new HttpResponse({ status: 404, statusText: 'Not Found', body: { error: 'Endpoint not found' } });
        }

        const item = dataMap.get(id);
        if (!item) {
            return new HttpResponse({
                status: 404,
                statusText: 'Not Found',
                body: { error: `Entity with ID ${id} not found` },
            });
        }

        return new HttpResponse({
            status: 200,
            statusText: 'OK',
            body: { ...item } as T,
        });
    }

    /**
     * Handle POST requests to create new entities
     */
    handleCreateRequest<T extends Record<string, any>>(
        url: string,
        body: Partial<T> & { id?: number; createdAt?: string; updatedAt?: string }
    ): HttpResponse<T> | HttpResponse<any> {
        const dataMap = this.getDataMapForUrl(url);
        if (!dataMap) {
            return new HttpResponse({ status: 404, statusText: 'Not Found', body: { error: 'Endpoint not found' } });
        }

        const newId = this.getNextIdForUrl(url);
        const now = new Date().toISOString();
        const newItem = {
            ...body,
            id: newId,
            createdAt: now,
            updatedAt: now,
        } as unknown as T;

        dataMap.set(newId, newItem);

        return new HttpResponse({
            status: 201,
            statusText: 'Created',
            body: { ...newItem },
        });
    }

    /**
     * Handle PUT/PATCH requests to update entities
     */
    handleUpdateRequest<T extends Record<string, any>>(
        url: string,
        id: string | number,
        body: Partial<T> & { id?: string | number; updatedAt?: string }
    ): HttpResponse<T> | HttpResponse<any> {
        const dataMap = this.getDataMapForUrl(url);
        if (!dataMap) {
            return new HttpResponse({ status: 404, statusText: 'Not Found', body: { error: 'Endpoint not found' } });
        }

        const existingItem = dataMap.get(id);
        if (!existingItem) {
            return new HttpResponse({
                status: 404,
                statusText: 'Not Found',
                body: { error: `Entity with ID ${id} not found` },
            });
        }

        const updatedItem = {
            ...existingItem,
            ...body,
            id, // Preserve ID
            updatedAt: new Date().toISOString(),
        } as T;

        dataMap.set(id, updatedItem);

        return new HttpResponse({
            status: 200,
            statusText: 'OK',
            body: { ...updatedItem },
        });
    }

    /**
     * Handle DELETE requests
     */
    handleDeleteRequest(url: string, id: string | number): HttpResponse<void> | HttpResponse<any> {
        const dataMap = this.getDataMapForUrl(url);
        if (!dataMap) {
            return new HttpResponse({ status: 404, statusText: 'Not Found', body: { error: 'Endpoint not found' } });
        }

        if (!dataMap.has(id)) {
            return new HttpResponse({
                status: 404,
                statusText: 'Not Found',
                body: { error: `Entity with ID ${id} not found` },
            });
        }

        dataMap.delete(id);

        return new HttpResponse({
            status: 204,
            statusText: 'No Content',
            body: undefined,
        });
    }

    /**
     * Get the appropriate data map based on URL
     */
    private getDataMapForUrl(url: string): Map<any, any> | null {
        if (url.includes('/accounts')) return this.accounts;
        if (url.includes('/accounttypes')) return this.accountTypes;
        if (url.includes('/funds')) return this.funds;
        if (url.includes('/securities') && !url.includes('/securitytypes')) return this.securities;
        if (url.includes('/securitytypes')) return this.securityTypes;
        // Transaction endpoints - order matters: more specific patterns first
        if (url.includes('/transactions/status')) return this.transactionStatuses;
        if (url.includes('/transactions/subtypes')) return this.transactionSubTypes;
        if (url.includes('/transactions')) return this.transactions;
        if (url.includes('/users')) return this.users;
        return null;
    }

    /**
     * Get next auto-increment ID based on URL
     */
    private getNextIdForUrl(url: string): string | number {
        if (url.includes('/accounts') && !url.includes('/accounttypes')) return this.nextAccountId++;
        if (url.includes('/accounttypes')) return this.nextAccountTypeId++;
        if (url.includes('/funds')) return this.nextFundId++;
        if (url.includes('/securities')) return this.nextSecurityId++;
        if (url.includes('/transactions')) return this.nextTransactionId++;
        return 1;
    }

    /**
     * Handle GET requests for report endpoints that return arrays directly
     */
    handleReportRequest(url: string): HttpResponse<any[]> | null {
        if (url.includes('/accounts/reports/by-type')) {
            return new HttpResponse({
                status: 200,
                statusText: 'OK',
                body: MOCK_ACCOUNTS_BY_TYPE_REPORT,
            });
        }
        return null;
    }

    /**
     * Reset all data to initial mock state (useful for testing)
     */
    reset(): void {
        this.accounts = new Map(MOCK_ACCOUNTS.map(a => [a.id, { ...a }]));
        this.accountTypes = new Map(MOCK_ACCOUNT_TYPES.map(at => [at.id, { ...at }]));
        this.funds = new Map(MOCK_FUNDS.map(f => [f.id, { ...f }]));
        this.securities = new Map(MOCK_SECURITIES.map(s => [s.id, { ...s }]));
        this.securityTypes = new Map(MOCK_SECURITY_TYPES.map(st => [st.value, { ...st }]));
        this.transactions = new Map(MOCK_TRANSACTIONS.map(t => [t.id, { ...t }]));
        this.transactionStatuses = new Map(MOCK_TRANSACTION_STATUSES.map(s => [s.id, { ...s }]));
        this.transactionSubTypes = new Map(MOCK_TRANSACTION_SUBTYPES.map(st => [st.id, { ...st }]));
        this.users = new Map(MOCK_USERS.map(u => [u.id, { ...u }]));

        this.nextAccountId = Math.max(...MOCK_ACCOUNTS.map(a => a.id), 0) + 1;
        this.nextAccountTypeId = 6; // Account types use string IDs
        this.nextFundId = Math.max(...MOCK_FUNDS.map(f => f.id), 0) + 1;
        this.nextSecurityId = Math.max(...MOCK_SECURITIES.map(s => s.id), 0) + 1;
        this.nextTransactionId = Math.max(...MOCK_TRANSACTIONS.map(t => t.id), 0) + 1;
        this.nextUserId = Math.max(...MOCK_USERS.map(u => u.id), 0) + 1;
    }
}
