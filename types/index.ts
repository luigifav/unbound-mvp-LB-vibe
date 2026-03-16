// Tipagens TypeScript do projeto

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

/** Possíveis estados de uma transação na UnblockPay */
export enum TransactionStatus {
  AWAITING_DEPOSIT = 'awaiting_deposit', // aguardando depósito do cliente
  PROCESSING = 'processing',             // fundos recebidos, processando
  COMPLETED = 'completed',               // concluída com sucesso
  FAILED = 'failed',                     // falhou após tentativa de pagamento
  REFUNDED = 'refunded',                 // fundos devolvidos ao remetente
  CANCELLED = 'cancelled',               // cancelada (só em awaiting_deposit)
  ERROR = 'error',                       // erro que impediu o processamento
}

/** Tipo da transação */
export enum TransactionType {
  ON_RAMP = 'on_ramp',   // fiat → stablecoin (pay-in)
  OFF_RAMP = 'off_ramp', // stablecoin → fiat (payout)
}

// ---------------------------------------------------------------------------
// Customer
// ---------------------------------------------------------------------------

export type CustomerType = 'individual' | 'business'
export type CustomerStatus = 'approved' | 'pending' | 'rejected'

export interface Address {
  street_line_1: string
  street_line_2?: string
  city: string
  state: string
  postal_code: string
  country: string // ISO 3166-1 alpha-3
}

export interface CreateIndividualCustomerData {
  type: 'individual'
  first_name: string
  last_name: string
  email: string
  phone_number: string          // formato: +5511999999999
  date_of_birth: string         // formato: YYYY-MM-DD
  tin: string                   // CPF, SSN, etc.
  country: string               // ISO 3166-1 alpha-3: "BRA", "USA", "MEX"
  address: Address
}

export interface CreateBusinessCustomerData {
  type: 'business'
  business_legal_name: string
  date_of_incorporation: string // formato: YYYY-MM-DD
  email: string
  phone_number: string
  tax_id: string                // CNPJ, EIN, etc.
  country: string               // ISO 3166-1 alpha-3
  address: Address
  website?: string
  no_ubos?: boolean             // true se não há sócios/beneficiários
  beneficiaries?: Array<{
    first_name: string
    last_name: string
    email: string
    phone_number: string
    date_of_birth: string
    tin: string
    country: string
    share_size?: string         // ex: "25.5"
    address: Address
  }>
}

export type CreateCustomerData =
  | CreateIndividualCustomerData
  | CreateBusinessCustomerData

export interface Customer {
  id: string
  type: CustomerType
  email: string
  phone_number: string
  status: CustomerStatus
  // Campos de pessoa física
  first_name?: string
  last_name?: string
  date_of_birth?: string
  // Campos de pessoa jurídica
  business_legal_name?: string
  address: Address
  created_at: string
  updated_at: string
  verification?: { verification_link: string; verification_type: string }
}

// ---------------------------------------------------------------------------
// Wallet
// ---------------------------------------------------------------------------

export type Blockchain = 'solana' | 'ethereum' | 'polygon'

export interface CreateWalletData {
  name: string
  blockchain: Blockchain
}

export interface Wallet {
  id: string
  name: string
  blockchain: Blockchain
  address: string
  customer_id: string
  partner_id: string
  created_at: string
  updated_at: string
}

export interface WalletBalanceEntry {
  currency: string // ex: "USDC", "USDT"
  balance: number
}

export interface WalletBalance {
  wallet_id: string
  customer_id: string
  blockchain: Blockchain
  total_balance: number
  balances: WalletBalanceEntry[]
}

// ---------------------------------------------------------------------------
// Quote (cotação de câmbio)
// ---------------------------------------------------------------------------

export interface Quote {
  id: string
  quotation: string  // taxa de câmbio como string decimal
  symbol: string     // ex: "USDC/BRL"
  expires_at: number // unix timestamp
}

// ---------------------------------------------------------------------------
// Transaction
// ---------------------------------------------------------------------------

