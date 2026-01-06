# UX Review: Core Ledger UI

**Document Version:** 1.1
**Review Date:** January 2026
**Benchmark:** Eagle, Refinitiv, BlackRock Aladdin
**Scope:** Transaction Capture Screen & Global Patterns

---

## Executive Summary

Core Ledger UI demonstrates a solid foundation for a fund accounting ABOR application with a modern dark theme and logical navigation structure. However, when benchmarked against enterprise-grade platforms like Eagle, Refinitiv, and BlackRock Aladdin, several gaps emerge in workflow optimization, data interaction patterns, and power-user features.

This document outlines specific findings and actionable recommendations to elevate the application to enterprise standards.

---

## Current State Analysis

### Strengths

| Area | Observation |
|------|-------------|
| **Visual Hierarchy** | Clean dark theme with strong contrast ratios suitable for extended use |
| **Navigation Structure** | Logical grouping of menu items reflecting accounting workflows |
| **Data Density** | Appropriate information density for financial data grids |
| **Color Coding** | Asset class badges (EQUITY/FIXED_INCOME) enable quick visual scanning |
| **Responsive Actions** | Edit and dropdown actions accessible per row |
| **Search & Filter** | Global search with dedicated filter panel |

### Screenshot Reference

The primary screen analyzed is the **Transaction Capture** view displaying:
- 144 total transactions across multiple funds
- Data grid with ID, Fund, Security, Class, Sub-type, Trade Date, Settlement Date, Quantity, Price, Amount, Currency, Status, and Actions
- Pagination control with 15 items per page
- Search, Filters, Export, and New Transaction actions

---

## Critical Gaps

### 1. Missing Workflow Context & Status Summary

**Issue:** Users cannot quickly assess the state of their work queue without scrolling through all records.

**Enterprise Standard:** Aladdin and Eagle display prominent status summaries above data grids:

```
┌──────────────────────────────────────────────────────────────────────┐
│  Pending: 23  │  In Review: 12  │  Approved: 89  │  Failed: 5       │
└──────────────────────────────────────────────────────────────────────┘
```

**Recommendation:** Add a horizontal status bar showing transaction counts by status (NEW, PENDING, APPROVED, REJECTED, POSTED). This provides immediate workflow context and serves as clickable quick filters.

**Impact:** High - Reduces cognitive load and accelerates workflow prioritization.

---

### 2. No Bulk Actions Capability

**Issue:** Financial operations require batch processing. Users cannot select multiple transactions for bulk operations.

**Missing Features:**
- Row selection checkboxes
- Select all / Select page / Select filtered
- Bulk approve/reject/delete
- Bulk status change
- Bulk assignment

**Enterprise Standard:** All enterprise ABOR systems support multi-select with contextual bulk action toolbars.

**Recommendation:** Implement:
1. Checkbox column as first column
2. Header checkbox for select all
3. Floating action bar when rows selected: `[23 selected] [Approve] [Reject] [Assign] [Delete] [Clear Selection]`

**Impact:** Critical - Without bulk actions, processing large transaction volumes becomes impractical.

---

### 3. Ambiguous Column Headers

**Issue:** Abbreviated column headers reduce clarity and increase learning curve.

| Current | Problem | Recommended |
|---------|---------|-------------|
| Sec | Ambiguous | Security |
| Sub | Unclear meaning | Txn Type |
| T-Date | Non-standard abbreviation | Trade Date |
| S-Date | Non-standard abbreviation | Settle Date |
| Px | Industry jargon | Price |
| Amt | Abbreviation | Amount |
| CCY | Technical term | Currency |
| Act | Cryptic | Actions |

**Recommendation:**
- Use full labels where space permits
- Implement column header tooltips with full descriptions
- Allow users to customize column display names

**Impact:** Medium - Improves accessibility and reduces onboarding time.

---

### 4. Weak Visual Differentiation for Transaction Direction

**Issue:** BUY and SALE transactions appear visually similar, requiring users to read the Sub column explicitly.

**Enterprise Standard:** Trading systems use multiple visual cues:
- Row background tinting (subtle green for buys, subtle red for sells)
- Direction indicators (↑ BUY / ↓ SELL)
- Color-coded Sub badges (not just asset class)

**Recommendation:** Apply subtle row background colors:
- BUY transactions: `rgba(var(--bs-success-rgb), 0.05)`
- SELL transactions: `rgba(var(--bs-danger-rgb), 0.05)`

**Impact:** Medium - Accelerates scanning and reduces errors.

---

### 5. Missing Quick Filter Tabs

