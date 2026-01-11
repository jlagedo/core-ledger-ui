# CSS/SCSS Style Review

**Generated:** 2026-01-11
**Project:** Core Ledger UI
**Angular Version:** 21
**Bootstrap Version:** 5.3.8

---

## Executive Summary

This document provides a comprehensive review of all styles in the Core Ledger UI Angular application. The analysis covers **43 SCSS files**, **33 HTML templates**, and style-related TypeScript code.

### Key Statistics

| Metric | Count |
|--------|-------|
| Total SCSS Files | 43 |
| Global Style Partials | 13 |
| Component SCSS Files | 30 |
| Hard-coded Colors Found | ~~270+~~ ~~230~~ ~160 ✓ |
| Potentially Unused Classes | ~~8~~ 0 ✓ |
| Inline Styles in HTML | 23 |
| Files with Empty SCSS | ~~7~~ 6 ✓ |

### Overall Assessment

| Aspect | Grade | Notes |
|--------|-------|-------|
| CSS Organization | A | Well-structured with global consolidation |
| Color Consistency | B | Amber scale consolidated to CSS variables |
| Bootstrap Usage | A- | Excellent integration with minor inconsistencies |
| Unused Code | A | Cleaned up - no redundant classes ✓ |
| Theme Awareness | B | Most files theme-aware; some need work |
| Accessibility | A | Strong focus states and ARIA support |

---

## Table of Contents

