export enum AccountStatus {
    Active = 1,
    Inactive = 2
}

export enum NormalBalance {
    Debit = 1,
    Credit = 2
}

export interface Account {
    id: number;
    code: number;
    name: string;
    typeId: number;
    typeDescription: string;
    status: AccountStatus;
    normalBalance: NormalBalance;
    createdAt: Date;
    updatedAt: Date | null;
}

export interface CreateAccount {
    code: number;
    name: string;
    typeId: number;
    status: AccountStatus;
    normalBalance: NormalBalance;
}

export interface UpdateAccount {
    code: number;
    name: string;
    typeId: number;
    status: AccountStatus;
    normalBalance: NormalBalance;
}
