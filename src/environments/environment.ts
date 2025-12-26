export const environment = {
    production: false,
    apiUrl: 'http://localhost:5000/api',
    auth0: {
        domain: 'dev-7yj4txd3qg4xsckj.us.auth0.com',
        clientId: 'PDPnT19fdBAv5VLjg3OR4U6N5wqkGohT',
        audience: 'https://core-ledger-api',
        httpInterceptor: {
            allowedList: [
                'https://localhost:5000/api/*',
                'http://localhost:4200/api/*',
                'https://localhost:7109/api/*'
            ]
        }
    }
};