**Issue:** Users must open the filter panel for common filtering scenarios.

**Enterprise Standard:** Horizontal tab filters above grids for common views:

```
[ All ] [ Today's Trades ] [ Pending Review ] [ Exceptions ] [ My Queue ]
```

**Recommendation:** Add a tab bar with pre-configured filters:
- **All** - No filter applied
- **Today** - Trade Date = Today
- **Pending** - Status = NEW or PENDING
- **Exceptions** - Transactions with validation errors
- **Awaiting Settlement** - Status = APPROVED, Settle Date <= Today + 2

**Impact:** High - Reduces clicks and accelerates common workflows.

---

### 6. No Inline Validation/Exception Indicators

**Issue:** Transactions with issues (missing data, pricing errors, compliance flags) are not visually distinguished.

**Enterprise Standard:** Exception indicators per row:
- Warning icon (⚠️) for soft exceptions
- Error icon (🔴) for hard blocks
- Compliance flag icon for regulatory holds
- Hover tooltip with exception details

**Recommendation:** Add an exception indicator column or icon overlay on the ID column showing validation state.

**Impact:** High - Critical for exception-based workflows common in fund accounting.

---

### 7. Suboptimal Pagination Strategy

**Issue:** 144 items displayed with 15-per-page pagination requires 10 page loads to review all data.

**Enterprise Standard:**
- Virtual scrolling for large datasets (Eagle)
- Higher default page sizes (50-100 rows)
- "Load more" pattern as alternative to pagination
- Sticky headers during scroll

**Recommendation:**
1. Increase default page size to 50
2. Implement virtual scrolling for datasets > 500 rows
3. Add sticky column headers

**Impact:** Medium - Improves data review efficiency.

---

### 8. Missing Keyboard Navigation

**Issue:** No visible keyboard navigation support for power users.

**Enterprise Standard:** Financial users rely heavily on keyboard shortcuts:

| Shortcut | Action |
|----------|--------|
| ↑ / ↓ | Navigate rows |
| Enter | Open detail/edit |
| Space | Toggle row selection |
| Ctrl+A | Select all |
| Ctrl+F | Focus search |
| Ctrl+N | New transaction |
| Ctrl+E | Export |
| Escape | Clear selection / Close modal |

**Recommendation:** Implement keyboard navigation with:
- Visual focus indicator on active row
- Keyboard shortcut help modal (? key)
- Shortcut hints in button tooltips

**Impact:** High - Essential for power-user productivity.

---

### 9. Suboptimal Action Column Placement

**Issue:** Actions column is positioned on the far right, requiring horizontal scrolling or long eye travel from the row identifier.

**Current Layout:**
```
| ID | Fund | Security | Class | Type | T-Date | S-Date | Qty | Price | Amount | CCY | Status | Actions |
                                                                                                   ↑
                                                                                          Far from identifier
```

#### Industry Patterns Analysis

**Pattern A: Right Side (Current Implementation)**
```
| ID | Fund | Security | ... | Status | Actions |
|    |      |          |     |        | [✎] [▾] |
```
- **Pros:** Natural left-to-right reading flow, actions as "conclusion"
- **Cons:** Far from row identifier, requires horizontal scroll on smaller screens
- **Used by:** Refinitiv, Bloomberg Terminal

**Pattern B: Left Side After Selection (Recommended)**
```
| ☐ | Actions | ID | Fund | Security | ... | Status |
|   | [✎] [▾] |    |      |          |     |        |
```
- **Pros:** Immediate access, near identifier, no horizontal scroll needed
- **Cons:** Slightly interrupts data scanning flow
- **Used by:** Eagle, BlackRock Aladdin, Charles River IMS

**Pattern C: Hover-Reveal / Sticky Column**
```
| ID | Fund | Security | ...data scrolls... |  [✎][▾] |
                                              ← sticky
```
- **Pros:** Clean appearance, always visible during horizontal scroll
- **Cons:** Requires hover (poor for touch/accessibility), discoverability issues
- **Used by:** Modern SaaS (Notion, Linear, Airtable)

#### Recommendation: Left-Side Placement

**Move the Actions column to the LEFT, immediately after the checkbox column:**

