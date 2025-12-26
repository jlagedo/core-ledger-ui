import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl;

    getLedgerEntries(): Observable<any> {
        return this.http.get(`${this.apiUrl}/ledger-entries`);
    }

    getAccountBalance(accountId: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/accounts/${accountId}/balance`);
    }

    createJournalEntry(entry: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/journal-entries`, entry);
    }
}
