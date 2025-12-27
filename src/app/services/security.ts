import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API_URL } from '../config/api.config';
import {
  Security,
  PaginatedResponse,
  CreateSecurity,
  UpdateSecurity,
} from '../models/security.model';
import { SecurityType } from '../models/security_type.model';
import { LoggerService } from './logger';

@Injectable({ providedIn: 'root' })
export class SecurityService {
  private readonly apiUrl = inject(API_URL);
  private readonly http = inject(HttpClient);
  private readonly logger = inject(LoggerService);

  getSecurities(
    limit: number = 100,
    offset: number = 0,
    sortBy?: string,
    sortDirection: 'asc' | 'desc' = 'asc',
    filter?: string
  ): Observable<PaginatedResponse<Security>> {
    const params: Record<string, string> = {
      limit: limit.toString(),
      offset: offset.toString(),
      sortDirection,
    };

    if (sortBy) params['sortBy'] = sortBy;
    if (filter) params['filter'] = filter;

    const queryString = new URLSearchParams(params).toString();
    return this.http.get<PaginatedResponse<Security>>(`${this.apiUrl}/securities?${queryString}`);
  }

  getSecurityById(id: number): Observable<Security> {
    return this.http.get<Security>(`${this.apiUrl}/securities/${id}`);
  }

  createSecurity(security: CreateSecurity): Observable<Security> {
    return this.http.post<Security>(`${this.apiUrl}/securities`, security);
  }

  updateSecurity(id: number, security: UpdateSecurity): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/securities/${id}`, security);
  }

  deactivateSecurity(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/securities/${id}/deactivate`, null).pipe(
      catchError((error) => {
        this.logger.error(`Failed to deactivate security`, {
          status: error.status,
          errorCode: error.error?.errorCode,
          message: error.error?.message,
        }, 'SecurityService.deactivateSecurity');
        return throwError(() => error);
      })
    );
  }

  getSecurityTypes(): Observable<SecurityType[]> {
    return this.http.get<SecurityType[]>(`${this.apiUrl}/securitytypes`);
  }
}
