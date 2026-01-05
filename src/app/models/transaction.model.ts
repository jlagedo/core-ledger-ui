import {PaginatedResponse} from './fund.model';

/**
 * Transaction entity DTO matching CoreLedger.Application.DTOs.TransactionDto
 */
export interface Transaction {
  id: number;
  fundId: number;
  fundCode: string;
  fundName: string;
  securityId: number | null;
  securityTicker: string | null;
  securityName: string | null;
  transactionSubTypeId: number;
  transactionSubTypeDescription: string;
  transactionTypeId: number;
  transactionTypeDescription: string;
  tradeDate: string;
  settleDate: string;
  quantity: number;
  price: number;
  amount: number;
  currency: string;
  statusId: number;
  statusDescription: string;
  createdAt: string;
  updatedAt: string | null;
}

/**
 * DTO for creating a new transaction.
 * Matches CoreLedger.Application.DTOs.CreateTransactionDto
 */
export interface CreateTransaction {
  fundId: number;
  securityId: number | null;
  transactionSubTypeId: number;
  tradeDate: string;
  settleDate: string;
  quantity: number;
  price: number;
  amount: number;
  currency: string;
  idempotencyKey?: string;
}

/**
 * DTO for updating an existing transaction.
 * Matches CoreLedger.Application.DTOs.UpdateTransactionDto
 */
export interface UpdateTransaction {
  fundId: number;
  securityId: number | null;
  transactionSubTypeId: number;
  tradeDate: string;
  settleDate: string;
  quantity: number;
  price: number;
  amount: number;
  currency: string;
  statusId: number;
}

/**
 * Transaction status lookup type
 */
export interface TransactionStatus {
  id: number;
  shortDescription: string;
  longDescription: string;
  createdAt: string;
  updatedAt: string | null;
}

/**
 * Transaction sub-type lookup type
 */
export interface TransactionSubType {
  id: number;
  typeId: number;
  typeDescription: string;
  shortDescription: string;
  longDescription: string;
  createdAt: string;
  updatedAt: string | null;
}

export type PaginatedTransactionResponse = PaginatedResponse<Transaction>;
