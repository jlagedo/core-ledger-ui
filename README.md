# Core Ledger UI

A modern, enterprise-grade accounting ledger application built with Angular 21. Core Ledger UI provides comprehensive accounting management features including chart of accounts, journal entries, posting periods, and financial reporting.

https://github.com/user-attachments/assets/aba28667-f775-4824-beaa-c6dc95b71f4c

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Development](#development)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Building](#building)
- [Code Standards](#code-standards)

## ✨ Features

- **Chart of Accounts Management** - Create, organize, and manage account hierarchies
- **Journal Entries** - Record and track financial transactions with validation
- **Posting Periods** - Control accounting periods for accurate financial reporting
- **Balance Reports** - Generate comprehensive financial statements and reports
- **Dashboard** - Real-time overview of key financial metrics
- **Administration** - User management and system configuration
- **Toast Notifications** - Real-time user feedback for actions (success, error, warning, info)
- **Responsive Design** - Mobile-first UI using Bootstrap 5
- **Modern Angular Architecture** - Standalone components with signals-based state management

## 🛠️ Tech Stack

- **Framework:** [Angular 21](https://angular.dev)
- **State Management:** [@ngrx/signals](https://ngrx.io/guide/signals)
- **UI Framework:** [Bootstrap 5.3](https://getbootstrap.com)
- **Component Library:** [ng-bootstrap 20](https://ng-bootstrap.github.io)
- **Icons:** [Bootstrap Icons 1.13](https://icons.getbootstrap.com)
- **Testing:** [Vitest 4.0](https://vitest.dev)
- **Build Tool:** Angular CLI 21.0.4
- **Package Manager:** npm 11.6.2

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js:** >= 18.19.0 or >= 20.9.0
- **npm:** >= 11.6.2
- **Angular CLI:** 21.0.4

```bash
# Install Angular CLI globally
npm install -g @angular/cli@21.0.4
```

## 🚀 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd core-ledger-ui
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:4200/`

## 💻 Development

### Development Server

Start a local development server with live reload:

```bash
ng serve
# or
npm start
```

The application will automatically reload when you change any source files.

### Code Scaffolding

Generate new components, services, and more:

```bash
# Generate a new component
ng generate component features/my-feature/my-component

# Generate a new service
ng generate service services/my-service

# Generate a new directive
ng generate directive directives/my-directive
```

For a complete list of available schematics:
```bash
ng generate --help
```

## 📁 Project Structure

```
src/
├── app/
│   ├── config/              # Application configuration
│   ├── directives/          # Custom Angular directives
│   ├── features/            # Feature modules
│   │   ├── administration/     # User & system management
│   │   ├── balances-reports/   # Financial reporting
│   │   ├── chart-of-accounts/  # Account management
│   │   ├── dashboard/          # Main dashboard
│   │   ├── journal-entries/    # Transaction recording
│   │   └── posting-periods/    # Period management
│   ├── layout/              # Layout components (header, footer, toasts)
│   ├── models/              # TypeScript interfaces and types
│   ├── services/            # Shared services
│   │   └── toast-service.ts   # Toast notification service
│   ├── app.config.ts        # Application configuration
│   ├── app.routes.ts        # Routing configuration
│   └── app.ts               # Root component
├── public/                  # Static assets
└── main.ts                  # Application entry point
```

## 🧪 Testing

### Unit Tests

Run unit tests with Vitest:

```bash
ng test
# or
npm test
```

### End-to-End Tests

E2E testing framework is not configured by default. Choose and configure one based on your needs (e.g., Playwright, Cypress).

## 🏗️ Building

### Development Build

```bash
ng build
```

### Production Build

```bash
ng build --configuration production
```

Build artifacts will be stored in the `dist/` directory. The production build optimizes the application for performance and speed.

### Watch Mode

Automatically rebuild on file changes:

```bash
npm run watch
```

## 📏 Code Standards

This project follows Angular and TypeScript best practices:

- **Standalone Components** - All components use the standalone API
- **Signals** - Reactive state management using Angular signals
- **TypeScript Strict Mode** - Enabled for type safety
- **SCSS** - Styling with SCSS preprocessor
- **Prettier** - Code formatting (printWidth: 100, singleQuote: true)
- **Bootstrap Utilities** - Use Bootstrap classes, avoid inline styles

### Formatting

Code is formatted with Prettier. Configuration is in `package.json`:

```bash
# Format code (if formatter is set up)
npx prettier --write "src/**/*.{ts,html,scss}"
```

## 📚 Additional Resources

- [Angular Documentation](https://angular.dev)
- [Angular CLI Reference](https://angular.dev/tools/cli)
- [Bootstrap 5 Documentation](https://getbootstrap.com/docs/5.3)
- [ng-bootstrap Components](https://ng-bootstrap.github.io)
- [NgRx Signals](https://ngrx.io/guide/signals)
