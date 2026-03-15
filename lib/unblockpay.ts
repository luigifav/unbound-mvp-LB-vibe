// Funções de integração com a API da UnblockPay

import type {
  ApiResponse,
  CreateCustomerData,
  CreatePayinData,
  CreatePayoutData,
  CreateWalletData,
  Customer,
  Transaction,
  Wallet,
  WalletBalance,
} from '@/types'

// ---------------------------------------------------------------------------
// Tipos auxiliares para KYC
// ---------------------------------------------------------------------------

type DocumentType =
  | 'PASSPORT'
  | 'NATIONAL_ID'
  | 'DRIVER_LICENSE'
  | 'PROOF_OF_ADDRESS'
  | 'SELFIE'
  | 'INCORPORATION_ARTICLES'
  | 'INCORPORATION_CERTIFICATE'
  | 'INCUMBENCY_CERTIFICATE'
  | 'SHAREHOLDER_REGISTRY'
  | 'STATE_COMPANY_REGISTRY'

interface VerificationDetails {
  customer_id: string
  customer_status: string
  verification_steps: {
    pending: string[]
    under_review: string[]
    partially_rejected: Array<{ name: string; rejection_code: string[]; rejection_description: string }>
    approved: string[]
    rejected: Array<{ name: string; rejection_code: string[]; rejection_description: string }>
  }
}

// ---------------------------------------------------------------------------
// Configuração base
// ---------------------------------------------------------------------------

/**
 * Retorna as configurações de ambiente necessárias para chamar a API.
 * Lança um erro descritivo se alguma variável não estiver configurada.
 */
function getConfig() {
  const apiKey = process.env.UNBLOCKPAY_API_KEY
  const baseUrl = process.env.UNBLOCKPAY_BASE_URL

  if (!apiKey) {
    throw new Error(
      'Variável de ambiente UNBLOCKPAY_API_KEY não configurada. ' +
        'Adicione-a no painel do Vercel ou no arquivo .env.local.',
    )
  }
  if (!baseUrl) {
    throw new Error(
      'Variável de ambiente UNBLOCKPAY_BASE_URL não configurada. ' +
        'Exemplo: https://api.sandbox.unblockpay.com',
    )
  }

  return { apiKey, baseUrl }
}

/**
 * Monta os headers padrão para todas as requisições à API.
 */
function buildHeaders(apiKey: string): HeadersInit {
  return {
    'Content-Type': 'application/json',
    Authorization: apiKey,
  }
}

/**
 * Função auxiliar interna que executa uma chamada fetch para a API da UnblockPay
 * e normaliza o resultado no formato ApiResponse<T>.
 *
 * @param path   Caminho da rota a partir da base URL (ex: "/customers")
 * @param init   Opções do fetch (method, body, etc.)
 */
async function callApi<T>(
  path: string,
  init?: RequestInit,
): Promise<ApiResponse<T>> {
  const { apiKey, baseUrl } = getConfig()

  try {
    const response = await fetch(`${baseUrl}${path}`, {
      ...init,
      headers: {
        ...buildHeaders(apiKey),
        ...(init?.headers ?? {}),
      },
    })

    // Tenta fazer parse do corpo independente do status HTTP
    let body: unknown
    const contentType = response.headers.get('content-type') ?? ''
    if (contentType.includes('application/json')) {
      body = await response.json()
    } else {
      body = await response.text()
    }

    if (!response.ok) {
      // Extrai a mensagem de erro do corpo quando disponível
      const message =
        typeof body === 'object' &&
        body !== null &&
        'message' in body &&
        typeof (body as Record<string, unknown>).message === 'string'
          ? (body as Record<string, string>).message
          : `Erro ${response.status}: ${response.statusText}`

      return { data: null, error: message, success: false }
    }

    // Resposta bem-sucedida com corpo vazio (ex.: POST de KYC check)
    const contentLength = response.headers.get('content-length')
    if (contentLength === '0' || !contentType) {
      return { data: null as T, error: null, success: true }
    }

    return { data: body as T, error: null, success: true }
  } catch (err) {
    // Erros de rede ou de parse
    const message =
      err instanceof Error
        ? `Falha na comunicação com a UnblockPay: ${err.message}`
        : 'Erro desconhecido ao chamar a API da UnblockPay.'

    return { data: null, error: message, success: false }
  }
}

// ---------------------------------------------------------------------------
// Customers
// ---------------------------------------------------------------------------

/**
 * Cria um novo cliente (individual ou empresa) na UnblockPay.
 * O cliente precisa passar por verificação KYC/KYB antes de transacionar.
 *
 * @param data Dados do cliente conforme CreateCustomerData
 * @returns O objeto Customer criado, com id e status inicial
 */
