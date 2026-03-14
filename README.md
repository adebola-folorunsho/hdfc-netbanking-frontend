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

### 🔜 Sprint 2 — Dashboard
### 🔜 Sprint 3 — Transfers & Transaction History
### 🔜 Sprint 4 — Currency Converter
### 🔜 Sprint 5 — Admin Panel
### 🔜 Sprint 6 — Profile & Settings

## Auth Architecture

- Access token — memory only (Zustand store, lost on page refresh)
- Refresh token — js-cookie (restored on page load via silent refresh)
- Roles — `ROLE_CUSTOMER`, `ROLE_TELLER`, `ROLE_ADMIN`
- 2FA — TOTP via Google Authenticator or equivalent