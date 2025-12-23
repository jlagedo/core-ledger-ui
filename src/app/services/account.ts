import { inject, Injectable } from '@angular/core';
import { AccountType } from '../models/account_type.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AccountService {

  private api_url = '/api/account';

  private http = inject(HttpClient);

  getAccountTypes(): Observable<AccountType[]> {
    return this.http.get<AccountType[]>(`${this.api_url}/types`);
  }
}