export async function createCustomer(
  data: CreateCustomerData,
): Promise<ApiResponse<Customer>> {
  return callApi<Customer>('/v1/customers', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

/**
 * Busca os dados de um cliente existente pelo seu ID.
 * Útil para verificar o status de aprovação do KYC/KYB.
 *
 * @param customerId UUID do cliente na UnblockPay
 * @returns O objeto Customer com todos os seus dados
 */
export async function getCustomer(
  customerId: string,
): Promise<ApiResponse<Customer>> {
  if (!customerId) {
    return {
      data: null,
      error: 'O parâmetro customerId é obrigatório.',
      success: false,
    }
  }

  return callApi<Customer>(`/v1/customers/${customerId}`)
}

// ---------------------------------------------------------------------------
// Wallets
// ---------------------------------------------------------------------------

/**
 * Cria uma nova wallet de stablecoin para um cliente.
 * Cada cliente pode ter múltiplas wallets em diferentes blockchains.
 *
 * @param customerId UUID do cliente dono da wallet
 * @param data       Nome e blockchain da wallet (ex: { name: "Principal", blockchain: "solana" })
 * @returns O objeto Wallet criado, com o endereço blockchain gerado
 */
export async function createWallet(
  customerId: string,
  data: CreateWalletData,
): Promise<ApiResponse<Wallet>> {
  if (!customerId) {
    return {
      data: null,
      error: 'O parâmetro customerId é obrigatório.',
      success: false,
    }
  }

  return callApi<Wallet>(`/v1/customers/${customerId}/wallets`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

/**
 * Lista todas as wallets de um cliente.
 *
 * @param customerId UUID do cliente na UnblockPay
 * @returns Array de objetos Wallet com endereços e dados da blockchain
 */
export async function getWallets(
  customerId: string,
): Promise<ApiResponse<Wallet[]>> {
  if (!customerId) {
    return {
      data: null,
      error: 'O parâmetro customerId é obrigatório.',
      success: false,
    }
  }

  return callApi<Wallet[]>(`/v1/customers/${customerId}/wallets`)
}

/**
 * Retorna o saldo atual de uma wallet, discriminado por moeda (USDC, USDT, etc.).
 *
 * @param customerId UUID do cliente dono da wallet
 * @param walletId   UUID da wallet cujo saldo será consultado
 * @returns Objeto WalletBalance com o saldo total e por moeda
 */
export async function getWalletBalance(
  customerId: string,
  walletId: string,
): Promise<ApiResponse<WalletBalance>> {
  if (!customerId || !walletId) {
    return {
      data: null,
      error: 'Os parâmetros customerId e walletId são obrigatórios.',
      success: false,
    }
  }

  return callApi<WalletBalance>(
    `/v1/customers/${customerId}/wallets/${walletId}/balance`,
  )
}

// ---------------------------------------------------------------------------
// Transactions — Pay-in (fiat → stablecoin)
// ---------------------------------------------------------------------------

/**
 * Inicia uma transação de pay-in: converte moeda fiat (ex: BRL via Pix)
 * em stablecoin (ex: USDC na Solana) e deposita na wallet do cliente.
 *
 * Antes de chamar esta função, obtenha um quote_id válido via endpoint /quote
 * com type "on_ramp".
 *
 * Após criar o pay-in, o campo sender_deposit_instructions na resposta contém
 * os dados bancários para o cliente realizar o depósito fiat.
 *
 * @param data Dados do pay-in: valor, quote_id, remetente e destinatário
 * @returns A transação criada com status inicial awaiting_deposit
 */
export async function createPayin(
  data: CreatePayinData,
): Promise<ApiResponse<Transaction>> {
  if (!data.quote_id) {
    return {
      data: null,
      error:
        'O campo quote_id é obrigatório. Obtenha uma cotação via endpoint /quote antes de criar o pay-in.',
      success: false,
    }
  }

  return callApi<Transaction>('/v1/payin', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

// ---------------------------------------------------------------------------
// Transactions — Payout (stablecoin → fiat)
// ---------------------------------------------------------------------------

/**
 * Inicia uma transação de payout: converte stablecoin (ex: USDC)
 * em moeda fiat (ex: BRL via Pix) e envia para a conta bancária do destinatário.
 *
 * Antes de chamar esta função, obtenha um quote_id válido via endpoint /quote
 * com type "off_ramp".
 *
 * Se o endereço de envio for desconhecido no momento da criação, omita
 * sender.address e confirme depois via endpoint /payout/confirm.
 *
 * @param data Dados do payout: valor, quote_id, remetente e destinatário
 * @returns A transação criada com status inicial awaiting_deposit
 */
export async function createPayout(
  data: CreatePayoutData,
): Promise<ApiResponse<Transaction>> {
  return callApi<Transaction>('/v1/payout', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

// ---------------------------------------------------------------------------
// Transactions — consulta de status
// ---------------------------------------------------------------------------

/**
 * Busca o estado atual de uma transação (pay-in ou payout) pelo seu ID.
 * Use esta função para fazer polling de status ou para exibir o detalhe
 * de uma transação específica na interface.
 *
 * Possíveis status: awaiting_deposit → processing → completed | failed | refunded | cancelled | error
 *
 * @param transactionId UUID da transação na UnblockPay
 * @returns O objeto Transaction completo com status atualizado
 */
export async function getTransaction(
  transactionId: string,
): Promise<ApiResponse<Transaction>> {
  if (!transactionId) {
    return {
      data: null,
      error: 'O parâmetro transactionId é obrigatório.',
      success: false,
    }
  }

  return callApi<Transaction>(`/v1/transactions/${transactionId}`)
}

/**
 * Lista todas as transações de um cliente (pay-ins e payouts).
 * Use esta função para exibir o histórico no dashboard.
 *
 * @param customerId UUID do cliente na UnblockPay
 * @returns Array de transações ordenado por data decrescente
 */
export async function getTransactions(
  customerId: string,
): Promise<ApiResponse<Transaction[]>> {
  if (!customerId) {
    return {
      data: null,
      error: 'O parâmetro customerId é obrigatório.',
      success: false,
    }
  }

  return callApi<Transaction[]>(`/v1/customers/${customerId}/transactions`)
}

// ---------------------------------------------------------------------------
// KYC — Upload de documento, verificação e consulta de detalhes
// ---------------------------------------------------------------------------

/**
 * Faz upload de um documento para o processo de KYC/KYB de um cliente.
 * Deve ser chamado para cada documento exigido antes de iniciar a verificação.
 *
 * Usa FormData (multipart/form-data) — o Content-Type é definido automaticamente
 * pelo fetch com o boundary correto, por isso NÃO passamos Content-Type manual.
 *
 * @param customerId  UUID do cliente na UnblockPay
 * @param file        Arquivo do documento (File ou Blob)
 * @param metadata    Tipo do documento e informações opcionais
 * @returns           O id do documento criado
 */
export async function uploadCustomerDocument(
  customerId: string,
  file: File | Blob,
  metadata: {
    document_type: DocumentType
    document_side?: 'FRONT' | 'BACK'
    country?: string
    beneficiary_id?: string
  },
): Promise<ApiResponse<{ id: string }>> {
  if (!customerId) {
    return { data: null, error: 'O parâmetro customerId é obrigatório.', success: false }
  }

  const identityDocTypes: DocumentType[] = ['PASSPORT', 'NATIONAL_ID', 'DRIVER_LICENSE']
  if (identityDocTypes.includes(metadata.document_type) && !metadata.document_side) {
    return {
      data: null,
      error: 'document_side é obrigatório para documentos de identidade (PASSPORT, NATIONAL_ID, DRIVER_LICENSE). Use FRONT ou BACK.',
      success: false,
    }
  }

  const { apiKey, baseUrl } = getConfig()

  const form = new FormData()
  form.append('file', file)

  const metadataPayload: Record<string, string> = {
    document_type: metadata.document_type,
  }
  if (metadata.document_side) metadataPayload.document_side = metadata.document_side
  if (metadata.country) metadataPayload.country = metadata.country
  if (metadata.beneficiary_id) metadataPayload.beneficiary_id = metadata.beneficiary_id

  form.append('metadata', JSON.stringify(metadataPayload))

  try {
    const response = await fetch(
      `${baseUrl}/v1/customers/${customerId}/documents`,
      {
        method: 'POST',
        headers: { Authorization: apiKey }, // sem Content-Type — o fetch define o boundary automaticamente
        body: form,
      },
    )

    let body: unknown
    const contentType = response.headers.get('content-type') ?? ''
    if (contentType.includes('application/json')) {
      body = await response.json()
    } else {
      body = await response.text()
    }

    if (!response.ok) {
      const message =
        typeof body === 'object' &&
        body !== null &&
        'message' in body &&
        typeof (body as Record<string, unknown>).message === 'string'
          ? (body as Record<string, string>).message
          : `Erro ${response.status}: ${response.statusText}`
      return { data: null, error: message, success: false }
    }

    return { data: body as { id: string }, error: null, success: true }
  } catch (err) {
    const message =
      err instanceof Error
        ? `Falha no upload do documento: ${err.message}`
        : 'Erro desconhecido ao fazer upload do documento.'
    return { data: null, error: message, success: false }
  }
}

/**
 * Inicia a verificação KYC/KYB de um cliente.
 * Deve ser chamado APÓS o upload de todos os documentos exigidos.
 *
 * @param customerId UUID do cliente na UnblockPay
 */
export async function runKycCheck(customerId: string): Promise<ApiResponse<null>> {
  if (!customerId) {
    return { data: null, error: 'O parâmetro customerId é obrigatório.', success: false }
  }

  return callApi<null>(`/v1/customers/${customerId}/check`, { method: 'POST' })
}

/**
 * Consulta os detalhes da verificação KYC/KYB de um cliente,
 * incluindo quais etapas estão pendentes, aprovadas ou rejeitadas.
 *
 * @param customerId UUID do cliente na UnblockPay
 */
export async function getVerificationDetails(
  customerId: string,
): Promise<ApiResponse<VerificationDetails>> {
  if (!customerId) {
    return { data: null, error: 'O parâmetro customerId é obrigatório.', success: false }
  }

  return callApi<VerificationDetails>(`/v1/customers/${customerId}/verification-details`)
}
