import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {API_URL} from '../config/api.config';
import {PaginatedResponse} from '../models/fund.model';
import {
  CreateTransaction,
  Transaction,
  TransactionStatus,
  TransactionSubType,
  UpdateTransaction
} from '../models/transaction.model';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private readonly apiUrl = inject(API_URL);
  private readonly http = inject(HttpClient);

  /**
   * Obtém lista paginada de transações
   * GET /api/transactions?limit=&offset=&sortBy=&sortDirection=&filter=
   */
  getTransactions(
    limit: number = 100,
    offset: number = 0,
    sortBy?: string,
    sortDirection: 'asc' | 'desc' = 'asc',
    filter?: string
  ): Observable<PaginatedResponse<Transaction>> {
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
    return this.http.get<PaginatedResponse<Transaction>>(`${this.apiUrl}/transactions?${queryString}`);
  }

  /**
   * Obtém transação por ID
   * GET /api/transactions/{id}
   */
  getTransactionById(id: number): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.apiUrl}/transactions/${id}`);
  }

  /**
   * Cria uma nova transação
   * POST /api/transactions
   */
  createTransaction(dto: CreateTransaction): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.apiUrl}/transactions`, dto);
  }

  /**
   * Atualiza uma transação existente
   * PUT /api/transactions/{id}
   */
  updateTransaction(id: number, dto: UpdateTransaction): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/transactions/${id}`, dto);
  }

  /**
   * Obtém todos os status de transação
   * GET /api/transactions/status
   */
  getTransactionStatuses(): Observable<TransactionStatus[]> {
    return this.http.get<TransactionStatus[]>(`${this.apiUrl}/transactions/status`);
  }

  /**
   * Obtém todos os sub-tipos de transação, opcionalmente filtrados por ID de tipo
   * GET /api/transactions/subtypes?typeId={id}
   */
  getTransactionSubTypes(typeId?: number): Observable<TransactionSubType[]> {
    const url = typeId
      ? `${this.apiUrl}/transactions/subtypes?typeId=${typeId}`
      : `${this.apiUrl}/transactions/subtypes`;
    return this.http.get<TransactionSubType[]>(url);
  }
}