```
┌────┬─────────┬─────┬────────────┬──────────┬───────┬──────┬─────────┬─────────┬─────┬───────┬────────┬─────┬────────┐
│ ☐  │ Actions │ ID  │ Fund       │ Security │ Class │ Type │ T-Date  │ S-Date  │ Qty │ Price │ Amount │ CCY │ Status │
├────┼─────────┼─────┼────────────┼──────────┼───────┼──────┼─────────┼─────────┼─────┼───────┼────────┼─────┼────────┤
│ ☐  │ [✎] [▾] │ 25  │ SP500I001  │ BCFFXIV  │ EQ    │ BUY  │ 01/03   │ 01/04   │ 100 │ 50.25 │ 5,025  │ USD │ NEW    │
│ ☐  │ [✎] [▾] │ 38  │ SP500I001  │ BCFFXIV  │ EQ    │ BUY  │ 01/03   │ 01/04   │ 100 │ 50.25 │ 5,025  │ USD │ NEW    │
└────┴─────────┴─────┴────────────┴──────────┴───────┴──────┴─────────┴─────────┴─────┴───────┴────────┴─────┴────────┘
```

**Rationale:**

1. **Proximity to Identifier** - User sees the transaction ID and can immediately act without eye travel
2. **No Horizontal Scroll** - Actions always visible regardless of screen width
3. **Bulk Action Alignment** - Checkbox and single-row actions are visually grouped in the "action zone"
4. **Enterprise Standard** - Matches Eagle and Aladdin muscle memory, reducing training time for users transitioning from those platforms
5. **Touch-Friendly** - No hover interaction required, improving tablet/touch accessibility
6. **Fitts's Law** - Reduces target acquisition time by placing frequently-used controls closer together

#### Contextual Actions by Status

Additionally, show different actions based on transaction status to reduce cognitive load:

| Status | Primary Action | Secondary Actions |
|--------|----------------|-------------------|
| NEW | Edit | Submit, Delete |
| PENDING | Approve | Reject, Return, View |
| IN_REVIEW | View | Approve, Reject |
| APPROVED | View | Reverse, Amend |
| POSTED | View | (No modifications allowed) |
| REJECTED | Edit | Resubmit, Delete |

**Implementation:**
```typescript
// Actions vary by status
getAvailableActions(status: TransactionStatus): Action[] {
  switch (status) {
    case 'NEW':
      return ['edit', 'submit', 'delete'];
    case 'PENDING':
      return ['approve', 'reject', 'view'];
    case 'APPROVED':
      return ['view', 'reverse'];
    case 'POSTED':
      return ['view'];
    default:
      return ['view'];
  }
}
```

**Impact:** Medium-High - Improves action discoverability and reduces errors from invalid operations.

---

## Information Architecture Issues

### Sidebar Navigation

| Issue | Detail |
|-------|--------|
| **Redundancy** | "Ledger > Chart of Accounts" overlaps conceptually with "Balances & Reports" |
| **Hierarchy Clarity** | Chevron indicators present but active state unclear |
| **Active State** | Current location not prominently highlighted |
| **Grouping** | Consider grouping: Operations (Transactions, Journal) vs Reference Data (Funds, Securities) vs Reporting |

### Recommended Navigation Restructure

```
OPERATIONS
├── Dashboard
├── Transactions
├── Journal Entries
└── Posting Periods

PORTFOLIO
├── Funds
├── Holdings
└── Securities

ACCOUNTING
├── Chart of Accounts
├── Balances
└── NAV

REPORTING
├── Standard Reports
├── Custom Reports
└── Export Center

ADMINISTRATION
├── Users & Roles
├── System Config
└── Audit Log
```

---

## Detailed Recommendations

### Priority 1: Critical (Workflow Blockers)

| # | Recommendation | Effort | Impact |
|---|----------------|--------|--------|
| 1.1 | Add status summary bar with counts | Medium | High |
| 1.2 | Implement row selection + bulk actions | High | Critical |
| 1.3 | Move actions column to left side | Low | Medium-High |
| 1.4 | Add inline exception indicators | Medium | High |
| 1.5 | Add quick filter tabs | Low | High |

### Priority 2: Important (Efficiency Gains)

| # | Recommendation | Effort | Impact |
|---|----------------|--------|--------|
| 2.1 | Improve column header labels + tooltips | Low | Medium |
| 2.2 | Color-code BUY/SELL rows | Low | Medium |
| 2.3 | Implement keyboard navigation | Medium | High |
| 2.4 | Implement contextual actions by status | Medium | Medium |
| 2.5 | Increase default page size / virtual scroll | Medium | Medium |

### Priority 3: Enhancement (Polish)

| # | Recommendation | Effort | Impact |
|---|----------------|--------|--------|
| 3.1 | Column resizing and reordering | Medium | Medium |
| 3.2 | Saved views / custom layouts | High | Medium |
| 3.3 | Right-click context menu | Low | Low |
| 3.4 | Column visibility toggle | Low | Medium |
| 3.5 | Row detail expansion (accordion) | Medium | Medium |

