import {Transaction, TransactionStatus, TransactionSubType} from '../../models/transaction.model';

/**
 * Mock transaction data for local development and testing.
 * Includes various transaction types, statuses, and edge cases.
 * @internal
 */
// Helper data for realistic transaction generation
const FUNDS = [
  { id: 1, code: 'FND001', name: 'Alpha Growth Fund' },
  { id: 2, code: 'FND002', name: 'Beta Income Fund' },
  { id: 3, code: 'FND003', name: 'Global Balanced Fund' },
  { id: 4, code: 'FND004', name: 'Emerging Markets Fund' },
  { id: 5, code: 'FND005', name: 'Conservative Fixed Income Fund' },
];

const SECURITIES = [
  { id: 1, ticker: 'AAPL', name: 'Apple Inc.', type: 'EQUITY' },
  { id: 2, ticker: 'MSFT', name: 'Microsoft Corporation', type: 'EQUITY' },
  { id: 3, ticker: 'GOOGL', name: 'Alphabet Inc.', type: 'EQUITY' },
  { id: 4, ticker: 'AMZN', name: 'Amazon.com Inc.', type: 'EQUITY' },
  { id: 5, ticker: 'NVDA', name: 'NVIDIA Corporation', type: 'EQUITY' },
  { id: 6, ticker: 'TSLA', name: 'Tesla Inc.', type: 'EQUITY' },
  { id: 7, ticker: 'META', name: 'Meta Platforms Inc.', type: 'EQUITY' },
  { id: 8, ticker: 'AVGO', name: 'Broadcom Inc.', type: 'EQUITY' },
  { id: 9, ticker: 'LY', name: 'Li Auto Inc.', type: 'EQUITY' },
  { id: 10, ticker: 'BND', name: 'Vanguard Bond ETF', type: 'ETF' },
  { id: 11, ticker: 'TLT', name: 'iShares 20+ Year Treasury', type: 'ETF' },
  { id: 12, ticker: 'HYG', name: 'iShares High Yield Corporate', type: 'ETF' },
  { id: 13, ticker: 'VXUS', name: 'Vanguard International Stock', type: 'ETF' },
  { id: 14, ticker: 'VNQ', name: 'Vanguard Real Estate ETF', type: 'ETF' },
];

