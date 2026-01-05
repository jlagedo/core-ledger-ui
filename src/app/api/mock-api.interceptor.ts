import { HttpInterceptorFn, HttpResponse, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ENVIRONMENT } from '../config/environment.config';
import { MockApiService } from './mock-api.service';

/**
 * Mock API Interceptor
 *
 * Intercepts HTTP requests to /api/** endpoints and returns mock data
 * when environment.api.useMock is enabled. Supports:
 * - Configurable network latency simulation
 * - Random error generation for testing error handling
 * - Query param-based error forcing (?mock-error=404)
 * - Full CRUD operations (GET, POST, PUT, PATCH, DELETE)
 * - Pagination, sorting, and filtering
 *
 * @internal - Only active when environment.api.useMock === true
 */
export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
    const environment = inject(ENVIRONMENT);

    // Check if mock API is enabled early (before injecting service)
    if (!environment.api?.useMock) {
        return next(req);
    }

    // Only inject MockApiService if useMock is true
    const mockApiService = inject(MockApiService);

    // Production safety check
    if (environment.production) {
        throw new Error(
            'CRITICAL ERROR: mockApiInterceptor is active in production build. ' +
            'This indicates a serious build configuration error. Check:\n' +
            '1. environment.api.useMock is false in environment.production.ts\n' +
            '2. Interceptor is not included in production provider configuration\n' +
            '3. Build was executed with --configuration=production'
        );
    }

    // Only intercept /api/** requests
    if (!req.url.includes('/api/')) {
        return next(req);
    }

    // Check for forced error via query param (?mock-error=404)
    const url = new URL(req.url, 'http://localhost');
    const forcedError = url.searchParams.get('mock-error');
    if (forcedError) {
        const errorCode = parseInt(forcedError, 10);
        return createErrorResponse(errorCode, req.url).pipe(
            delay(environment.api.mockDelayMs || 0)
        );
    }

    // Apply random error rate
    if (environment.api.mockErrorRate && Math.random() < environment.api.mockErrorRate) {
        const randomErrorCodes = [500, 502, 503, 504];
        const errorCode = randomErrorCodes[Math.floor(Math.random() * randomErrorCodes.length)];
        return createErrorResponse(errorCode, req.url).pipe(
            delay(environment.api.mockDelayMs || 0)
        );
    }

    // Route request to appropriate handler
    try {
        const response = routeRequest(req, mockApiService);

        if (!response) {
            // Unhandled /api/** endpoint - return 404
            return createErrorResponse(404, req.url, 'Unsupported endpoint').pipe(
                delay(environment.api.mockDelayMs || 0)
            );
        }

        // Check if response is an error status (>= 400) and convert to error
        if (response.status >= 400) {
            return createErrorResponse(
                response.status,
                req.url,
                response.body?.error || response.statusText
            ).pipe(delay(environment.api.mockDelayMs || 0));
        }

        // Apply delay and return mock response
        return of(response).pipe(delay(environment.api.mockDelayMs || 0));
    } catch (error) {
        console.error('[MockApiInterceptor] Error handling request:', error);
        return createErrorResponse(500, req.url, error instanceof Error ? error.message : 'Internal mock error').pipe(
            delay(environment.api.mockDelayMs || 0)
        );
    }
};

/**
 * Route the request to the appropriate MockApiService handler
 */
function routeRequest(req: any, mockApiService: MockApiService): HttpResponse<any> | null {
    const url = req.url.replace(/^.*\/api/, '/api'); // Normalize URL
    const urlParts = url.split('?')[0].split('/').filter(Boolean);
    const params = new URLSearchParams(req.url.split('?')[1] || '');

    // Extract ID from URL if present (e.g., /api/funds/123 or /api/accounttypes/1)
    const lastPart = urlParts[urlParts.length - 1];
    const id = /^\d+$/.test(lastPart) ? parseInt(lastPart, 10) : null;

    // Endpoints that return plain arrays instead of paginated responses
    const arrayEndpoints = ['/api/accounttypes', '/api/securitytypes', '/api/transactions/status', '/api/transactions/subtypes'];
    const isArrayEndpoint = arrayEndpoints.some(endpoint => url.includes(endpoint));

    // Report endpoints that return arrays directly
    const reportEndpoints = ['/api/accounts/reports/by-type'];
    const isReportEndpoint = reportEndpoints.some(endpoint => url.includes(endpoint));

    switch (req.method) {
        case 'GET':
            if (id !== null) {
                // GET /api/funds/123
                return mockApiService.handleGetByIdRequest(url, id);
            } else if (isReportEndpoint) {
                // GET /api/accounts/reports/by-type - return report data directly
                return mockApiService.handleReportRequest(url);
            } else if (isArrayEndpoint) {
                // GET /api/accounttypes or /api/securitytypes - return array directly
                const paginatedResponse = mockApiService.handleListRequest(url, params);
                if (paginatedResponse) {
                    return new HttpResponse({
                        status: 200,
                        statusText: 'OK',
                        body: paginatedResponse.body!.items,
                    });
                }
                return null;
            } else {
                // GET /api/funds?limit=10&offset=0
                return mockApiService.handleListRequest(url, params);
            }

        case 'POST':
            // POST /api/funds
            return mockApiService.handleCreateRequest(url, req.body);

        case 'PUT':
        case 'PATCH':
            if (id !== null) {
                // PUT /api/funds/123
                return mockApiService.handleUpdateRequest(url, id, req.body);
            }
            return new HttpResponse({
                status: 400,
                statusText: 'Bad Request',
                body: { error: 'ID required for UPDATE operations' },
            });

        case 'DELETE':
            if (id !== null) {
                // DELETE /api/funds/123
                return mockApiService.handleDeleteRequest(url, id);
            }
            return new HttpResponse({
                status: 400,
                statusText: 'Bad Request',
                body: { error: 'ID required for DELETE operations' },
            });

        default:
            return new HttpResponse({
                status: 405,
                statusText: 'Method Not Allowed',
                body: { error: `Method ${req.method} not supported` },
            });
    }
}

/**
 * Create an error response Observable
 */
function createErrorResponse(status: number, url: string, message?: string): Observable<never> {
    const errorMessages: Record<number, string> = {
        400: 'Bad Request',
        401: 'Unauthorized',
        403: 'Forbidden',
        404: 'Not Found',
        500: 'Internal Server Error',
        502: 'Bad Gateway',
        503: 'Service Unavailable',
        504: 'Gateway Timeout',
    };

    return throwError(() => new HttpErrorResponse({
        error: { error: message || errorMessages[status] || 'Unknown Error' },
        status,
        statusText: errorMessages[status] || 'Error',
        url,
    }));
}
