# HDFC NetBanking — Frontend

A production-grade React frontend for the HDFC NetBanking microservices platform.
Built with Vite, React, TypeScript, TailwindCSS, and tested with Vitest.

## Tech Stack

- **Framework** — React 18 + TypeScript
- **Build Tool** — Vite
- **Styling** — TailwindCSS v3
- **State Management** — Zustand (client), TanStack Query (server)
- **HTTP Client** — Axios
- **Routing** — React Router v6
- **Testing** — Vitest + React Testing Library

## Architecture

Package-by-feature structure. Each feature owns its components, hooks,
services, types, and tests. Shared utilities and components live in `src/shared/`.

## Backend

This frontend connects to two backend entry points:
- **API Gateway** — port 8080 (customer-facing traffic)
- **Admin Gateway** — port 8090 (admin-only traffic)

Backend repository: [hdfc-netbanking-backend](https://github.com/adebola-folorunsho/hdfc-netbanking-backend)

## Getting Started
```bash
npm install
npm run dev
```

## Running Tests
```bash
npx vitest run
```

## Sprint Progress

### ✅ Sprint 1 — Authentication (Complete)
- Login page with username/email and password
- Registration page with full profile fields
- Two-factor authentication (TOTP) screen
- Silent refresh — restores auth state on page refresh via refresh token cookie
- Protected route guard with role-based access scaffold
- Shared components — InputField, Button (accessible, keyboard navigable)
- 42 tests — all passing

### ✅ Sprint 2 — Dashboard (Complete)
- Customer dashboard with accounts grid and recent transactions table
- Account cards — account number, type, balance, status
- Transaction table — type, reference, amount, date, status badge
- Pagination — next/previous page controls
- Role-based routing — CUSTOMER → dashboard, TELLER → teller portal, ADMIN → admin portal
- Shared utilities — formatCurrency, formatDate, formatDateTime
- TanStack Query hooks — useMyAccounts, useMyTransactions
- 78 tests across 16 test files — all passing

### ✅ Sprint 3 — Transfers & Transaction History (Complete)
- Transfer form — sender account dropdown, receiver account number with format validation
- Amount validation — minimum ₦1.00, HDFC + 10 digit account number format
- Transfer hook — invalidates accounts cache on success so balances refresh automatically
- Transaction history page — full paginated history with account selector and type filter
- Client-side type filtering — All Types, Internal Transfer, Deposit, Withdrawal, Paystack Payment
- Dashboard updated — shows 5 most recent transactions with link to full history
- 105 tests across 21 test files — all passing

### ✅ Sprint 4 — Currency Converter (Complete)
- Currency converter page — amount input, from/to currency selectors, swap button, and live converted result
- Same-currency shortcut — API call skipped entirely when from and to currencies match
- Exchange rate widget — compact NGN rate display embedded on the dashboard with live currency selector
- Supported currencies cached for 10 minutes — API not hammered on every render
- Dashboard updated — exchange rate widget integrated, Currency nav link added to header
- Router updated — /currency route protected under ROLE_CUSTOMER
- 128 tests across 25 test files — all passing

### ✅ Sprint 5 — Admin Panel (Complete)
- `AdminLayout` — shared shell with sidebar navigation for all admin pages
- `AdminDashboardPage` — landing page with navigation cards to all admin features
- `AuditLogsPage` — paginated audit log table with TRANSACTION_CREATED / FRAUD_ALERT filter
- `StatementsPage` — search by user ID, paginated monthly statements table
- `UserLookupPage` — search by user ID, view profile, verify KYC, assign and revoke roles
- `AccountManagementPage` — search by user ID, view accounts, inline status update form
- `TransactionManagementPage` — reverse transactions, process manual deposits and withdrawals
- Admin services — `adminService`, `adminUserService`, `adminAccountService`, `adminTransactionService`
- Admin hooks — `useAuditLogs`, `useAuditLogById`, `useAuditLogsByType`, `useStatementsByUser`, `useUserLookup`, `useAccountManagement`, `useTransactionManagement`
- Audit and Scheduler endpoints via Admin Gateway (port 8090)
- User, Account, and Transaction endpoints via API Gateway (port 8080) with role enforcement
- 223 tests across 39 test files — all passing

### ✅ Sprint 6 — Profile & Settings (Complete)
- `ProfilePage` — unified profile and settings page accessible by all three roles
- Personal Information — read-only email and KYC status, editable full name, phone number, address
- Two-Factor Authentication — enable flow with QR code display and manual secret entry, verify form, disable button
- Change Password — current password, new password, confirm password (frontend validation), redirects to login on success
- Profile service — `fetchMyProfile`, `updateMyProfile`, `changeMyPassword`, `initiateTwoFactorSetup`, `verifyTwoFactorSetup`, `disableTwoFactor`
- Hooks — `useProfile`, `useUpdateProfile`, `useChangePassword`, `useTwoFactorSetup`
- Router updated — `/profile` route added, accessible by ROLE_CUSTOMER, ROLE_TELLER, ROLE_ADMIN
- Dashboard and Admin Panel updated — Profile nav link added to both
- 253 tests across 44 test files — all passing

## Auth Architecture

- Access token — memory only (Zustand store, lost on page refresh)
- Refresh token — js-cookie (restored on page load via silent refresh)
- Roles — `ROLE_CUSTOMER`, `ROLE_TELLER`, `ROLE_ADMIN`
- 2FA — TOTP via Google Authenticator or equivalent