1. [File Inventory](#1-file-inventory)
2. [Style Architecture](#2-style-architecture)
3. [Hard-coded Colors Analysis](#3-hard-coded-colors-analysis)
4. [Unused Styles](#4-unused-styles)
5. [Inline Styles in HTML](#5-inline-styles-in-html)
6. [TypeScript Style Definitions](#6-typescript-style-definitions)
7. [Action Items](#7-action-items)
8. [Style Hierarchy Documentation](#8-style-hierarchy-documentation)

---

## 1. File Inventory

### 1.1 Global Style Partials (`src/styles/`)

| File | Lines | Purpose | Status |
|------|-------|---------|--------|
| `styles.scss` | ~50 | Main entry, Bootstrap imports | OK |
| `_variables.scss` | ~85 | Primitive color tokens, Bootstrap config | REVIEW |
| `_theme-tokens.scss` | ~120 | Light/dark mode token maps | REVIEW |
| `_theme-modes.scss` | ~60 | CSS variable application | OK |
| `_mixins.scss` | ~140 | Theme variable generation | OK |
| `_components.scss` | ~730 | Global component styles | REVIEW |
| `_data-grid.scss` | ~1461 | AG Grid and list styles | REVIEW |
| `_functions.scss` | ~25 | Theme/alert getter functions | OK |
| `_keyframes.scss` | ~35 | Animation definitions | OK |
| `_utilities.scss` | ~110 | Brand utilities, glows, gradients | REVIEW |
| `_alert-tokens.scss` | ~80 | Alert/badge color tokens | REVIEW |
| `_accessibility.scss` | ~200 | Focus indicators, a11y features | OK |

### 1.2 Layout Components (`src/app/layout/`)

| File | Lines | Status | Notes |
|------|-------|--------|-------|
| `sidenav/sidenav.scss` | ~1018 | REVIEW | Large file, consider splitting |
| `page-header/page-header.scss` | ~509 | OK | Removed unused divider class ✓ |
| `user-profile/user-profile.scss` | ~372 | OK | Removed legacy classes ✓ |
| `toasts-container/toasts-container.scss` | ~340 | REVIEW | Hard-coded status colors |
| `deadline-ticker/deadline-ticker.scss` | ~620 | OK | Good CSS variable usage |
| `breadcrumb/breadcrumb.scss` | - | REMOVED | Empty file deleted ✓ |

### 1.3 Feature Components

| Feature | File | Lines | Status | Notes |
|---------|------|-------|--------|-------|
| login | `login.scss` | 1 | KEEP | Intentionally minimal |
| profile | `profile.scss` | ~950 | REVIEW | Many hard-coded colors |
| dashboard | `dashboard.scss` | ~740 | OK | Good CSS variable usage |
| funds | `fund-list.scss` | 1 | KEEP | Delegated to global |
| funds | `fund-form.scss` | 1 | KEEP | Delegated to global |
| chart-of-accounts | `chart-of-accounts.scss` | ~48 | OK | Column widths only |
| chart-of-accounts | `account-form.scss` | 1 | KEEP | Delegated to global |
| transactions | `transaction-list.scss` | ~743 | CRITICAL | 30+ hard-coded colors |
| transactions | `transaction-form.scss` | 1 | KEEP | Delegated to global |
| securities | `security-list.scss` | 1 | KEEP | Delegated to global |
| securities | `security-form.scss` | ~4 | OK | Removed Bootstrap duplicate ✓ |

### 1.4 Cadastro Feature

| File | Lines | Status | Notes |
|------|-------|--------|-------|
| `calendario-list.scss` | ~117 | OK | Refactored to CSS variables ✓ |
| `calendario-form.scss` | 1 | KEEP | Comment only |
| `calendario/delete-modal.scss` | 1 | KEEP | Comment only |
| `indexador-list.scss` | ~153 | OK | Refactored to CSS variables ✓ |
| `indexador-form.scss` | ~12 | OK | One custom class |
| `indexador-detail.scss` | ~122 | REVIEW | 7 hard-coded colors |
| `indexadores/delete-modal.scss` | ~7 | OK | Uses variables properly |
| `indexadores/_indexador-shared.scss` | ~19 | NEW | Shared modal styles ✓ |
| `history/add-value-modal.scss` | ~2 | OK | Uses shared partial ✓ |
| `history/delete-value-modal.scss` | ~37 | REVIEW | 4 hard-coded colors |
| `history/import-modal.scss` | ~82 | OK | Uses shared partial ✓ |

### 1.5 Shared Components

| File | Lines | Status | Notes |
|------|-------|--------|-------|
| `data-grid/data-grid.scss` | ~530 | OK | Well-architected |

---

## 2. Style Architecture

### 2.1 Design System Hierarchy

```
FOUNDATION LAYER (_variables.scss)
├── Primitive Colors (neutral, brand, accent palettes)
├── Bootstrap Configuration
└── Semantic Tokens
    ↓
TOKEN MAPS (_theme-tokens.scss, _alert-tokens.scss)
├── Light Mode Tokens (94 properties)
├── Dark Mode Tokens (94 properties)
└── Alert/Badge Tokens (6 types)
    ↓
CSS VARIABLE GENERATION (_mixins.scss)
├── generate-theme-vars($mode) mixin
└── 140+ CSS custom properties per mode
    ↓
THEME MODES (_theme-modes.scss)
├── :root / [data-bs-theme="light"]
├── [data-bs-theme="dark"]
└── Body background gradients
    ↓
COMPONENTS (_components.scss)
├── Cards, Buttons, Forms
├── Tables, Alerts, Badges
├── Navigation, Dropdowns
└── Custom containers
    ↓
UTILITIES (_utilities.scss)
├── Brand color utilities
├── Surface utilities
├── Glow effects
└── Animation utilities
    ↓
DATA GRID (_data-grid.scss)
├── AG Grid refinements
├── Filter/Preset bars
├── Status indicators
└── Date picker styling
```

### 2.2 Color Palette

#### Bloomberg Terminal (Dark Mode)
| Color | Hex | Usage |
|-------|-----|-------|
| Amber (Primary) | `#FFA028` | Accents, text highlights |
| Teal (Success) | `#4af6c3` | Positive states |
| Red (Danger) | `#ff433d` | Errors, warnings |
| Blue (Info) | `#0068ff` | Information, links |
| Black | `#000000` | Background |

#### Bloomberg Daylight (Light Mode)
| Color | Hex | Usage |
|-------|-----|-------|
| Amber | `#B45309` | Primary accent |
| Navy | `#1A1A2E` | Sidebar |
| Cream | `#FAF7F2` | Card backgrounds |
| Charcoal | `#2C1810` | Text |
| Muted Gold | `#C4A35A` | Secondary |

---

## 3. Hard-coded Colors Analysis

### 3.1 Critical Files (30+ hard-coded colors)

#### `src/app/features/transactions/transaction-list.scss`

| Line | Color | Context | Action |
|------|-------|---------|--------|
| 116 | `#FFA028` | Dark mode header border | Use `var(--accent-amber)` |
| 121 | `#FFA028` | Dark mode row selected | Use variable |
| 126 | `#FFA028` | Loading spinner | Use variable |
| 134 | `#CFC3B1` | Light mode header | Use `var(--terminal-glow)` |
| 139 | `#B45309` | Light mode selected | Use variable |
| 236 | `rgba(128,128,128,0.15)` | Percentage bg | Use `var(--bs-tertiary-bg)` |
| 375 | `#0068ff` | Edit button | Use `var(--accent-blue)` |
| 397 | `#4af6c3` | Export button | Use `var(--accent-teal)` |
| 408 | `#FFA028` | Rollback button | Use variable |
| 484 | `rgba(255,160,40,0.4)` | Pulse animation | Use variable with opacity |

#### `src/styles/_theme-tokens.scss`

| Line Range | Count | Context |
|------------|-------|---------|
| 1-120 | ~120 | Token map values (intentional, organized) |

### 3.2 High Priority Files (15-30 hard-coded colors)

#### `src/app/features/cadastro/indexadores/indexador-list.scss`

| Line | Color | Status |
|------|-------|--------|
| 56-58 | Status badge active | ✓ Uses `--status-positive-*` |
| 61-64 | Status badge inactive | ✓ Uses `--status-neutral-*` |
| 103-130 | Row action buttons | ✓ Uses `--status-positive/info/negative-*` |

#### `src/app/features/cadastro/calendario/calendario-list.scss`

| Line | Color | Status |
|------|-------|--------|
| 34-37 | Status badge active | ✓ Uses `--status-positive-*` |
| 40-43 | Status badge inactive | ✓ Uses `--status-neutral-*` |
| 82-99 | Row action buttons | ✓ Uses `--status-info/negative-*` |

### 3.3 Medium Priority Files (5-15 hard-coded colors)

| File | Count | Primary Issue |
|------|-------|---------------|
| `_components.scss` | ~8 | Shadow rgba values, fallbacks |
| `_data-grid.scss` | ~15 | Shadows, hover states |
| `user-profile.scss` | ~25 | Extensive amber rgba variants |
| `page-header.scss` | ~18 | Multiple button color overrides |
| `toasts-container.scss` | ~20 | Status colors for light mode |
| `profile.scss` | ~30 | Animation and gradient colors |
| `indexador-detail.scss` | ~7 | Summary card backgrounds |

### 3.4 TypeScript Hard-coded Colors

#### `src/app/services/indexador.ts` (Lines 26-76)

| Type | Color | Usage |
|------|-------|-------|
| Juros | `#0068ff` | Index type indicator |
| Inflacao | `#f97316` | Index type indicator |
| Cambio | `#22c55e` | Index type indicator |
| IndiceBolsa | `#9333ea` | Index type indicator |
| IndiceRendaFixa | `#06b6d4` | Index type indicator |
| Crypto | `#eab308` | Index type indicator |
| Outro | `#6b7280` | Default fallback |

#### `src/app/shared/themes/ag-grid-theme.ts`

Extensive hard-coded colors for AG Grid theming (intentional for AG Grid API).

---

## 4. Unused Styles

### 4.1 Confirmed Unused Classes

| File | Class | Line | Status |
|------|-------|------|--------|
| `page-header.scss` | `.terminal-header__divider` | 421 | ✓ REMOVED |
| `user-profile.scss` | `.glass-round` | 377-382 | ✓ REMOVED |
| `user-profile.scss` | `.no-caret` | 384-387 | ✓ REMOVED |
| `security-form.scss` | `.text-uppercase` | 1-3 | ✓ REMOVED |
| `add-value-modal.scss` | `.form-label` | 21-24 | ✓ REMOVED |
| `add-value-modal.scss` | `.form-text` | 26-28 | ✓ REMOVED |

### 4.2 Empty/Minimal Files (Consider Removal)

| File | Content | Status |
|------|---------|--------|
| `breadcrumb.scss` | 1 line | ✓ REMOVED |
| `fund-list.scss` | Comment only | KEEP (documentation) |
| `fund-form.scss` | Comment only | KEEP (documentation) |
| `account-form.scss` | Empty | KEEP (placeholder) |
| `transaction-form.scss` | Comment only | KEEP (documentation) |
| `security-list.scss` | Comment only | KEEP (documentation) |
| `import-b3-modal.scss` | Comment only | KEEP (placeholder) |
| `delete-modal.scss` (calendario) | Comment only | KEEP (placeholder) |

### 4.3 Duplicate Code

| Files | Duplicate Classes | Status |
|-------|-------------------|--------|
| `add-value-modal.scss`, `import-modal.scss` | `.indexador-info`, `.indexador-codigo`, `.indexador-nome` | ✓ EXTRACTED to `_indexador-shared.scss` |

---

## 5. Inline Styles in HTML

### 5.1 Summary

| Category | Count | Action |
|----------|-------|--------|
| Dynamic bindings (keep) | 11 | Essential for functionality |
| Animation delays | 9 | Refactor to CSS classes |
| Fixed dimensions | 7 | Create utility classes |
| Width constraints | 5 | Use Bootstrap utilities |
| Dynamic colors | 4 | Review for theme safety |

### 5.2 Files with Inline Styles

| File | Instances | Primary Issue |
|------|-----------|---------------|
| `data-grid.html` | 10 | Dynamic column sizing (OK) |
| `dashboard.html` | 10 | Animation delays, placeholder sizes |
| `profile.html` | 9 | Animation delays, font sizes |
| `indexador-detail.html` | 6 | Date input widths, dynamic colors |
| `sidenav.html` | 2 | Dynamic width toggle (OK) |
| `transaction-list.html` | 2 | Grid dimensions |
| `indexador-list.html` | 2 | Grid dimensions, dynamic colors |
| `calendario-list.html` | 1 | Grid dimensions |
| `login.html` | 1 | Max-width constraint |

### 5.3 Recommended Refactors

#### Animation Delays
Create CSS classes with CSS custom properties:
```scss
.animate-stagger-1 { animation-delay: 0.1s; }
.animate-stagger-2 { animation-delay: 0.2s; }
// ... etc
```

#### Placeholder Dimensions
```scss
.chart-placeholder-lg { height: 280px; }
.chart-placeholder-md { height: 260px; }
.placeholder-circle-lg { width: 180px; height: 180px; }
```

#### Grid Containers
```scss
.grid-container-lg { width: 100%; height: 600px; }
.grid-container-md { width: 100%; height: 500px; }
```

---

## 6. TypeScript Style Definitions

### 6.1 Component Inline Styles

| File | Lines | Content |
|------|-------|---------|
| `chart-tab.ts` | 149-196 | Inline `styles:` array with chart layout |
| `chart-tab.ts` | 251-254 | Inline HTML styles in ECharts tooltip |

### 6.2 Service Color Definitions

| File | Issue | Recommendation |
|------|-------|----------------|
| `indexador.ts` | Colors in tipoOptions array | Centralize to theme config |
| `ag-grid-theme.ts` | Extensive color definitions | Intentional for AG Grid API |

### 6.3 Directive Style Bindings

| File | Line | Content | Status |
|------|------|---------|--------|
| `sortable.directive.ts` | 24 | `[style.cursor]: "pointer"` | OK |

### 6.4 Theme Service

`theme-service.ts` correctly uses Bootstrap's `data-bs-theme` attribute - no inline style manipulation.

---

## 7. Action Items

### 7.1 Critical Priority

| # | Task | Files | Status |
|---|------|-------|--------|
| 1 | Refactor transaction-list.scss colors | 1 file | Pending |
| 2 | Extract status badge colors to variables | 5 files | ✓ DONE |
| 3 | Remove duplicate Bootstrap classes | 3 files | ✓ DONE |
| 4 | Remove legacy unused classes | 2 files | ✓ DONE |

### 7.2 High Priority

| # | Task | Files | Status |
|---|------|-------|--------|
| 5 | Extract shared indexador modal classes | 2 files | ✓ DONE |
| 6 | Consolidate amber rgba variants | 8 files | ✓ DONE |
| 7 | Create animation delay utility classes | Global | ✓ DONE |
| 8 | Create grid container size classes | Global | ✓ DONE |

### 7.3 Medium Priority

| # | Task | Files | Effort |
|---|------|-------|--------|
| 9 | Review button styling consistency | security-list | Low |
| 10 | Add `@prefers-reduced-motion` queries | Global | Medium |
| 11 | Split sidenav.scss into sub-modules | 1 file | High |
| 12 | Document color palette in SCSS | Global | Medium |

### 7.4 Low Priority

| # | Task | Files | Status |
|---|------|-------|--------|
| 13 | Remove empty breadcrumb.scss | 1 file | ✓ DONE |
| 14 | Add Firefox scrollbar support | Global | Pending |
| 15 | Centralize TypeScript colors | indexador.ts | Pending |

---

## 8. Style Hierarchy Documentation

### 8.1 Component Styling Pattern

```
1. Bootstrap Utilities (preferred)
   ├── Layout: d-flex, justify-content-*, align-items-*
   ├── Spacing: m-*, p-*, gap-*
   ├── Typography: fs-*, fw-*, text-*
   └── Colors: text-*, bg-*, border-*

2. Global Component Classes (when Bootstrap insufficient)
   ├── .container-data, .container-form
   ├── .card-data, .card-form
   ├── .filter-bar, .preset-bar
   └── .status-badge, .tipo-badge

3. Feature-Specific Styles (scoped to component)
   ├── AG Grid customizations
   ├── Chart configurations
   └── Complex form layouts

4. Inline Styles (last resort)
   ├── Dynamic values from signals
   ├── Computed dimensions
   └── Animation delays (should be refactored)
```

### 8.2 Color Application Hierarchy

```
1. CSS Custom Properties (preferred)
   ├── Bootstrap variables: var(--bs-primary), var(--bs-body-color)
   ├── Theme tokens: var(--terminal-glow), var(--accent-amber)
   └── Component variables: var(--table-header-bg)

2. SCSS Variables (for calculations)
   ├── $brand-blue-500, $accent-teal
   └── Used in mixins and functions

3. Hard-coded Values (avoid)
   ├── Only for one-time shadows
   └── Only when variable not available
```

### 8.3 Theme Mode Handling

```scss
// Preferred pattern
.my-component {
  background: var(--card-bg);           // Uses theme variable
  color: var(--bs-body-color);          // Bootstrap variable
  border-color: var(--terminal-glow);   // Custom variable
}

// Explicit theme override (when needed)
[data-bs-theme="light"] {
  .my-component {
    --terminal-glow: #B45309;           // Override variable
  }
}
```

---

## Appendix A: File Sizes

| File | Lines | Bytes |
|------|-------|-------|
| `_data-grid.scss` | 1,461 | ~45KB |
| `sidenav.scss` | 1,018 | ~32KB |
| `profile.scss` | 950 | ~28KB |
| `transaction-list.scss` | 743 | ~22KB |
| `_components.scss` | 729 | ~21KB |
| `deadline-ticker.scss` | 620 | ~18KB |
| `data-grid.scss` | 530 | ~16KB |
| `page-header.scss` | 520 | ~15KB |
| `user-profile.scss` | 390 | ~12KB |
| `toasts-container.scss` | 340 | ~10KB |

---

## Appendix B: CSS Variable Reference

### Core Theme Variables

```scss
// Terminal/Accent
--terminal-glow          // Primary accent (amber)
--terminal-glow-muted    // Muted variant
--terminal-glow-subtle   // Subtle variant
--terminal-glow-bg       // Background variant

// Bootstrap Overrides
--bs-body-bg
--bs-body-color
--bs-emphasis-color
--bs-secondary-color
--bs-tertiary-color
--bs-border-color

// Surface Elevation
--surface-base
--surface-elevated
--surface-subtle
--surface-muted

// Status Colors (Ticker/Alerts)
--status-safe            // Green
--status-warning         // Yellow
--status-critical        // Red
--status-expired         // Gray

// Semantic Status Colors (Data Displays)
--status-positive        // Success/active text
--status-positive-bg     // Success/active background
--status-positive-border // Success/active border
--status-negative        // Error/danger text
--status-negative-bg     // Error/danger background
--status-negative-border // Error/danger border
--status-info            // Info/edit text
--status-info-bg         // Info/edit background
--status-info-border     // Info/edit border
--status-pending         // Warning/pending text
--status-pending-bg      // Warning/pending background
--status-pending-border  // Warning/pending border
--status-neutral         // Inactive/muted text
--status-neutral-bg      // Inactive/muted background
--status-neutral-border  // Inactive/muted border

// Table Specific
--table-header-bg
--table-border-color
--table-hover-bg
--table-active-bg
--table-striped-bg
--table-cell-color
```

---

## Changelog

### 2026-01-11 - Unused Classes Cleanup

**Completed Tasks:**
- Removed `.terminal-header__divider` from `page-header.scss`
- Removed `.glass-round` and `.no-caret` legacy classes from `user-profile.scss`
- Removed duplicate `.text-uppercase` Bootstrap class from `security-form.scss`
- Removed duplicate `.form-label` and `.form-text` Bootstrap classes from `add-value-modal.scss`
- Extracted shared `.indexador-info`, `.indexador-codigo`, `.indexador-nome` to new `_indexador-shared.scss`
- Updated `import-modal.scss` to use shared partial
- Deleted empty `breadcrumb.scss` and removed styleUrl from component

**Files Modified:**
- `src/app/layout/page-header/page-header.scss`
- `src/app/layout/user-profile/user-profile.scss`
- `src/app/layout/breadcrumb/breadcrumb.ts`
- `src/app/features/admin/securities/security-form/security-form.scss`
- `src/app/features/cadastro/indexadores/history/add-value-modal.scss`
- `src/app/features/cadastro/indexadores/history/import-modal.scss`

**Files Created:**
- `src/app/features/cadastro/indexadores/_indexador-shared.scss`

**Files Deleted:**
- `src/app/layout/breadcrumb/breadcrumb.scss`

### 2026-01-11 - Status Badge Colors Extraction

**Completed Tasks:**
- Added `status-neutral` tokens to `_theme-tokens.scss` for inactive/gray states
- Added CSS variable generation for `--status-neutral-*` in `_mixins.scss`
- Refactored `indexador-list.scss` to use semantic status CSS variables
- Refactored `calendario-list.scss` to use semantic status CSS variables
- Removed redundant light mode color overrides (now handled by theme system)

**New CSS Variables Added:**
- `--status-neutral` - Gray text color for inactive states
- `--status-neutral-bg` - Gray background for inactive badges
- `--status-neutral-border` - Gray border for inactive badges

**Colors Replaced (40+ instances):**
- `rgba(74, 246, 195, *)` → `var(--status-positive-*)` (active/success)
- `rgba(128, 128, 128, *)` → `var(--status-neutral-*)` (inactive)
- `rgba(0, 104, 255, *)` → `var(--status-info-*)` (edit/info)
- `rgba(220, 53, 69, *)` → `var(--status-negative-*)` (cancel/danger)
- `#4af6c3`, `#059669` → `var(--status-positive)` (teal/green)
- `#0068ff`, `#0369A1` → `var(--status-info)` (blue)
- `#B91C1C` → `var(--status-negative)` (red)
- `#6B7280` → `var(--status-neutral)` (gray)

**Files Modified:**
- `src/styles/_theme-tokens.scss` - Added status-neutral tokens
- `src/styles/_mixins.scss` - Added status-neutral CSS variable generation
- `src/app/features/cadastro/indexadores/indexador-list.scss` - Refactored to CSS variables
- `src/app/features/cadastro/calendario/calendario-list.scss` - Refactored to CSS variables

### 2026-01-11 - Amber Consolidation & Utility Classes

**Completed Tasks:**
- Added amber opacity scale tokens (`amber-4` through `amber-50`) to `_theme-tokens.scss`
- Added CSS variable generation for `--amber-*` scale in `_mixins.scss`
- Created animation stagger utility classes (`.animate-stagger-1` through `.animate-stagger-12`)
- Created grid container size classes (`.grid-container-xs` through `.grid-container-full`)
- Created chart placeholder and circle placeholder utility classes
- Refactored 70+ hard-coded `rgba(255, 160, 40, *)` values to use `var(--amber-*)` variables

**New CSS Variables Added (per theme):**
- `--amber-4` through `--amber-50` - Complete amber opacity scale

**New Utility Classes Added:**
- `.animate-stagger-1` to `.animate-stagger-12` - Animation delay stagger (0.1s increments)
- `.animate-stagger-50`, `.animate-stagger-75`, `.animate-stagger-150` - Additional stagger values
- `.grid-container-xs` (300px), `.grid-container-sm` (400px), `.grid-container-md` (500px)
- `.grid-container-lg` (600px), `.grid-container-xl` (700px), `.grid-container-full` (100vh - 180px)
- `.chart-placeholder-sm/md/lg/xl` - Chart placeholder heights
- `.placeholder-circle-sm/md/lg` - Circular placeholder dimensions

**Files Modified:**
- `src/styles/_theme-tokens.scss` - Added amber opacity scale for light and dark modes
- `src/styles/_mixins.scss` - Added amber CSS variable generation
- `src/styles/_utilities.scss` - Added animation stagger, grid container, and placeholder classes
- `src/styles/_components.scss` - Replaced 5 hard-coded amber values
- `src/styles/_data-grid.scss` - Replaced 1 hard-coded amber value
- `src/app/shared/components/data-grid/data-grid.scss` - Replaced 12 hard-coded amber values
- `src/app/layout/user-profile/user-profile.scss` - Replaced 18 hard-coded amber values
- `src/app/layout/page-header/page-header.scss` - Replaced 4 hard-coded amber values
- `src/app/layout/toasts-container/toasts-container.scss` - Replaced 1 hard-coded amber value
- `src/app/features/profile/profile.scss` - Replaced 9 hard-coded amber values
- `src/app/features/transactions/transaction-list.scss` - Replaced 10 hard-coded amber values
- `src/app/features/cadastro/indexadores/_indexador-shared.scss` - Replaced 1 hard-coded amber value
- `src/app/features/cadastro/indexadores/indexador-detail/indexador-detail.scss` - Replaced 3 hard-coded amber values
- `src/app/features/cadastro/indexadores/history/import-modal.scss` - Replaced 1 hard-coded amber value

---

*Document generated automatically from style analysis agents.*