---

## Competitive Benchmark Matrix

| Feature | Core Ledger | Eagle | Aladdin | Refinitiv |
|---------|:-----------:|:-----:|:-------:|:---------:|
| Status Summary Bar | ❌ | ✅ | ✅ | ✅ |
| Bulk Actions | ❌ | ✅ | ✅ | ✅ |
| Quick Filter Tabs | ❌ | ✅ | ✅ | ✅ |
| Exception Indicators | ❌ | ✅ | ✅ | ✅ |
| Keyboard Navigation | ❌ | ✅ | ✅ | ✅ |
| Virtual Scrolling | ❌ | ✅ | ✅ | ✅ |
| Column Customization | ❌ | ✅ | ✅ | ✅ |
| Saved Views | ❌ | ✅ | ✅ | ✅ |
| Dark Theme | ✅ | ✅ | ⚠️ | ✅ |
| Asset Class Badges | ✅ | ✅ | ✅ | ✅ |
| Responsive Design | ✅ | ⚠️ | ⚠️ | ⚠️ |
| Modern Tech Stack | ✅ | ⚠️ | ⚠️ | ⚠️ |

**Legend:** ✅ Full support | ⚠️ Partial/Limited | ❌ Not present

---

## Implementation Roadmap

### Phase 1: Foundation
- [ ] Move actions column to left side (after checkbox)
- [ ] Add checkbox column for row selection
- [ ] Status summary bar component
- [ ] Quick filter tabs
- [ ] Column header improvements (full labels + tooltips)

### Phase 2: Core Interactions
- [ ] Row selection system (single, multi, select all)
- [ ] Bulk action toolbar (sticky bottom)
- [ ] Contextual actions by transaction status
- [ ] Keyboard navigation

### Phase 3: Data Presentation
- [ ] Exception indicators (icon + row styling)
- [ ] BUY/SELL row coloring (subtle tints)
- [ ] Increase default page size to 50
- [ ] Virtual scrolling for large datasets

### Phase 4: Personalization
- [ ] Column customization (resize, reorder, hide)
- [ ] Saved views / custom layouts
- [ ] User preferences persistence

---

## Wireframe Concepts

