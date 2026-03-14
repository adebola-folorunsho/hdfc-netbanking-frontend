// Request body for POST /api/v1/transactions/transfer
export interface TransferRequest {
  senderAccountId: string
  receiverAccountId: string
  // Amount sent as number — backend handles BigDecimal conversion
  // Frontend never does arithmetic on this value
  amount: number
  currency: 'NGN'
  description?: string
}

// Validation errors for the transfer form — one field at a time
export interface TransferFormErrors {
  senderAccountId?: string
  receiverAccountId?: string
  amount?: string
  description?: string
}