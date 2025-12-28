export enum SecurityStatus {
  Active = 1,
  Inactive = 2
}

export enum SecurityType {
  Equity = 1,
  Bond = 2,
  Cash = 3,
  MoneyMarket = 4,
  MutualFund = 5,
  ETF = 6,
  REIT = 7,
  Derivative = 8,
  Hybrid = 9,
  Future = 10,
  OptionOnEquity = 11,
  OptionOnFuture = 12,
  Forward = 13,
  Fund = 14,
  Receipt = 15,
  FX = 16,
  Commodity = 17,
  Index = 18
}

export interface Security {
  id: number;
  name: string;
  ticker: string;
  isin: string | null;
  type: SecurityType;
  typeDescription: string;
  currency: string;
  status: SecurityStatus;
  statusDescription: string;
  createdAt: string;
  updatedAt: string | null;
  deactivatedAt: string | null;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  limit: number;
  offset: number;
}

export interface CreateSecurity {
  name: string;
  ticker: string;
  isin: string | null;
  type: SecurityType;
  currency: string;
}

export interface UpdateSecurity {
  name: string;
  ticker: string;
  isin: string | null;
  type: SecurityType;
  currency: string;
}