### Complete Data Grid Layout (Recommended)

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│ HEADER BAR                                                                                      │
│  Transactions  /  Capture Transaction                      [Filters] [Export] [+ New Transaction]│
├─────────────────────────────────────────────────────────────────────────────────────────────────┤
│ STATUS SUMMARY (clickable filters)                                                              │
│  ○ All (144)  │  ● New (23)  │  ○ Pending (12)  │  ○ Approved (104)  │  ○ Posted (0)  │  ⚠️ 5   │
├─────────────────────────────────────────────────────────────────────────────────────────────────┤
│ QUICK FILTERS                                                                                   │
│  [All]  [Today's Trades]  [Pending Review]  [Exceptions]  [My Queue]                            │
├─────────────────────────────────────────────────────────────────────────────────────────────────┤
│ SEARCH & PAGINATION                                                                             │
│  🔍 Search transactions...                                    144 total items  │ 50 per page ▾ │
├─────────────────────────────────────────────────────────────────────────────────────────────────┤
│ DATA GRID (with left-side actions)                                                              │
│                                                                                                 │
│ ☐  │ Act     │ ID │ Fund      │ Security │ Class │ Type │ Trade Dt │ Settle Dt│ Qty │ Price   │
│────┼─────────┼────┼───────────┼──────────┼───────┼──────┼──────────┼──────────┼─────┼─────────│
│ ☐  │ [✎][▾] │ 25 │ SP500I001 │ BCFFXIV  │ EQ    │ BUY  │ 01/03/26 │ 01/04/26 │ 100 │ 50.25   │  ← green tint
│ ☐  │ [✎][▾] │ 38 │ SP500I001 │ BCFFXIV  │ EQ    │ BUY  │ 01/03/26 │ 01/04/26 │ 100 │ 50.25   │  ← green tint
│ ☐  │ [👁][▾] │ 34 │ SP500I001 │ JONNY    │ FI    │ SELL │ 01/03/26 │ 01/04/26 │ 100 │ 50.25   │  ← red tint
│ ⚠️ │ [✎][▾] │ 42 │ BOND001   │ TBILL30  │ FI    │ BUY  │ 01/03/26 │ 01/04/26 │  -  │ -       │  ← exception row
│                                                                                                 │
├─────────────────────────────────────────────────────────────────────────────────────────────────┤
│ BULK ACTION BAR (appears when rows selected)                                                    │
│  ☑ 23 selected    [Approve]  [Reject]  [Assign To ▾]  [Delete]  [× Clear Selection]             │
├─────────────────────────────────────────────────────────────────────────────────────────────────┤
│ PAGINATION                                                                                      │
│                                      [«] [<] 1 2 3 ... 8 [9] 10 [>] [»]                         │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Status Summary Bar

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ○ All (144)  │  ● New (23)  │  ○ Pending (12)  │  ○ Approved (104)  │  ⚠️ 5 │
└─────────────────────────────────────────────────────────────────────────────┘
```
- Radio-style selection (one active at a time)
- Counts update in real-time
- Exception count (⚠️) always visible as badge

### Bulk Action Toolbar (appears when rows selected)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ☑ 23 selected    [Approve]  [Reject]  [Assign To ▾]  [Delete]  [× Clear]  │
└─────────────────────────────────────────────────────────────────────────────┘
```
- Sticky position at bottom of grid
- Shows selection count
- Actions contextual to selected items' statuses

### Quick Filter Tabs

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  [All]  [Today's Trades]  [Pending Review]  [Exceptions]  [My Queue]        │
└─────────────────────────────────────────────────────────────────────────────┘
```
- Pill-style buttons
- Can combine with status summary filter

### Action Column States

```
Status: NEW        → [✎ Edit] [▾ Submit | Delete]
Status: PENDING    → [✓ Approve] [▾ Reject | View]
Status: APPROVED   → [👁 View] [▾ Reverse | Amend]
Status: POSTED     → [👁 View] (dropdown disabled)
Status: REJECTED   → [✎ Edit] [▾ Resubmit | Delete]
```

### Row Visual States

```
┌─────────────────────────────────────────────────────────────────┐
│ NORMAL ROW                                                      │
│ Background: transparent                                         │
├─────────────────────────────────────────────────────────────────┤
│ BUY TRANSACTION                                                 │
│ Background: rgba(25, 135, 84, 0.05) - subtle green             │
├─────────────────────────────────────────────────────────────────┤
│ SELL TRANSACTION                                                │
│ Background: rgba(220, 53, 69, 0.05) - subtle red               │
├─────────────────────────────────────────────────────────────────┤
│ EXCEPTION ROW                                                   │
│ Background: rgba(255, 193, 7, 0.08) - subtle amber             │
│ Left border: 3px solid warning color                           │
│ Exception icon in checkbox column                              │
├─────────────────────────────────────────────────────────────────┤
│ SELECTED ROW                                                    │
│ Background: rgba(13, 110, 253, 0.1) - subtle blue              │
│ Checkbox: checked                                              │
├─────────────────────────────────────────────────────────────────┤
│ HOVER ROW                                                       │
│ Background: rgba(255, 255, 255, 0.05) - subtle highlight       │
└─────────────────────────────────────────────────────────────────┘
```

---

## Appendix A: Accessibility Considerations

All recommendations should comply with WCAG 2.1 AA standards:

- **Color Contrast:** Status indicators must not rely solely on color
- **Keyboard Access:** All interactive elements must be keyboard accessible
- **Screen Readers:** Status counts should be announced; selection state communicated
- **Focus Management:** Clear focus indicators for keyboard navigation
- **Motion:** Respect `prefers-reduced-motion` for animations

---

## Appendix B: Technical Considerations

### Data Grid Enhancement Options

1. **Custom Implementation:** Extend current data-grid component
2. **AG Grid:** Enterprise-grade grid with built-in features (licensing cost)
3. **TanStack Table:** Headless table library for full control
4. **PrimeNG Table:** Feature-rich with Angular integration

### State Management for Selection

```typescript
// Signal-based selection state
interface GridSelectionState {
  selectedIds: Set<number>;
  selectAll: boolean;
  selectAllFiltered: boolean;
}

const selectionState = signal<GridSelectionState>({
  selectedIds: new Set(),
  selectAll: false,
  selectAllFiltered: false,
});
```

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | January 2026 | UX Review | Initial review |
| 1.1 | January 2026 | UX Review | Added action column placement analysis (Section 9), complete grid wireframe, contextual actions by status, row visual states |

---

## Next Steps

1. Review and prioritize recommendations with product team
2. Create detailed specifications for Priority 1 items
3. Conduct user research to validate assumptions
4. Prototype key interactions for stakeholder feedback
5. Plan implementation sprints
