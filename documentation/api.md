# 📘 1. Chart of Accounts API

## **GET /accounts**
List all accounts.

### Response
```json
[
  {
    "id": "acc-1001",
    "code": "1001",
    "name": "Cash",
    "type": "ASSET",
    "status": "ACTIVE",
    "normalBalance": "DEBIT"
  }
]
```

---

## **POST /accounts**
Create a new account.

### Request
```json
{
  "code": "2001",
  "name": "Accounts Payable",
  "type": "LIABILITY",
  "normalBalance": "CREDIT"
}
```

### Response
```json
{
  "id": "acc-2001",
  "code": "2001",
  "name": "Accounts Payable",
  "type": "LIABILITY",
  "status": "ACTIVE",
  "normalBalance": "CREDIT"
}
```

---

## **GET /accounts/{id}**
Retrieve account details.

---

## **PUT /accounts/{id}**
Update account metadata (not balances).

### Request
```json
{
  "name": "Accounts Payable - Vendors",
  "status": "ACTIVE"
}
```

---

## **DELETE /accounts/{id}**
Deactivate account (soft delete).

---

# 📘 2. Posting Periods API

## **GET /periods**
List all periods.

---

## **POST /periods**
Create a new period.

### Request
```json
{
  "year": 2025,
  "month": 12
}
```

---

## **POST /periods/{id}/open**
Open a posting period.

---

## **POST /periods/{id}/close**
Close a posting period.

---

# 📘 3. Journal Entries API

## **GET /journal-entries**
List entries with filters.

### Query params
- `status=draft|posted`
- `accountId=...`
- `fromDate=...`
- `toDate=...`

---

## **POST /journal-entries**
Create a draft journal entry.

### Request
```json
{
  "date": "2025-01-15",
  "description": "Customer payment",
  "lines": [
    { "accountId": "acc-1001", "side": "DEBIT", "amount": 500 },
    { "accountId": "acc-4001", "side": "CREDIT", "amount": 500 }
  ]
}
```

### Validation rules
- Debits must equal credits  
- Accounts must be active  
- Period must be open  
- Amounts > 0  

---

## **GET /journal-entries/{id}**
Retrieve entry details.

---

## **PUT /journal-entries/{id}**
Edit a draft entry only.

---

## **POST /journal-entries/{id}/post**
Post the journal entry.

### Effects
- Entry becomes immutable  
- Balances update  
- Audit log entry created  

---

## **POST /journal-entries/{id}/reverse**
Create a reversing entry.

### Response
```json
{
  "reversalEntryId": "je-789"
}
```

---

# 📘 4. Balances & Reporting API

## **GET /balances**
Retrieve balances for all accounts or filtered.

### Query params
- `periodId=...`
- `accountId=...`

### Response
```json
[
  {
    "accountId": "acc-1001",
    "periodId": "2025-01",
    "debitTotal": 1500,
    "creditTotal": 200,
    "endingBalance": 1300
  }
]
```

---

## **GET /trial-balance**
Returns a classic accounting trial balance.

### Response
```json
{
  "periodId": "2025-01",
  "debits": 5000,
  "credits": 5000,
  "accounts": [
    {
      "accountId": "acc-1001",
      "debit": 3000,
      "credit": 0
    }
  ]
}
```

---

## **POST /balances/recompute**
Admin operation to rebuild balances from journal entries.

---

# 📘 5. Audit Log API (Optional but realistic)

## **GET /audit**
List audit events.

### Response
```json
[
  {
    "id": "audit-001",
    "timestamp": "2025-01-15T10:00:00Z",
    "user": "admin",
    "action": "POST_JOURNAL_ENTRY",
    "entityId": "je-123"
  }
]
```

---

# 🧭 API Design Principles Used

### ✔ Immutability  
Posted journal entries cannot be edited.

### ✔ Idempotency  
Posting, reversing, opening/closing periods use POST but must be idempotent.

### ✔ Validation at the boundary  
The API enforces accounting rules.

### ✔ Separation of concerns  
Accounts, periods, entries, balances each have their own endpoints.

### ✔ Predictable resource naming  
Everything is plural nouns, REST‑friendly.
