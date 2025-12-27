export enum ValuationFrequency {
    Daily = 1,
    Weekly = 2
}

export interface Fund {
    id: number;
    code: string;
    name: string;
    baseCurrency: string;
    inceptionDate: string;
    valuationFrequency: ValuationFrequency;
    valuationFrequencyDescription: string;
    createdAt: string;
    updatedAt?: string;
}

export interface PaginatedResponse<T> {
    items: T[];
    totalCount: number;
    limit: number;
    offset: number;
}

export interface CreateFund {
    code: string;
    name: string;
    baseCurrency: string;
    inceptionDate: string;
    valuationFrequency: ValuationFrequency;
}

export interface UpdateFund {
    code: string;
    name: string;
    baseCurrency: string;
    inceptionDate: string;
    valuationFrequency: ValuationFrequency;
}
