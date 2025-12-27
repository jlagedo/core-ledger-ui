Here’s a compact, end‑to‑end script you can follow as if this were a real tutorial course. It’s structured as “chapters” you can turn into pages, videos, or lessons.

---

### Chapter 1: Intro and mental model

**Goal:** Give the learner a mental model of ABOR and what this app does.

- **Explain what ABOR is:**  
  “ABOR is the official accounting ledger of a fund. It tracks positions, cash, and NAV over time.”
- **Explain what they’ll build/use:**  
  “This app simulates a small fund‑accounting system: you’ll create a fund, load trades, value the portfolio, and calculate NAV.”
- **Show the core data model (simple):**
  - **Fund** – the container
  - **Securities** – what the fund can invest in
  - **Transactions** – buys/sells/dividends/expenses
  - **Holdings** – positions derived from transactions
  - **Prices** – daily market prices
  - **Cash ledger** – cash movements
  - **NAV** – result of valuation

End this chapter with a screenshot/wireframe of the main layout and sidebar to anchor their expectations.

---

### Chapter 2: Creating the first fund

**Goal:** Have a live fund ready to be populated.

**Narration points:**

1. **Navigate to Funds → Fund List.**
  - Show the empty state: “You currently have no funds.”
2. **Click [Create Fund].**
3. **Fill the form:**
  - **Fund Name:** “Alpha Global Fund”
  - **Base Currency:** “USD”
  - **Inception Date:** today or a recent historical date
  - **Valuation Frequency:** “Daily”
4. **Click [Save].**

**Concept callout:**  
“Every accounting record in this app will be tied to this fund. In real ABOR systems, each fund has its own ledger (or sub‑ledger).”

**Checkpoint:** Show the new fund in Fund List and open Fund Details. Show tabs: Holdings, Cash Ledger, Transactions, NAV.

---

### Chapter 3: Setting up instruments (securities)

**Goal:** Create a minimal security master the fund can trade.

**Narration points:**

1. **Go to Admin / Reference Data → Securities.**
2. **Click [Create Security].**
3. **Create at least 3 instruments:**

  - **Security 1:**
    - Name: “Apple Inc.”
    - Ticker: AAPL
    - Type: equity
    - Currency: USD
  - **Security 2:**
    - Name: “Microsoft Corp.”
    - Ticker: MSFT
    - Type: equity
    - Currency: USD
  - **Security 3 (cash):**
    - Name: “USD Cash”
    - Type: cash
    - Currency: USD

**Concept callout:**  
“In real fund accounting, there’s usually a central security master. We’re modeling a tiny version of that here.”

---

### Chapter 4: Capturing transactions

**Goal:** Enter sample trades so the system can derive holdings and cash.

Use a small, coherent scenario. For example:

- Starting cash: 50,000 USD (assume the fund was seeded)
- Buy AAPL and MSFT using that cash
- Receive a dividend
- Book a fund expense

**Narration points:**

1. **Navigate to Transactions → Capture Transaction.**

2. **Transaction 1 – Seed cash subscription (optional but educational):**
  - Fund: Alpha Global Fund
  - Type: subscription
  - Security: (none or USD Cash)
  - Trade Date: 2025‑01‑01
  - Settle Date: 2025‑01‑01
  - Quantity: (leave blank or 1)
  - Price: (leave blank or 1)
  - Amount: 50,000
  - Currency: USD  
    Submit.

3. **Transaction 2 – Buy AAPL:**
  - Type: buy
  - Security: AAPL
  - Trade Date: 2025‑01‑02
  - Settle Date: 2025‑01‑03
  - Quantity: 100
  - Price: 150
  - Amount: 15,000
  - Currency: USD  
    Submit.

4. **Transaction 3 – Buy MSFT:**
  - Type: buy
  - Security: MSFT
  - Trade Date: 2025‑01‑02
  - Settle Date: 2025‑01‑03
  - Quantity: 50
  - Price: 300
  - Amount: 15,000
  - Currency: USD  
    Submit.

5. **Transaction 4 – Dividend from AAPL:**
  - Type: dividend
  - Security: AAPL
  - Trade Date: 2025‑01‑10
  - Settle Date: 2025‑01‑10
  - Amount: 100
  - Currency: USD  
    Submit.

6. **Transaction 5 – Management fee expense:**
  - Type: expense
  - Security: (none)
  - Trade Date: 2025‑01‑10
  - Settle Date: 2025‑01‑10
  - Amount: 50
  - Currency: USD  
    Submit.

**Concept callouts:**

- “Transactions are the raw events. Holdings and cash are derived, not directly edited.”
- “Subscriptions/redemptions affect investors’ capital; buys/sells affect positions; dividends and expenses affect P&L and cash.”

**Checkpoint:** Show Transactions → Transaction Ledger with all 5 events listed.

---

### Chapter 5: Reviewing holdings and cash

**Goal:** Show how transactions roll up into positions and cash.

