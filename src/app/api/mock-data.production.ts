/**
 * Production stub for mock data.
 * This file replaces mock-data/index.ts in production builds via angular.json fileReplacements.
 *
 * ⛔ PRODUCTION BUILD - MOCK DATA DISABLED
 *
 * All exports throw errors when accessed, preventing accidental use of mock data in production.
 */

const createProductionProxy = <T extends object>(entityName: string): T => {
    return new Proxy({} as T, {
        get() {
            throw new Error(
                `CRITICAL SECURITY ERROR: Mock ${entityName} data is not available in production. ` +
                'This indicates a build configuration error. Please verify that:\n' +
                '1. environment.api.useMock is set to false in environment.production.ts\n' +
                '2. Angular build fileReplacements are correctly configured in angular.json\n' +
                '3. The production build was executed with --configuration=production\n\n' +
                'Mock data should NEVER be accessible in production builds.'
            );
        },
    }) as T;
};

export const MOCK_ACCOUNTS = createProductionProxy<any[]>('account');
export const MOCK_ACCOUNTS_BY_TYPE_REPORT = createProductionProxy<any[]>('accounts by type report');
export const MOCK_ACCOUNT_TYPES = createProductionProxy<any[]>('account type');
export const MOCK_FUNDS = createProductionProxy<any[]>('fund');
export const MOCK_SECURITIES = createProductionProxy<any[]>('security');
export const MOCK_SECURITY_TYPES = createProductionProxy<any[]>('security type');
export const MOCK_USERS = createProductionProxy<any[]>('user');
