import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CreateFund, Fund, PaginatedResponse, UpdateFund} from '../models/fund.model';
import {API_URL} from '../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class FundService {
  private readonly apiUrl = inject(API_URL);
  private readonly http = inject(HttpClient);

  getFunds(
    limit: number = 100,
    offset: number = 0,
    sortBy?: string,
    sortDirection: 'asc' | 'desc' = 'asc',
    filter?: string
  ): Observable<PaginatedResponse<Fund>> {
    const params: Record<string, string> = {
      limit: limit.toString(),
      offset: offset.toString(),
      sortDirection,
    };

    if (sortBy) {
      params['sortBy'] = sortBy;
    }
    if (filter) {
      params['filter'] = filter;
    }

    const queryString = new URLSearchParams(params).toString();
    return this.http.get<PaginatedResponse<Fund>>(`${this.apiUrl}/funds?${queryString}`);
  }

  getFundById(id: number): Observable<Fund> {
    return this.http.get<Fund>(`${this.apiUrl}/funds/${id}`);
  }

  createFund(fund: CreateFund): Observable<Fund> {
    return this.http.post<Fund>(`${this.apiUrl}/funds`, fund);
  }

  updateFund(id: number, fund: UpdateFund): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/funds/${id}`, fund);
  }
}
