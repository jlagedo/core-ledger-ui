import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Account, CreateAccount, UpdateAccount, PaginatedResponse } from '../models/account.model';
import { AccountType } from '../models/account_type.model';
import { API_URL } from '../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private readonly apiUrl = inject(API_URL);
  private readonly http = inject(HttpClient);

  // Account CRUD operations
  getAccounts(
    limit: number = 100,
    offset: number = 0,
    sortBy?: string,
    sortDirection: 'asc' | 'desc' = 'asc',
    filter?: string
  ): Observable<PaginatedResponse<Account>> {
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
    return this.http.get<PaginatedResponse<Account>>(`${this.apiUrl}/accounts?${queryString}`);
  }

  getAccountById(id: number): Observable<Account> {
    return this.http.get<Account>(`${this.apiUrl}/accounts/${id}`);
  }

  createAccount(account: CreateAccount): Observable<Account> {
    return this.http.post<Account>(`${this.apiUrl}/accounts`, account);
  }

  updateAccount(id: number, account: UpdateAccount): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/accounts/${id}`, account);
  }

  deleteAccount(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/accounts/${id}`);
  }

  // Account Type CRUD operations
  getAccountTypes(): Observable<AccountType[]> {
    return this.http.get<AccountType[]>(`${this.apiUrl}/accounttypes`);
  }

  getAccountTypeById(id: number): Observable<AccountType> {
    return this.http.get<AccountType>(`${this.apiUrl}/accounttypes/${id}`);
  }

  createAccountType(accountType: { description: string }): Observable<AccountType> {
    return this.http.post<AccountType>(`${this.apiUrl}/accounttypes`, accountType);
  }

  updateAccountType(id: number, accountType: { description: string }): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/accounttypes/${id}`, accountType);
  }

  deleteAccountType(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/accounttypes/${id}`);
  }
}
