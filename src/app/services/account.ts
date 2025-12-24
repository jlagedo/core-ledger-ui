import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Account, CreateAccount, UpdateAccount } from '../models/account.model';
import { AccountType } from '../models/account_type.model';
import { API_URL } from '../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private readonly apiUrl = inject(API_URL);
  private readonly http = inject(HttpClient);

  // Account CRUD operations
  getAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>(`${this.apiUrl}/accounts`);
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
