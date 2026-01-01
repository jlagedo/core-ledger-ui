export enum SecurityStatus {
  Active = 1,
  Inactive = 2
}

export enum SecurityType {
  Equity = 1,
  Bond = 2,
  /** @internal - Reserved for future cash security implementation */
  Cash = 3,
  /** @internal - Reserved for future money market instrument implementation */
  MoneyMarket = 4,
  /** @internal - Reserved for future mutual fund implementation */
  MutualFund = 5,
  ETF = 6,
  /** @internal - Reserved for future REIT implementation */
  REIT = 7,
  /** @internal - Reserved for future derivative instrument implementation */
  Derivative = 8,
  /** @internal - Reserved for future hybrid security implementation */
  Hybrid = 9,
  Future = 10,
  OptionOnEquity = 11,
  /** @internal - Reserved for future option on future implementation */
  OptionOnFuture = 12,
  /** @internal - Reserved for future forward contract implementation */
  Forward = 13,
  /** @internal - Reserved for future fund implementation */
  Fund = 14,
  /** @internal - Reserved for future depository receipt implementation */
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
