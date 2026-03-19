/**
 * Represents a single audit log entry returned by the Audit Service.
 * Matches the AuditLogResponse DTO from the backend.
 * eventType is string — the backend stores it as a plain String, not an enum.
 */
export interface AuditLog {
  id: number
  eventType: string
  actor: string
  description: string
  createdAt: string
}

/**
 * The known event type values the Audit Service records.
 * Used as a frontend-only filter type — never assumed to be
 * the exhaustive set of values the backend may return.
 */
export type AuditEventType = 'TRANSACTION_CREATED' | 'FRAUD_ALERT'

/**
 * Filter value for the audit logs event type selector.
 * ALL is a frontend-only value — it means no filter is applied.
 */
export type AuditEventTypeFilter = AuditEventType | 'ALL'

/**
 * Represents a single statement entry returned by the Scheduler Service.
 * Matches the StatementResponse DTO from the backend.
 * userId and accountId are number — Java Long serializes as JSON number.
 */
export interface Statement {
  id: number
  userId: number
  accountId: number
  periodStart: string
  periodEnd: string
  generatedAt: string
}

/**
 * Spring Page<T> JSON shape — matches the paginated response
 * returned by all paginated admin endpoints.
 * Only the fields the frontend actually uses are mapped here.
 */
export interface PagedResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}

/**
 * Query parameters for paginated audit log requests.
 */
export interface AuditLogQueryParams {
  page: number
  size: number
}

/**
 * User profile — matches UserProfileResponse DTO from User Service.
 * roles is string[] with values CUSTOMER, TELLER, ADMIN — no ROLE_ prefix.
 */
export interface UserProfile {
  id: number
  fullName: string
  email: string
  phoneNumber: string
  address: string
  roles: string[]
  isEnabled: boolean
  isKycVerified: boolean
  isTwoFactorEnabled: boolean
  createdAt: string
  updatedAt: string
}

/**
 * Account response — matches AccountResponse DTO from Account Service.
 * balance is string — consistent with Sprint 2/3 frontend convention.
 * Never do arithmetic on balance in the frontend.
 */
export interface AdminAccountResponse {
  id: number
  userId: number
  accountNumber: string
  accountType: 'SAVINGS' | 'CURRENT' | 'FIXED_DEPOSIT'
  accountStatus: 'ACTIVE' | 'INACTIVE' | 'CLOSED' | 'FROZEN'
  // Balance treated as string — never do arithmetic on monetary values in JS
  balance: string
  currencyCode: string
  minimumBalance: string
  interestRate: string
  maturityDate: string | null
  createdAt: string
  updatedAt: string
}

/**
 * Transaction response — matches TransactionResponse DTO from Transaction Service.
 * All monetary fields treated as string — never do arithmetic on monetary values in JS.
 */
export interface AdminTransactionResponse {
  id: number
  userId: number
  transactionReference: string
  transactionType: 'INTERNAL_TRANSFER' | 'PAYSTACK_PAYMENT' | 'DEPOSIT' | 'WITHDRAWAL'
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REVERSED'
  sourceAccountId: number
  destinationAccountId: number
  // All monetary fields treated as string — consistent with frontend convention
  amount: string
  currencyCode: string
  convertedAmount: string | null
  convertedCurrencyCode: string | null
  exchangeRate: string | null
  description: string | null
  paystackReference: string | null
  failureReason: string | null
  createdAt: string
  updatedAt: string
}

/**
 * Request body for PATCH /api/v1/accounts/{accountId}/status
 */
export interface UpdateAccountStatusRequest {
  status: 'ACTIVE' | 'INACTIVE' | 'CLOSED' | 'FROZEN'
  reason: string
}

/**
 * Request body for POST /api/v1/transactions/deposit
 * and POST /api/v1/transactions/withdrawal
 * transactionReference is a client-generated idempotency key — TXN-${crypto.randomUUID()}
 */
export interface DepositWithdrawalRequest {
  accountId: number
  transactionType: 'DEPOSIT' | 'WITHDRAWAL'
  // Amount sent as string — consistent with frontend convention
  amount: string
  currencyCode: string
  description?: string
  transactionReference: string
}

/**
 * Request body for POST /api/v1/roles/{targetUserId}/assign
 * and DELETE /api/v1/roles/{targetUserId}/revoke
 * role values are CUSTOMER, TELLER, ADMIN — no ROLE_ prefix
 */
export interface RoleAssignmentRequest {
  role: 'CUSTOMER' | 'TELLER' | 'ADMIN'
}