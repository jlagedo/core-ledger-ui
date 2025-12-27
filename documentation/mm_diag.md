Absolutely, João — here are **Mermaid flowcharts** for every major feature in your ABOR tutorial app. They’re clean, copy‑paste ready, and structured so you can drop them directly into Markdown, GitHub, Notion, or documentation.

I’ll break them down by module so you can keep everything organized.

---

# 📊 **1. Dashboard — Mermaid Diagram**

```mermaid
flowchart TD
    A[Open App] --> B[Load Dashboard Data<br/>NAV, Cash, Alerts]
    B --> C[Display Dashboard]
    C --> D[Go to Load Prices]
    C --> E[Go to Capture Transaction]
    C --> F[Go to Run Valuation]
    C --> G[View Alerts]
```
---

# 📁 **2. Funds**

## **2.1 Fund List**

```mermaid
flowchart TD
    A[Click Fund List] --> B[Load Funds]
    B --> C[Display Fund List]
    C --> D[Create Fund]
    C --> E[Select Fund → Fund Details]
```

---

## **2.2 Create Fund**

```mermaid
flowchart TD
    A[Click Create Fund] --> B[Show Empty Form]
    B --> C[User Enters Fund Data]
    C --> D[Click Save]
    D --> E{Valid Input?}
    E -->|No| F[Show Validation Errors]
    E -->|Yes| G[Create Fund Record]
    G --> H[Redirect to Fund Details]
```

---

## **2.3 Fund Details**

```mermaid
flowchart TD
    A[Select Fund] --> B[Load Fund Details]
    B --> C[Display Fund Metadata]
    C --> D[Holdings Tab]
    C --> E[Cash Ledger Tab]
    C --> F[Transactions Tab]
    C --> G[NAV Tab]
```

---

# 💼 **3. Portfolio**

## **3.1 Holdings**

```mermaid
flowchart TD
    A[Click Holdings] --> B[Load Holdings + Prices]
    B --> C[Calculate Market Values]
    C --> D[Display Holdings Table]
```

---

## **3.2 Cash Ledger**

```mermaid
flowchart TD
    A[Click Cash Ledger] --> B[Load Cash Movements]
    B --> C[Compute Opening/Closing Balances]
    C --> D[Display Cash Ledger]
```

---

# 🔁 **4. Transactions**

## **4.1 Capture Transaction**

```mermaid
flowchart TD
    A[Click Capture Transaction] --> B[Show Transaction Form]
    B --> C[User Enters Data]
    C --> D[Click Submit]
    D --> E{Valid?}
    E -->|No| F[Show Errors]
    E -->|Yes| G[Save Transaction]
    G --> H[Update Holdings & Cash]
    H --> I[Redirect to Transaction Ledger]
```

---

## **4.2 Transaction Ledger**

```mermaid
flowchart TD
    A[Click Transaction Ledger] --> B[Load Transactions]
    B --> C[Display Transaction Table]
```

---

# 💵 **5. Pricing & Valuation**

## **5.1 Load Prices**

```mermaid
flowchart TD
    A[Click Load Prices] --> B[Load Securities]
    B --> C[User Enters Prices]
    C --> D[Click Save Prices]
    D --> E[Validate & Save Prices]
```

---

## **5.2 Run Valuation**

```mermaid
flowchart TD
    A[Click Run Valuation] --> B[Select Valuation Date]
    B --> C[Fetch Holdings & Prices]
    C --> D[Calculate Market Values]
    D --> E[Compute Total Assets]
    E --> F[Display Valuation Summary]
```

---

# 🧮 **6. NAV**

## **6.1 Calculate NAV**

```mermaid
flowchart TD
    A[Click Calculate NAV] --> B[Load Valuation Results]
    B --> C[User Enters Liabilities & Shares]
    C --> D[Click Save NAV]
    D --> E[Compute NAV & NAV per Share]
    E --> F[Save NAV Record]
```

---

## **6.2 NAV History**

```mermaid
flowchart TD
    A[Click NAV History] --> B[Load NAV Records]
    B --> C[Display NAV Table]
```

---

# 📄 **7. Reports**

## **7.1 Holdings Report**

```mermaid
flowchart TD
    A[Click Holdings Report] --> B[Load Valuation Data]
    B --> C[Calculate % of NAV]
    C --> D[Display Holdings Report]
```

---

## **7.2 Cash Report**

```mermaid
flowchart TD
    A[Click Cash Report] --> B[Load Cash Ledger]
    B --> C[Summarize Movements]
    C --> D[Display Cash Report]
```

---

## **7.3 NAV Report**

```mermaid
flowchart TD
    A[Click NAV Report] --> B[Load NAV Record]
    B --> C[Display NAV Breakdown]
```

---

# ⚙️ **8. Admin / Reference Data**

## **8.1 Securities**

```mermaid
flowchart TD
    A[Click Securities] --> B[Load Security List]
    B --> C[Display Securities]
    C --> D[Create Security]
    C --> E[Edit Security]
```

---

## **8.2 Create Security**

```mermaid
flowchart TD
    A[Click Create Security] --> B[Show Security Form]
    B --> C[User Enters Data]
    C --> D[Click Save]
    D --> E{Valid?}
    E -->|No| F[Show Errors]
    E -->|Yes| G[Save Security]
    G --> H[Return to Security List]
```

---

# 🎯 Want the next layer?

I can also generate:

- **Mermaid sequence diagrams** (system interactions)
- **Mermaid ERD diagrams** (database schema)
- **Mermaid class diagrams** (domain model)
- **Mermaid user journey maps**
- **A full Mermaid architecture diagram**

Just tell me what you want to visualize next.