#### 5.1 Holdings

1. **Go to Portfolio → Holdings (for Alpha Global Fund).**
2. Explain what they see:
  - AAPL: quantity 100
  - MSFT: quantity 50
  - No market values yet (prices not loaded).

**Concept callout:**  
“Holdings represent positions by security. The system calculates quantity and cost based on buy/sell transactions.”

#### 5.2 Cash ledger

1. **Go to Portfolio → Cash Ledger.**
2. Show a simple breakdown (even if you compute behind the scenes):
  - Opening balance (from subscription): 50,000
  - – AAPL buy: 15,000
  - – MSFT buy: 15,000
  - + Dividend: 100
  - – Expense: 50
  - Closing balance: 20,050

**Concept callout:**  
“Cash is the backbone of fund accounting. Every transaction has a cash impact, and your closing cash must reconcile.”

---

### Chapter 6: Loading prices and running valuation

**Goal:** Turn positions into market values using daily prices.

#### 6.1 Load prices

1. **Navigate to Pricing & Valuation → Load Prices.**
2. Choose a date: 2025‑01‑10.
3. For each security:
  - AAPL: price 155
  - MSFT: price 310
  - USD Cash: price 1 (if shown)

4. Click [Save Prices].

**Concept callout:**  
“ABOR uses official prices as of a valuation date. Different sources may exist, but we’re manually entering them here.”

#### 6.2 Run valuation

1. **Go to Pricing & Valuation → Run Valuation.**
2. Select:
  - Fund: Alpha Global Fund
  - Valuation Date: 2025‑01‑10
3. Trigger [Run Valuation].

Explain what the engine does, step by step:

- For each holding:
  - AAPL: quantity 100 × 155 = 15,500
  - MSFT: quantity 50 × 310 = 15,500
- Total market value of securities = 31,000
- Cash = 20,050
- Total assets (before liabilities) = 51,050

Show a summary view:

```
Holdings:
- AAPL: 100 @ 155 = 15,500
- MSFT: 50 @ 310 = 15,500

Total securities: 31,000
Cash: 20,050
Total assets: 51,050
```

---

### Chapter 7: Calculating and storing NAV

**Goal:** Connect valuation to NAV and make it tangible.

#### 7.1 Simple NAV calculation

1. **Navigate to NAV → Calculate NAV.**
2. Select:
  - Fund: Alpha Global Fund
  - Date: 2025‑01‑10

3. Show prefilled data from valuation:
  - Total assets: 51,050
  - Liabilities: assume 0 (we already modeled the expense as reducing cash/P&L)
  - NAV: 51,050

4. Choose a number of shares outstanding to make NAV per share intuitive:
  - Shares outstanding: 5,105
  - NAV per share = 51,050 ÷ 5,105 = 10.00

5. Click [Save NAV].

**Concept callouts:**

- “NAV = assets − liabilities. This is the core output of ABOR.”
- “NAV per share = NAV ÷ shares outstanding, which investors actually see.”

#### 7.2 NAV history

1. **Go to NAV → NAV History.**
2. Show the row for 2025‑01‑10:
  - Date: 2025‑01‑10
  - NAV: 51,050
  - NAV per share: 10.00

Explain how, in reality, this is run daily and audited.

---

### Chapter 8: Reporting and tying it all together

**Goal:** Show how ABOR output becomes consumable reports.

#### 8.1 Holdings report

1. **Navigate to Reports → Holdings Report.**
2. Choose:
  - Fund: Alpha Global Fund
  - Date: 2025‑01‑10
3. Show table:

  - Security | Quantity | Price | Market Value | % of NAV
  - AAPL | 100 | 155 | 15,500 | ~30.4%
  - MSFT | 50 | 310 | 15,500 | ~30.4%
  - Cash | — | — | 20,050 | ~39.3%

#### 8.2 Cash report

1. **Navigate to Reports → Cash Report.**
2. Show opening cash, transactions, closing cash for the period.

#### 8.3 NAV report

1. **Navigate to Reports → NAV Report.**
2. Show:
  - Total market value of securities
  - Cash
  - Liabilities (if any)
  - NAV
  - NAV per share

**Final concept wrap‑up:**

- “You’ve just walked through the daily ABOR cycle: transactions → holdings & cash → prices → valuation → NAV → reports.”
- “The same logic scales to many funds, more instruments, multiple currencies, and complex fees — but the core remains the same.”

---

### How you can extend this tutorial

If you want a “Part 2” of the tutorial, next logical modules are:

- Multi‑currency (FX rates, base currency translation)
- Multiple funds sharing the same security master
- Corporate actions (splits, dividends with tax)
- Automated imports: transaction files, price feeds
- Basic exception checks (e.g., missing price, negative cash)

If you tell me your tech stack (e.g., React + Node, Django, .NET, etc.), I can turn this script into concrete endpoints, components, and sample code to back each chapter.
