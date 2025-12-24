import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Account, CreateAccount, UpdateAccount } from '../models/account.model';
import { AccountType } from '../models/account_type.model';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private api_url = '/api';
  private http = inject(HttpClient);

  // Account CRUD operations
  getAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>(`${this.api_url}/accounts`);
  }

  getAccountById(id: number): Observable<Account> {
    return this.http.get<Account>(`${this.api_url}/accounts/${id}`);
  }

  createAccount(account: CreateAccount): Observable<Account> {
    return this.http.post<Account>(`${this.api_url}/accounts`, account);
  }

  updateAccount(id: number, account: UpdateAccount): Observable<void> {
    return this.http.put<void>(`${this.api_url}/accounts/${id}`, account);
  }

  deleteAccount(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api_url}/accounts/${id}`);
  }

  // Account Type CRUD operations
  getAccountTypes(): Observable<AccountType[]> {
    return this.http.get<AccountType[]>(`${this.api_url}/accounttypes`);
  }

  getAccountTypeById(id: number): Observable<AccountType> {
    return this.http.get<AccountType>(`${this.api_url}/account/types/${id}`);
  }

  createAccountType(accountType: { description: string }): Observable<AccountType> {
    return this.http.post<AccountType>(`${this.api_url}/account/types`, accountType);
  }

  updateAccountType(id: number, accountType: { description: string }): Observable<void> {
    return this.http.put<void>(`${this.api_url}/account/types/${id}`, accountType);
  }

  deleteAccountType(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api_url}/account/types/${id}`);
  }
}
