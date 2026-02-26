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
      // Loga o erro bruto da UnblockPay para facilitar debug no terminal do servidor
      console.error('[UnblockPay] Erro HTTP', response.status, JSON.stringify(body))

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
  return callApi<Customer>('/customers', {
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

  return callApi<Customer>(`/customers/${customerId}`)
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

  return callApi<Wallet>(`/customers/${customerId}/wallets`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
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
    `/customers/${customerId}/wallets/${walletId}/balance`,
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

  return callApi<Transaction>('/payin', {
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
  if (!data.quote_id) {
    return {
      data: null,
      error:
        'O campo quote_id é obrigatório. Obtenha uma cotação via endpoint /quote antes de criar o payout.',
      success: false,
    }
  }

  return callApi<Transaction>('/payout', {
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

  return callApi<Transaction>(`/transactions/${transactionId}`)
}