export interface TransactionSender {
  currency: string
  payment_rail: string
  address?: string
  name?: string
  document?: string
  amount?: number
}

export interface TransactionReceiverBankAccount {
  bank_name: string
  bank_code: string
  bank_account_number: string
  beneficiary: {
    document: string
    name: string
  }
}

export interface TransactionReceiver {
  currency: string
  payment_rail: string
  amount?: number
  address?: string
  wallet_id?: string
  pix_key?: string
  pix_key_type?: string
  pix_end_to_end_id?: string
  bank_account?: TransactionReceiverBankAccount
}

export interface SenderDepositInstructions {
  amount: number
  currency: string
  payment_rail: string
  deposit_address: string
}

export interface TransactionReceipt {
  initial_crypto_amount?: number
  final_fiat_amount?: number
  unblockpay_fee: number
}

export interface Transaction {
  id: string
  status: TransactionStatus
  type: TransactionType
  partner_id: string
  quotation: string
  sender_deposit_instructions?: SenderDepositInstructions
  sender: TransactionSender
  receiver: TransactionReceiver
  receipt?: TransactionReceipt
  created_at: string
  updated_at: string
  finished_at: string | null
}

// ---------------------------------------------------------------------------
// Pay-in (fiat → stablecoin)
// ---------------------------------------------------------------------------

export interface CreatePayinData {
  amount: number
  quote_id: string
  customer_id: string
  sender: {
    currency: string     // ex: "BRL", "MXN"
    payment_rail: string // ex: "pix", "spei"
    name: string
    document: string     // CPF, RFC, etc.
  }
  receiver: {
    currency: string     // ex: "USDC", "USDT"
    payment_rail: string // ex: "solana", "ethereum"
    wallet_id?: string   // wallet gerenciada pela UnblockPay
    address?: string     // endereço externo de blockchain
  }
}

// ---------------------------------------------------------------------------
// Payout (stablecoin → fiat)
// ---------------------------------------------------------------------------

export interface CreatePayoutData {
  amount: number
  quote_id: string
  sender: {
    currency: string     // ex: "USDC", "USDT"
    payment_rail: string // ex: "solana", "ethereum"
    address?: string     // endereço da wallet de origem
    wallet_id?: string   // alternativa ao address
  }
  receiver: {
    external_account_id?: string
    currency?: string
    payment_rail?: string // ex: "pix", "spei"
    pix_key?: string
    document?: string
  }
}

// ---------------------------------------------------------------------------
// Resposta genérica da API
// ---------------------------------------------------------------------------

export interface ApiResponse<T> {
  data: T | null
  error: string | null
  success: boolean
}

// ---------------------------------------------------------------------------
// Transação Composta (fluxo unificado pay-in + payout)
// ---------------------------------------------------------------------------

/** Possíveis estados de uma transação composta no fluxo unificado */
export type CompositeTransactionStatus =
  | 'pending_deposit'   // aguardando Pix do cliente
  | 'converting'        // pay-in completo, disparando payout
  | 'sending'           // payout em processamento
  | 'completed'         // payout concluído
  | 'failed'            // erro em qualquer etapa
  | 'refunded'          // pay-in reembolsado

export interface CompositeTransaction {
  id: string                     // UUID gerado pelo backend
  userId: string                 // id do usuário logado (session)
  payinId: string                // id da transação pay-in na UnblockPay
  payoutId?: string              // id da transação payout (preenchido depois)
  status: CompositeTransactionStatus
  amount: number                 // valor em fiat de origem
  senderCurrency: string         // ex: BRL
  receiverCurrency: string       // ex: MXN
  recipientName: string
  recipientPixKey?: string
  recipientExternalAccountId?: string
  depositInstructions?: {
    amount: number
    currency: string
    payment_rail: string
    deposit_address: string
  }
  quoteRate?: string             // taxa de câmbio usada
  createdAt: string
  updatedAt: string
  errorMessage?: string
}
