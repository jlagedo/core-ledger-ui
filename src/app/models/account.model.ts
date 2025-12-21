export type AccountType = 'ASSET' | 'LIABILITY' | 'EQUITY' | 'INCOME' | 'EXPENSE';
export type NormalBalance = 'DEBIT' | 'CREDIT';

export interface Account {
    id: string;
    code: string;
    name: string;
    type: AccountType;
    isActive: boolean;
    normalBalance: NormalBalance;
}
