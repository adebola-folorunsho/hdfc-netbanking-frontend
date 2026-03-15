// Standard API response envelope — matches ApiResponse<T> from all backend services
// Fields: success, message, data only — no timestamp field
export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T | null
}

// Spring Boot Page<T> wrapper — matches paginated endpoints
export interface PageResponse<T> {
  content: T[]
  pageable: {
    pageNumber: number
    pageSize: number
  }
  totalElements: number
  totalPages: number
  last: boolean
  first: boolean
}

// Account entity — matches Account Service response
// id and userId are Long on backend — typed as number on frontend
export interface Account {
  id: number
  userId: number
  accountNumber: string
  accountType: 'SAVINGS' | 'CURRENT' | 'FIXED_DEPOSIT'
  // Balance is a String on the backend — never do arithmetic on this value
  balance: string
  currency: 'NGN'
  status: 'ACTIVE' | 'INACTIVE' | 'FROZEN'
  createdAt: string
  updatedAt: string
}

// Balance response — matches GET /api/v1/accounts/{id}/balance
// accountId is a Long on backend — typed as number on frontend
export interface AccountBalance {
  accountId: number
  // Balance is a String on the backend — never do arithmetic on this value
  balance: string
  currency: 'NGN'
}

// Transaction entity — matches Transaction Service response
export interface Transaction {
  id: string
  senderAccountId: string
  receiverAccountId: string
  // Amount is a String on the backend — never do arithmetic on this value
  amount: string
  currency: 'NGN'
  status: 'PENDING' | 'SUCCESS' | 'FAILED'
  type: 'INTERNAL_TRANSFER' | 'DEPOSIT' | 'WITHDRAWAL' | 'PAYSTACK_PAYMENT'
  reference: string
  description?: string
  createdAt: string
}