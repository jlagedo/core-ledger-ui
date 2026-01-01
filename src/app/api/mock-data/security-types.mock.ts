import { SecurityType } from '../../models/security-type.model';

/**
 * Mock security type data for local development and testing.
 * @internal
 */
export const MOCK_SECURITY_TYPES: SecurityType[] = [
    { value: 1, name: 'Equity', description: 'Equity securities' },
    { value: 2, name: 'Bond', description: 'Fixed income securities' },
    { value: 3, name: 'Cash', description: 'Cash and cash equivalents' },
    { value: 4, name: 'Money Market', description: 'Money market instruments' },
    { value: 5, name: 'Mutual Fund', description: 'Mutual fund shares' },
    { value: 6, name: 'ETF', description: 'Exchange-traded funds' },
    { value: 7, name: 'REIT', description: 'Real estate investment trusts' },
    { value: 8, name: 'Derivative', description: 'Derivative instruments' },
    { value: 9, name: 'Hybrid', description: 'Hybrid securities' },
    { value: 10, name: 'Future', description: 'Future contracts' },
    { value: 11, name: 'Option on Equity', description: 'Equity options' },
    { value: 12, name: 'Option on Future', description: 'Future options' },
    { value: 13, name: 'Forward', description: 'Forward contracts' },
    { value: 14, name: 'Fund', description: 'Investment funds' },
    { value: 15, name: 'Receipt', description: 'Depository receipts' },
    { value: 16, name: 'FX', description: 'Foreign exchange' },
    { value: 17, name: 'Commodity', description: 'Commodities' },
    { value: 18, name: 'Index', description: 'Market indices' },
];
