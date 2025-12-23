import {inject, Injectable} from '@angular/core';
import {AccountType} from '../models/account_type.model';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AccountService {

  private api_url = '/api/account';

  private http = inject(HttpClient);

  getAccountTypes(): Observable<AccountType[]> {
    return new Observable(observer => {
      setTimeout(() => {
        observer.next([
          {id: '1', name: 'ASSET'},
          {id: '2', name: 'LIABILITY'},
          {id: '3', name: 'EQUITY'},
          {id: '4', name: 'INCOME'},
          {id: '5', name: 'EXPENSE'}
        ]);
        observer.complete();
      }, 2000);
    });
  }
}