// Generate realistic transaction data
function generateMockTransactions(): Transaction[] {
  const transactions: Transaction[] = [];
  let id = 1;

  // Pattern 1: Dollar-cost averaging for each fund with different securities
  for (let month = 0; month < 12; month++) {
    const monthDate = new Date(2024, month, 15);

    // Fund 1: Monthly buys across 3 securities
    for (const securityId of [1, 2, 5]) {
      const security = SECURITIES.find(s => s.id === securityId)!;
      const basePrice = [185.50, 390.25, 545.75][securityId - 1] * (1 + (Math.random() - 0.5) * 0.2);
      const quantity = 20 + Math.floor(Math.random() * 30);
      const tradeDate = new Date(monthDate);
      tradeDate.setDate(5 + Math.floor(Math.random() * 15));

      transactions.push({
        id: id++,
        fundId: 1,
        fundCode: 'FND001',
        fundName: 'Alpha Growth Fund',
        securityId,
        securityTicker: security.ticker,
        securityName: security.name,
        transactionSubTypeId: 1,
        transactionSubTypeDescription: 'Buy',
        transactionTypeId: 1,
        transactionTypeDescription: security.type,
        tradeDate: tradeDate.toISOString().split('T')[0],
        settleDate: new Date(tradeDate.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        quantity,
        price: Math.round(basePrice * 100) / 100,
        amount: Math.round(basePrice * quantity * 100) / 100,
        currency: 'USD',
        statusId: month < 11 ? 3 : (Math.random() > 0.3 ? 3 : 2),
        statusDescription: month < 11 ? 'Settled' : (Math.random() > 0.3 ? 'Settled' : 'Confirmed'),
        createdAt: tradeDate.toISOString(),
        updatedAt: month < 11 ? tradeDate.toISOString() : (Math.random() > 0.3 ? tradeDate.toISOString() : null),
      });
    }

    // Fund 2: Monthly deposits of varying amounts
    const depositDate = new Date(monthDate);
    depositDate.setDate(1);
    transactions.push({
      id: id++,
      fundId: 2,
      fundCode: 'FND002',
      fundName: 'Beta Income Fund',
      securityId: null,
      securityTicker: null,
      securityName: null,
      transactionSubTypeId: 3,
      transactionSubTypeDescription: 'Deposit',
      transactionTypeId: 3,
      transactionTypeDescription: 'MONEY_MARKET',
      tradeDate: depositDate.toISOString().split('T')[0],
      settleDate: depositDate.toISOString().split('T')[0],
      quantity: 1,
      price: 50000 + Math.floor(Math.random() * 30000),
      amount: 50000 + Math.floor(Math.random() * 30000),
      currency: 'USD',
      statusId: month < 11 ? 3 : 3,
      statusDescription: 'Settled',
      createdAt: depositDate.toISOString(),
      updatedAt: depositDate.toISOString(),
    });

    // Fund 2: Dividend and interest payments
    if (month % 3 === 0) {
      const divDate = new Date(monthDate);
      divDate.setDate(20);
      transactions.push({
        id: id++,
        fundId: 2,
        fundCode: 'FND002',
        fundName: 'Beta Income Fund',
        securityId: null,
        securityTicker: null,
        securityName: null,
        transactionSubTypeId: 5,
        transactionSubTypeDescription: 'Dividend',
        transactionTypeId: 3,
        transactionTypeDescription: 'MONEY_MARKET',
        tradeDate: divDate.toISOString().split('T')[0],
        settleDate: divDate.toISOString().split('T')[0],
        quantity: 1,
        price: 5000 + Math.floor(Math.random() * 8000),
        amount: 5000 + Math.floor(Math.random() * 8000),
        currency: 'USD',
        statusId: 3,
        statusDescription: 'Settled',
        createdAt: divDate.toISOString(),
        updatedAt: divDate.toISOString(),
      });
    }

    if (month % 2 === 1) {
      const intDate = new Date(monthDate);
      intDate.setDate(25);
      transactions.push({
        id: id++,
        fundId: 5,
        fundCode: 'FND005',
        fundName: 'Conservative Fixed Income Fund',
        securityId: null,
        securityTicker: null,
        securityName: null,
        transactionSubTypeId: 6,
        transactionSubTypeDescription: 'Interest',
        transactionTypeId: 3,
        transactionTypeDescription: 'MONEY_MARKET',
        tradeDate: intDate.toISOString().split('T')[0],
        settleDate: intDate.toISOString().split('T')[0],
        quantity: 1,
        price: 2000 + Math.floor(Math.random() * 3000),
        amount: 2000 + Math.floor(Math.random() * 3000),
        currency: 'USD',
        statusId: 3,
        statusDescription: 'Settled',
        createdAt: intDate.toISOString(),
        updatedAt: intDate.toISOString(),
      });
    }
  }

  // Pattern 2: Rebalancing trades (sell some, buy others)
  const rebalanceDates = [
    '2024-03-15',
    '2024-06-15',
    '2024-09-15',
    '2024-12-15',
  ];

  for (const rebalDate of rebalanceDates) {
    const date = new Date(rebalDate);

    // Sell from Fund 1
    transactions.push({
      id: id++,
      fundId: 1,
      fundCode: 'FND001',
      fundName: 'Alpha Growth Fund',
      securityId: 1,
      securityTicker: 'AAPL',
      securityName: 'Apple Inc.',
      transactionSubTypeId: 2,
      transactionSubTypeDescription: 'Sell',
      transactionTypeId: 1,
      transactionTypeDescription: 'EQUITY',
      tradeDate: rebalDate,
      settleDate: new Date(date.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      quantity: -15,
      price: 180 + Math.floor(Math.random() * 40),
      amount: -(180 + Math.floor(Math.random() * 40)) * 15,
      currency: 'USD',
      statusId: 3,
      statusDescription: 'Settled',
      createdAt: date.toISOString(),
      updatedAt: date.toISOString(),
    });

    // Buy international fund
    transactions.push({
      id: id++,
      fundId: 3,
      fundCode: 'FND003',
      fundName: 'Global Balanced Fund',
      securityId: 13,
      securityTicker: 'VXUS',
      securityName: 'Vanguard International Stock',
      transactionSubTypeId: 1,
      transactionSubTypeDescription: 'Buy',
      transactionTypeId: 1,
      transactionTypeDescription: 'ETF',
      tradeDate: rebalDate,
      settleDate: new Date(date.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      quantity: 50 + Math.floor(Math.random() * 50),
      price: 110 + Math.floor(Math.random() * 20),
      amount: (110 + Math.floor(Math.random() * 20)) * (50 + Math.floor(Math.random() * 50)),
      currency: 'USD',
      statusId: 3,
      statusDescription: 'Settled',
      createdAt: date.toISOString(),
      updatedAt: date.toISOString(),
    });
  }

  // Pattern 3: Real estate fund purchases (quarterly)
  for (let q = 0; q < 4; q++) {
    const qDate = new Date(2024, q * 3 + 1, 10);
    transactions.push({
      id: id++,
      fundId: 3,
      fundCode: 'FND003',
      fundName: 'Global Balanced Fund',
      securityId: 14,
      securityTicker: 'VNQ',
      securityName: 'Vanguard Real Estate ETF',
      transactionSubTypeId: 1,
      transactionSubTypeDescription: 'Buy',
      transactionTypeId: 1,
      transactionTypeDescription: 'ETF',
      tradeDate: qDate.toISOString().split('T')[0],
      settleDate: new Date(qDate.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      quantity: 30 + Math.floor(Math.random() * 40),
      price: 95 + Math.floor(Math.random() * 15),
      amount: (95 + Math.floor(Math.random() * 15)) * (30 + Math.floor(Math.random() * 40)),
      currency: 'USD',
      statusId: 3,
      statusDescription: 'Settled',
      createdAt: qDate.toISOString(),
      updatedAt: qDate.toISOString(),
    });
  }

  // Pattern 4: Bond fund management (monthly)
  for (let month = 0; month < 12; month++) {
    const bDate = new Date(2024, month, 12);
    transactions.push({
      id: id++,
      fundId: 5,
      fundCode: 'FND005',
      fundName: 'Conservative Fixed Income Fund',
      securityId: 10,
      securityTicker: 'BND',
      securityName: 'Vanguard Bond ETF',
      transactionSubTypeId: 1,
      transactionSubTypeDescription: 'Buy',
      transactionTypeId: 1,
      transactionTypeDescription: 'ETF',
      tradeDate: bDate.toISOString().split('T')[0],
      settleDate: new Date(bDate.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      quantity: 25 + Math.floor(Math.random() * 35),
      price: 78 + Math.floor(Math.random() * 8),
      amount: (78 + Math.floor(Math.random() * 8)) * (25 + Math.floor(Math.random() * 35)),
      currency: 'USD',
      statusId: month < 11 ? 3 : (Math.random() > 0.4 ? 3 : 2),
      statusDescription: month < 11 ? 'Settled' : (Math.random() > 0.4 ? 'Settled' : 'Confirmed'),
      createdAt: bDate.toISOString(),
      updatedAt: month < 11 ? bDate.toISOString() : (Math.random() > 0.4 ? bDate.toISOString() : null),
    });
  }

  // Pattern 5: Emerging markets fund (quarterly rebalancing)
  for (let q = 0; q < 4; q++) {
    const emDate = new Date(2024, q * 3, 20);
    transactions.push({
      id: id++,
      fundId: 4,
      fundCode: 'FND004',
      fundName: 'Emerging Markets Fund',
      securityId: 9,
      securityTicker: 'LY',
      securityName: 'Li Auto Inc.',
      transactionSubTypeId: 1,
      transactionSubTypeDescription: 'Buy',
      transactionTypeId: 1,
      transactionTypeDescription: 'EQUITY',
      tradeDate: emDate.toISOString().split('T')[0],
      settleDate: new Date(emDate.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      quantity: 100 + Math.floor(Math.random() * 200),
      price: 25 + Math.floor(Math.random() * 10),
      amount: (25 + Math.floor(Math.random() * 10)) * (100 + Math.floor(Math.random() * 200)),
      currency: 'USD',
      statusId: 3,
      statusDescription: 'Settled',
      createdAt: emDate.toISOString(),
      updatedAt: emDate.toISOString(),
    });

    // Quarterly withdrawal
    transactions.push({
      id: id++,
      fundId: 4,
      fundCode: 'FND004',
      fundName: 'Emerging Markets Fund',
      securityId: null,
      securityTicker: null,
      securityName: null,
      transactionSubTypeId: 4,
      transactionSubTypeDescription: 'Withdrawal',
      transactionTypeId: 3,
      transactionTypeDescription: 'MONEY_MARKET',
      tradeDate: new Date(emDate.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      settleDate: new Date(emDate.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      quantity: 1,
      price: -(10000 + Math.floor(Math.random() * 15000)),
      amount: -(10000 + Math.floor(Math.random() * 15000)),
      currency: 'USD',
      statusId: 3,
      statusDescription: 'Settled',
      createdAt: new Date(emDate.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(emDate.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    });
  }

  // Pattern 6: Tactical trades for high-volatility securities (bi-weekly)
  const tacticalSecurities = [
    { id: 6, ticker: 'TSLA', name: 'Tesla Inc.' },
    { id: 7, ticker: 'META', name: 'Meta Platforms Inc.' },
    { id: 8, ticker: 'AVGO', name: 'Broadcom Inc.' },
  ];

  for (let month = 0; month < 12; month++) {
    for (let week = 0; week < 2; week++) {
      for (const sec of tacticalSecurities) {
        const baseDay = week * 14 + 5;
        const tDate = new Date(2024, month, Math.min(baseDay + Math.floor(Math.random() * 7), 28));
        const isBuy = Math.random() > 0.4;
        const quantity = (30 + Math.floor(Math.random() * 80)) * (isBuy ? 1 : -1);

        transactions.push({
          id: id++,
          fundId: 1,
          fundCode: 'FND001',
          fundName: 'Alpha Growth Fund',
          securityId: sec.id,
          securityTicker: sec.ticker,
          securityName: sec.name,
          transactionSubTypeId: isBuy ? 1 : 2,
          transactionSubTypeDescription: isBuy ? 'Buy' : 'Sell',
          transactionTypeId: 1,
          transactionTypeDescription: 'EQUITY',
          tradeDate: tDate.toISOString().split('T')[0],
          settleDate: new Date(tDate.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          quantity,
          price: 100 + Math.floor(Math.random() * 400),
          amount: (100 + Math.floor(Math.random() * 400)) * Math.abs(quantity),
          currency: 'USD',
          statusId: month < 11 ? 3 : (Math.random() > 0.2 ? 3 : 2),
          statusDescription: month < 11 ? 'Settled' : (Math.random() > 0.2 ? 'Settled' : 'Confirmed'),
          createdAt: tDate.toISOString(),
          updatedAt: month < 11 ? tDate.toISOString() : (Math.random() > 0.2 ? tDate.toISOString() : null),
        });
      }
    }
  }

  // Pattern 7: High-yield bond purchases
  for (let month = 0; month < 12; month += 3) {
    const hyDate = new Date(2024, month, 15);
    transactions.push({
      id: id++,
      fundId: 5,
      fundCode: 'FND005',
      fundName: 'Conservative Fixed Income Fund',
      securityId: 12,
      securityTicker: 'HYG',
      securityName: 'iShares High Yield Corporate',
      transactionSubTypeId: 1,
      transactionSubTypeDescription: 'Buy',
      transactionTypeId: 1,
      transactionTypeDescription: 'ETF',
      tradeDate: hyDate.toISOString().split('T')[0],
      settleDate: new Date(hyDate.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      quantity: 40 + Math.floor(Math.random() * 50),
      price: 85 + Math.floor(Math.random() * 10),
      amount: (85 + Math.floor(Math.random() * 10)) * (40 + Math.floor(Math.random() * 50)),
      currency: 'USD',
      statusId: 3,
      statusDescription: 'Settled',
      createdAt: hyDate.toISOString(),
      updatedAt: hyDate.toISOString(),
    });
  }

  // Pattern 8: Fund 3 (Global Balanced) - Monthly bond purchases
  for (let month = 0; month < 12; month++) {
    const gbDate = new Date(2024, month, 8);
    transactions.push({
      id: id++,
      fundId: 3,
      fundCode: 'FND003',
      fundName: 'Global Balanced Fund',
      securityId: 11,
      securityTicker: 'TLT',
      securityName: 'iShares 20+ Year Treasury',
      transactionSubTypeId: 1,
      transactionSubTypeDescription: 'Buy',
      transactionTypeId: 1,
      transactionTypeDescription: 'ETF',
      tradeDate: gbDate.toISOString().split('T')[0],
      settleDate: new Date(gbDate.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      quantity: 20 + Math.floor(Math.random() * 40),
      price: 85 + Math.floor(Math.random() * 20),
      amount: (85 + Math.floor(Math.random() * 20)) * (20 + Math.floor(Math.random() * 40)),
      currency: 'USD',
      statusId: month < 11 ? 3 : (Math.random() > 0.5 ? 3 : 2),
      statusDescription: month < 11 ? 'Settled' : (Math.random() > 0.5 ? 'Settled' : 'Confirmed'),
      createdAt: gbDate.toISOString(),
      updatedAt: month < 11 ? gbDate.toISOString() : (Math.random() > 0.5 ? gbDate.toISOString() : null),
    });
  }

  // Pattern 9: Fund 4 (Emerging Markets) - Additional equity purchases
  for (let month = 0; month < 12; month += 2) {
    const emEquityDate = new Date(2024, month, 25);
    const ems = [{ id: 3, ticker: 'GOOGL', name: 'Alphabet Inc.' }, { id: 4, ticker: 'AMZN', name: 'Amazon Inc.' }];
    for (const em of ems) {
      transactions.push({
        id: id++,
        fundId: 4,
        fundCode: 'FND004',
        fundName: 'Emerging Markets Fund',
        securityId: em.id,
        securityTicker: em.ticker,
        securityName: em.name,
        transactionSubTypeId: 1,
        transactionSubTypeDescription: 'Buy',
        transactionTypeId: 1,
        transactionTypeDescription: 'EQUITY',
        tradeDate: emEquityDate.toISOString().split('T')[0],
        settleDate: new Date(emEquityDate.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        quantity: 30 + Math.floor(Math.random() * 60),
        price: 100 + Math.floor(Math.random() * 250),
        amount: (100 + Math.floor(Math.random() * 250)) * (30 + Math.floor(Math.random() * 60)),
        currency: 'USD',
        statusId: 3,
        statusDescription: 'Settled',
        createdAt: emEquityDate.toISOString(),
        updatedAt: emEquityDate.toISOString(),
      });
    }
  }

  // Pattern 10: Weekly dividend/interest income for multiple funds
  for (let week = 0; week < 52; week++) {
    const weekDate = new Date(2024, 0, 1 + week * 7);
    if (week % 4 === 0) {
      transactions.push({
        id: id++,
        fundId: 2,
        fundCode: 'FND002',
        fundName: 'Beta Income Fund',
        securityId: null,
        securityTicker: null,
        securityName: null,
        transactionSubTypeId: 5,
        transactionSubTypeDescription: 'Dividend',
        transactionTypeId: 3,
        transactionTypeDescription: 'MONEY_MARKET',
        tradeDate: weekDate.toISOString().split('T')[0],
        settleDate: weekDate.toISOString().split('T')[0],
        quantity: 1,
        price: 1000 + Math.floor(Math.random() * 2000),
        amount: 1000 + Math.floor(Math.random() * 2000),
        currency: 'USD',
        statusId: 3,
        statusDescription: 'Settled',
        createdAt: weekDate.toISOString(),
        updatedAt: weekDate.toISOString(),
      });
    }

    if (week % 5 === 0) {
      transactions.push({
        id: id++,
        fundId: 5,
        fundCode: 'FND005',
        fundName: 'Conservative Fixed Income Fund',
        securityId: null,
        securityTicker: null,
        securityName: null,
        transactionSubTypeId: 6,
        transactionSubTypeDescription: 'Interest',
        transactionTypeId: 3,
        transactionTypeDescription: 'MONEY_MARKET',
        tradeDate: weekDate.toISOString().split('T')[0],
        settleDate: weekDate.toISOString().split('T')[0],
        quantity: 1,
        price: 500 + Math.floor(Math.random() * 1500),
        amount: 500 + Math.floor(Math.random() * 1500),
        currency: 'USD',
        statusId: 3,
        statusDescription: 'Settled',
        createdAt: weekDate.toISOString(),
        updatedAt: weekDate.toISOString(),
      });
    }
  }

  // Pattern 11: Additional rebalancing transactions
  for (let month = 1; month < 12; month += 2) {
    const rebalDate = new Date(2024, month, 10);
    transactions.push({
      id: id++,
      fundId: 2,
      fundCode: 'FND002',
      fundName: 'Beta Income Fund',
      securityId: 3,
      securityTicker: 'GOOGL',
      securityName: 'Alphabet Inc.',
      transactionSubTypeId: 1,
      transactionSubTypeDescription: 'Buy',
      transactionTypeId: 1,
      transactionTypeDescription: 'EQUITY',
      tradeDate: rebalDate.toISOString().split('T')[0],
      settleDate: new Date(rebalDate.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      quantity: 10 + Math.floor(Math.random() * 30),
      price: 140 + Math.floor(Math.random() * 50),
      amount: (140 + Math.floor(Math.random() * 50)) * (10 + Math.floor(Math.random() * 30)),
      currency: 'USD',
      statusId: 3,
      statusDescription: 'Settled',
      createdAt: rebalDate.toISOString(),
      updatedAt: rebalDate.toISOString(),
    });
  }

  // Pattern 12: Random cash management activities
  for (let month = 0; month < 12; month++) {
    const rnd = Math.random();
    if (rnd > 0.7) {
      const cashDate = new Date(2024, month, 10 + Math.floor(Math.random() * 15));
      const isFund = 1 + Math.floor(Math.random() * 4);
      const fundData = FUNDS[isFund - 1];
      transactions.push({
        id: id++,
        fundId: fundData.id,
        fundCode: fundData.code,
        fundName: fundData.name,
        securityId: null,
        securityTicker: null,
        securityName: null,
        transactionSubTypeId: rnd > 0.85 ? 4 : 3,
        transactionSubTypeDescription: rnd > 0.85 ? 'Withdrawal' : 'Deposit',
        transactionTypeId: 3,
        transactionTypeDescription: 'MONEY_MARKET',
        tradeDate: cashDate.toISOString().split('T')[0],
        settleDate: cashDate.toISOString().split('T')[0],
        quantity: 1,
        price: rnd > 0.85 ? -(15000 + Math.floor(Math.random() * 25000)) : (20000 + Math.floor(Math.random() * 40000)),
        amount: rnd > 0.85 ? -(15000 + Math.floor(Math.random() * 25000)) : (20000 + Math.floor(Math.random() * 40000)),
        currency: 'USD',
        statusId: 3,
        statusDescription: 'Settled',
        createdAt: cashDate.toISOString(),
        updatedAt: cashDate.toISOString(),
      });
    }
  }

  // Pattern 13: Additional intra-month tactical adjustments (Alpha fund)
  for (let month = 0; month < 12; month++) {
    for (let i = 0; i < 2; i++) {
      const adjustDate = new Date(2024, month, 3 + i * 13 + Math.floor(Math.random() * 5));
      const sec = SECURITIES[Math.floor(Math.random() * 5)]; // Pick from top 5
      const isBuy = Math.random() > 0.45;

      transactions.push({
        id: id++,
        fundId: 1,
        fundCode: 'FND001',
        fundName: 'Alpha Growth Fund',
        securityId: sec.id,
        securityTicker: sec.ticker,
        securityName: sec.name,
        transactionSubTypeId: isBuy ? 1 : 2,
        transactionSubTypeDescription: isBuy ? 'Buy' : 'Sell',
        transactionTypeId: 1,
        transactionTypeDescription: sec.type,
        tradeDate: adjustDate.toISOString().split('T')[0],
        settleDate: new Date(adjustDate.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        quantity: (15 + Math.floor(Math.random() * 40)) * (isBuy ? 1 : -1),
        price: 100 + Math.floor(Math.random() * 300),
        amount: (100 + Math.floor(Math.random() * 300)) * (15 + Math.floor(Math.random() * 40)),
        currency: 'USD',
        statusId: month < 10 ? 3 : (Math.random() > 0.3 ? 3 : 2),
        statusDescription: month < 10 ? 'Settled' : (Math.random() > 0.3 ? 'Settled' : 'Confirmed'),
        createdAt: adjustDate.toISOString(),
        updatedAt: month < 10 ? adjustDate.toISOString() : null,
      });
    }
  }

  // Pattern 14: Global fund rebalancing trades (every 2 weeks)
  for (let week = 1; week < 26; week += 2) {
    const rebalWeekDate = new Date(2024, 0, 1 + week * 7);
    const globalSecurities = [
      { id: 13, ticker: 'VXUS', name: 'Vanguard International Stock' },
      { id: 14, ticker: 'VNQ', name: 'Vanguard Real Estate ETF' },
    ];

    for (const sec of globalSecurities) {
      const isBuy = Math.random() > 0.5;
      transactions.push({
        id: id++,
        fundId: 3,
        fundCode: 'FND003',
        fundName: 'Global Balanced Fund',
        securityId: sec.id,
        securityTicker: sec.ticker,
        securityName: sec.name,
        transactionSubTypeId: isBuy ? 1 : 2,
        transactionSubTypeDescription: isBuy ? 'Buy' : 'Sell',
        transactionTypeId: 1,
        transactionTypeDescription: 'ETF',
        tradeDate: rebalWeekDate.toISOString().split('T')[0],
        settleDate: new Date(rebalWeekDate.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        quantity: (20 + Math.floor(Math.random() * 40)) * (isBuy ? 1 : -1),
        price: 90 + Math.floor(Math.random() * 40),
        amount: (90 + Math.floor(Math.random() * 40)) * (20 + Math.floor(Math.random() * 40)),
        currency: 'USD',
        statusId: 3,
        statusDescription: 'Settled',
        createdAt: rebalWeekDate.toISOString(),
        updatedAt: rebalWeekDate.toISOString(),
      });
    }
  }

  // Pattern 15: Income fund quarterly reviews with trades
  for (let q = 0; q < 4; q++) {
    const qDate = new Date(2024, q * 3 + 2, 28);
    const incomeSecurities = [
      { id: 10, ticker: 'BND', name: 'Vanguard Bond ETF' },
      { id: 12, ticker: 'HYG', name: 'iShares High Yield Corporate' },
    ];

    for (const sec of incomeSecurities) {
      const isBuy = Math.random() > 0.6;
      if (isBuy || q > 0) {
        // Only sell if not first quarter for BND
        transactions.push({
          id: id++,
          fundId: 2,
          fundCode: 'FND002',
          fundName: 'Beta Income Fund',
          securityId: sec.id,
          securityTicker: sec.ticker,
          securityName: sec.name,
          transactionSubTypeId: isBuy ? 1 : 2,
          transactionSubTypeDescription: isBuy ? 'Buy' : 'Sell',
          transactionTypeId: 1,
          transactionTypeDescription: 'ETF',
          tradeDate: qDate.toISOString().split('T')[0],
          settleDate: new Date(qDate.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          quantity: (25 + Math.floor(Math.random() * 50)) * (isBuy ? 1 : -1),
          price: 80 + Math.floor(Math.random() * 20),
          amount: (80 + Math.floor(Math.random() * 20)) * (25 + Math.floor(Math.random() * 50)),
          currency: 'USD',
          statusId: 3,
          statusDescription: 'Settled',
          createdAt: qDate.toISOString(),
          updatedAt: qDate.toISOString(),
        });
      }
    }
  }

  // Pattern 16: Emerging markets quarterly strategic adjustments
  for (let q = 0; q < 4; q++) {
    const stratDate = new Date(2024, q * 3 + 1, 15);
    const emSecurities = [
      { id: 5, ticker: 'NVDA', name: 'NVIDIA Corporation' },
      { id: 9, ticker: 'LY', name: 'Li Auto Inc.' },
    ];

    for (const sec of emSecurities) {
      transactions.push({
        id: id++,
        fundId: 4,
        fundCode: 'FND004',
        fundName: 'Emerging Markets Fund',
        securityId: sec.id,
        securityTicker: sec.ticker,
        securityName: sec.name,
        transactionSubTypeId: 1,
        transactionSubTypeDescription: 'Buy',
        transactionTypeId: 1,
        transactionTypeDescription: 'EQUITY',
        tradeDate: stratDate.toISOString().split('T')[0],
        settleDate: new Date(stratDate.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        quantity: 50 + Math.floor(Math.random() * 100),
        price: 100 + Math.floor(Math.random() * 300),
        amount: (100 + Math.floor(Math.random() * 300)) * (50 + Math.floor(Math.random() * 100)),
        currency: 'USD',
        statusId: 3,
        statusDescription: 'Settled',
        createdAt: stratDate.toISOString(),
        updatedAt: stratDate.toISOString(),
      });
    }
  }

  // Pattern 17: Conservative fund monthly income reinvestments
  for (let month = 1; month < 12; month++) {
    const reinvestDate = new Date(2024, month, 27);
    transactions.push({
      id: id++,
      fundId: 5,
      fundCode: 'FND005',
      fundName: 'Conservative Fixed Income Fund',
      securityId: 11,
      securityTicker: 'TLT',
      securityName: 'iShares 20+ Year Treasury',
      transactionSubTypeId: 1,
      transactionSubTypeDescription: 'Buy',
      transactionTypeId: 1,
      transactionTypeDescription: 'ETF',
      tradeDate: reinvestDate.toISOString().split('T')[0],
      settleDate: new Date(reinvestDate.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      quantity: 10 + Math.floor(Math.random() * 25),
      price: 80 + Math.floor(Math.random() * 25),
      amount: (80 + Math.floor(Math.random() * 25)) * (10 + Math.floor(Math.random() * 25)),
      currency: 'USD',
      statusId: month < 11 ? 3 : (Math.random() > 0.4 ? 3 : 2),
      statusDescription: month < 11 ? 'Settled' : (Math.random() > 0.4 ? 'Settled' : 'Confirmed'),
      createdAt: reinvestDate.toISOString(),
      updatedAt: month < 11 ? reinvestDate.toISOString() : null,
    });
  }

  // Pattern 18: Some failed/cancelled transactions (recent)
  for (let i = 0; i < 8; i++) {
    const failDate = new Date(2024, 10 + Math.floor(Math.random() * 2), 10 + Math.floor(Math.random() * 20));
    const security = SECURITIES[Math.floor(Math.random() * SECURITIES.length)];

    transactions.push({
      id: id++,
      fundId: FUNDS[Math.floor(Math.random() * FUNDS.length)].id,
      fundCode: FUNDS[Math.floor(Math.random() * FUNDS.length)].code,
      fundName: FUNDS[Math.floor(Math.random() * FUNDS.length)].name,
      securityId: security.id,
      securityTicker: security.ticker,
      securityName: security.name,
      transactionSubTypeId: Math.random() > 0.5 ? 1 : 2,
      transactionSubTypeDescription: Math.random() > 0.5 ? 'Buy' : 'Sell',
      transactionTypeId: 1,
      transactionTypeDescription: security.type,
      tradeDate: failDate.toISOString().split('T')[0],
      settleDate: failDate.toISOString().split('T')[0],
      quantity: Math.random() > 0.5 ? 10 + Math.floor(Math.random() * 50) : -(10 + Math.floor(Math.random() * 50)),
      price: 100 + Math.floor(Math.random() * 300),
      amount: (100 + Math.floor(Math.random() * 300)) * (10 + Math.floor(Math.random() * 50)),
      currency: 'USD',
      statusId: Math.random() > 0.5 ? 4 : 5,
      statusDescription: Math.random() > 0.5 ? 'Cancelled' : 'Failed',
      createdAt: failDate.toISOString(),
      updatedAt: failDate.toISOString(),
    });
  }

  return transactions.sort((a, b) => a.id - b.id);
}

export const MOCK_TRANSACTIONS: Transaction[] = generateMockTransactions();

/**
 * Mock transaction statuses for local development.
 * @internal
 */
export const MOCK_TRANSACTION_STATUSES: TransactionStatus[] = [
  {
    id: 1,
    shortDescription: 'Pending',
    longDescription: 'Transaction is pending approval or processing',
    createdAt: '2020-01-01T00:00:00Z',
    updatedAt: null,
  },
  {
    id: 2,
    shortDescription: 'Confirmed',
    longDescription: 'Transaction has been confirmed and is awaiting settlement',
    createdAt: '2020-01-01T00:00:00Z',
    updatedAt: null,
  },
  {
    id: 3,
    shortDescription: 'Settled',
    longDescription: 'Transaction has been fully settled',
    createdAt: '2020-01-01T00:00:00Z',
    updatedAt: null,
  },
  {
    id: 4,
    shortDescription: 'Cancelled',
    longDescription: 'Transaction has been cancelled',
    createdAt: '2020-01-01T00:00:00Z',
    updatedAt: null,
  },
  {
    id: 5,
    shortDescription: 'Failed',
    longDescription: 'Transaction failed to process',
    createdAt: '2020-01-01T00:00:00Z',
    updatedAt: null,
  },
];

/**
 * Mock transaction sub-types for local development.
 * @internal
 */
export const MOCK_TRANSACTION_SUBTYPES: TransactionSubType[] = [
  {
    id: 1,
    typeId: 1,
    typeDescription: 'Equity',
    shortDescription: 'Buy',
    longDescription: 'Purchase equity securities',
    createdAt: '2020-01-01T00:00:00Z',
    updatedAt: null,
  },
  {
    id: 2,
    typeId: 1,
    typeDescription: 'Equity',
    shortDescription: 'Sell',
    longDescription: 'Sell equity securities',
    createdAt: '2020-01-01T00:00:00Z',
    updatedAt: null,
  },
  {
    id: 3,
    typeId: 3,
    typeDescription: 'Cash',
    shortDescription: 'Deposit',
    longDescription: 'Cash deposit into fund',
    createdAt: '2020-01-01T00:00:00Z',
    updatedAt: null,
  },
  {
    id: 4,
    typeId: 3,
    typeDescription: 'Cash',
    shortDescription: 'Withdrawal',
    longDescription: 'Cash withdrawal from fund',
    createdAt: '2020-01-01T00:00:00Z',
    updatedAt: null,
  },
  {
    id: 5,
    typeId: 2,
    typeDescription: 'Fixed Income',
    shortDescription: 'Buy',
    longDescription: 'Purchase fixed income securities',
    createdAt: '2020-01-01T00:00:00Z',
    updatedAt: null,
  },
  {
    id: 6,
    typeId: 2,
    typeDescription: 'Fixed Income',
    shortDescription: 'Sell',
    longDescription: 'Sell fixed income securities',
    createdAt: '2020-01-01T00:00:00Z',
    updatedAt: null,
  },
  {
    id: 7,
    typeId: 3,
    typeDescription: 'Cash',
    shortDescription: 'Dividend',
    longDescription: 'Dividend income received',
    createdAt: '2020-01-01T00:00:00Z',
    updatedAt: null,
  },
  {
    id: 8,
    typeId: 3,
    typeDescription: 'Cash',
    shortDescription: 'Interest',
    longDescription: 'Interest income received',
    createdAt: '2020-01-01T00:00:00Z',
    updatedAt: null,
  },
];
