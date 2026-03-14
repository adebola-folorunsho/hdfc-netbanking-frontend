// Standard API response envelope — matches ApiResponse<T> from all backend services
export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T | null
  timestamp: string
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
export interface Account {
  id: string
  userId: string
  accountNumber: string
  accountType: 'SAVINGS' | 'CURRENT' | 'FIXED_DEPOSIT'
  // Balance treated as string — never do arithmetic on monetary values in JS
  balance: string
  currency: 'NGN'
  status: 'ACTIVE' | 'INACTIVE' | 'FROZEN'
  createdAt: string
  updatedAt: string
}

// Balance response — matches GET /api/v1/accounts/{id}/balance
export interface AccountBalance {
  accountId: string
  // Balance treated as string — never do arithmetic on monetary values in JS
  balance: string
  currency: 'NGN'
}

// Transaction entity — matches Transaction Service response
export interface Transaction {
  id: string
  senderAccountId: string
  receiverAccountId: string
  // Amount treated as string — never do arithmetic on monetary values in JS
  amount: string
  currency: 'NGN'
  status: 'PENDING' | 'SUCCESS' | 'FAILED'
  type: 'INTERNAL_TRANSFER' | 'DEPOSIT' | 'WITHDRAWAL' | 'PAYSTACK_PAYMENT'
  reference: string
  createdAt: string
}