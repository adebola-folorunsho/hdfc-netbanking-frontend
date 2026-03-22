# HDFC NetBanking — Frontend

The React frontend for [HDFC NetBanking](https://github.com/adebola-folorunsho/hdfc-netbanking-backend) — a production-grade microservices banking platform. Built with React 18, TypeScript, and TailwindCSS.

**Live → [hdfc-netbanking.vercel.app](https://hdfc-netbanking.vercel.app)**

> For full project documentation — architecture, backend setup, engineering decisions, and diagrams — see the [backend repository](https://github.com/adebola-folorunsho/hdfc-netbanking-backend).

---

## Tech Stack

| Technology | Purpose |
|---|---|
| React 18 + TypeScript | UI framework |
| Vite | Build tool |
| TailwindCSS v3 | Styling |
| Zustand | Client state (access token in memory) |
| TanStack Query | Server state and data fetching |
| Axios | HTTP client |
| React Router v6 | Routing |
| Vitest + React Testing Library | Testing |

---

## Features

- **Authentication** — Login, registration, silent refresh on page load, JWT access token stored in memory
- **2FA** — TOTP-based two-factor authentication with QR code setup and verification
- **Dashboard** — Account overview, recent transactions, live currency rate widget
- **Fund Transfers** — Initiate transfers between accounts
- **Transaction History** — Paginated transaction list with status badges
- **Currency Converter** — Live exchange rates via Currency Service
- **Profile** — Update profile, change password, enable/disable 2FA
- **Admin Panel** — Audit logs, statement management, user lookup, account and transaction management
- **RBAC** — Route protection based on `ROLE_CUSTOMER`, `ROLE_TELLER`, `ROLE_ADMIN`

---

## Running Locally

The frontend requires the backend stack to be running locally. Start the backend first:

```bash
# In hdfc-netbanking-backend
docker compose up --build
```

Then run the frontend:

```bash
git clone https://github.com/adebola-folorunsho/hdfc-netbanking-frontend.git
cd hdfc-netbanking-frontend
cp .env.example .env
npm install
npm run dev
```

Runs at [http://localhost:5173](http://localhost:5173).

---

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | API Gateway URL — customer-facing traffic (default: `http://localhost:8080`) |
| `VITE_ADMIN_API_BASE_URL` | Admin Gateway URL — admin-only traffic (default: `http://localhost:8090`) |

---

## Tests

```bash
npx vitest run
```

253 tests across 44 test files — all passing.

---

## Design System

| Token | Value |
|---|---|
| Primary | Navy `#0B1C3D` |
| Accent | Gold `#C9A84C` |
| Surface | `#FFFFFF` |
| Background | `#F4F6FA` |
| Heading font | Playfair Display |
| Body font | DM Sans |

---

## Author

**Adebola Folorunsho**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Adebola%20Folorunsho-blue?logo=linkedin)](https://www.linkedin.com/in/adebola-f-40b572208/)
[![Portfolio](https://img.shields.io/badge/Portfolio-adebola--folorunsho-black?logo=vercel)](https://my-portfolio-alpha-swart-39.vercel.app/)
[![Backend Repo](https://img.shields.io/badge/Backend-hdfc--netbanking--backend-green?logo=github)](https://github.com/adebola-folorunsho/hdfc-netbanking-backend)