// Rota POST /api/transactions/send
// Inicia um envio internacional unificado: on-ramp (fiat → USDC via pay-in) e prepara
// o off-ramp futuro (USDC → moeda destino via payout).
// A USDC fica temporariamente na wallet do usuário como intermediário.

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'
import { getWallets, createPayin } from '@/lib/unblockpay'
import { saveCompositeTransaction } from '@/lib/composite-transactions'
import { saveExternalAccount, type ExternalAccount, type PaymentRail } from '@/lib/external-accounts'
import type { CompositeTransaction, Quote } from '@/types'

// ---------------------------------------------------------------------------
// POST /api/transactions/send
// ---------------------------------------------------------------------------
// Corpo esperado:
// {
//   "amount": 500,                          // obrigatório — valor em BRL a enviar
//   "senderCurrency": "BRL",                // obrigatório — moeda de origem
//   "senderPaymentRail": "pix",             // obrigatório — método de pagamento de saída
//   "senderName": "João Silva",             // obrigatório — nome do remetente
//   "senderDocument": "123.456.789-00",     // obrigatório — CPF do remetente
//   "receiverCurrency": "MXN",             // obrigatório — moeda de destino (ex: "MXN", "USD")
//   "receiverPaymentRail": "spei",          // obrigatório — método de pagamento de chegada
//   "recipientName": "Maria García",        // obrigatório — nome do destinatário
//   "recipientPixKey": "maria@email.com",   // opcional — chave Pix do destinatário
//   "recipientExternalAccountId": "uuid"    // opcional — id de conta externa na UnblockPay
// }

export async function POST(request: NextRequest) {
  try {
    // 1. Valida autenticação — retorna 401 se o usuário não estiver logado
    const session = await getServerSession()

    if (!session?.user?.id) {
      return NextResponse.json(
        { mensagem: 'Não autorizado. Faça login para continuar.' },
        { status: 401 },
      )
    }

    // O id do usuário na sessão corresponde ao customerId na UnblockPay
    const customerId = session.user.id

    // 2. Lê e valida o corpo da requisição
    let body: Record<string, unknown>
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { mensagem: 'O corpo da requisição deve ser um JSON válido.' },
        { status: 400 },
      )
    }

    // Valida campos obrigatórios
    if (!body.amount || typeof body.amount !== 'number') {
      return NextResponse.json(
        { mensagem: 'O campo "amount" é obrigatório e deve ser um número (valor em BRL).' },
        { status: 400 },
      )
    }

    if (!body.senderCurrency || typeof body.senderCurrency !== 'string') {
      return NextResponse.json(
        { mensagem: 'O campo "senderCurrency" é obrigatório (ex: "BRL").' },
        { status: 400 },
      )
    }

    if (!body.senderPaymentRail || typeof body.senderPaymentRail !== 'string') {
      return NextResponse.json(
        { mensagem: 'O campo "senderPaymentRail" é obrigatório (ex: "pix").' },
        { status: 400 },
      )
    }

    if (!body.senderName || typeof body.senderName !== 'string') {
      return NextResponse.json(
        { mensagem: 'O campo "senderName" é obrigatório.' },
        { status: 400 },
      )
    }

    if (!body.senderDocument || typeof body.senderDocument !== 'string') {
      return NextResponse.json(
        { mensagem: 'O campo "senderDocument" é obrigatório (CPF do remetente).' },
        { status: 400 },
      )
    }

    if (!body.receiverCurrency || typeof body.receiverCurrency !== 'string') {
      return NextResponse.json(
        { mensagem: 'O campo "receiverCurrency" é obrigatório (ex: "MXN", "USD").' },
        { status: 400 },
      )
    }

    if (!body.receiverPaymentRail || typeof body.receiverPaymentRail !== 'string') {
      return NextResponse.json(
        { mensagem: 'O campo "receiverPaymentRail" é obrigatório (ex: "spei", "ach").' },
        { status: 400 },
      )
    }

    if (!body.recipientName || typeof body.recipientName !== 'string') {
      return NextResponse.json(
        { mensagem: 'O campo "recipientName" é obrigatório.' },
        { status: 400 },
      )
    }

    // 3. Busca as wallets do usuário e pega a primeira disponível
    const walletsResult = await getWallets(customerId)

    if (!walletsResult.success || !walletsResult.data) {
      return NextResponse.json(
        {
          mensagem: 'Não foi possível buscar as wallets do usuário na UnblockPay.',
          erro: walletsResult.error,
        },
        { status: 500 },
      )
    }

    if (walletsResult.data.length === 0) {
      return NextResponse.json(
        { mensagem: 'Nenhuma wallet encontrada para o usuário. Crie uma wallet antes de enviar.' },
        { status: 400 },
      )
    }

    const wallet = walletsResult.data[0]

    // 4. Busca cotação on_ramp (BRL → USDC) na UnblockPay
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

    const quoteResponse = await fetch(`${baseUrl}/v1/quote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: apiKey,
      },
      body: JSON.stringify({
        type: 'on_ramp',
        from: body.senderCurrency,
        to: 'USDC',
        amount: body.amount,
      }),
    })

    if (!quoteResponse.ok) {
      const quoteError = await quoteResponse.text()
      return NextResponse.json(
        {
          mensagem: 'Não foi possível obter a cotação de câmbio na UnblockPay.',
          erro: quoteError,
        },
        { status: 502 },
      )
    }

    const quote = (await quoteResponse.json()) as Quote

    // 5. Cria o pay-in — a USDC fica na wallet do usuário como intermediário
    const payinResult = await createPayin({
      amount: body.amount as number,
      quote_id: quote.id,
      customer_id: customerId,
      sender: {
        currency: body.senderCurrency as string,
        payment_rail: body.senderPaymentRail as string,
        name: body.senderName as string,
        document: body.senderDocument as string,
      },
      receiver: {
        currency: 'USDC',
        payment_rail: 'solana',
        wallet_id: wallet.id,
      },
    })

    if (!payinResult.success || !payinResult.data) {
      return NextResponse.json(
        {
          mensagem: 'Não foi possível criar a transação de pay-in na UnblockPay.',
          erro: payinResult.error,
        },
        { status: 500 },
      )
    }

    // 6. Resolve os campos bancários do destinatário a partir de recipientBankingField
    //    quando o usuário digitou manualmente (sem selecionar conta salva)
    let resolvedPixKey =
      typeof body.recipientPixKey === 'string' && body.recipientPixKey
        ? body.recipientPixKey
        : undefined

    let resolvedExternalAccountId =
      typeof body.recipientExternalAccountId === 'string' && body.recipientExternalAccountId
        ? body.recipientExternalAccountId
        : undefined

    const recipientBankingField =
      typeof body.recipientBankingField === 'string' && body.recipientBankingField
        ? body.recipientBankingField
        : undefined

    if (!resolvedExternalAccountId && recipientBankingField) {
      const rail = body.receiverPaymentRail as string

      if (rail === 'pix') {
        // PIX → salva diretamente como recipientPixKey
        resolvedPixKey = recipientBankingField
      } else {
        // Demais rails (spei, cbu, pse, transfer) → cria ExternalAccount temporária
        const railFieldMap: Record<string, Partial<ExternalAccount>> = {
          spei: { clabe: recipientBankingField },
        }
        const railFields = railFieldMap[rail] ?? { accountNumber: recipientBankingField }

        const newAccount: ExternalAccount = {
          id: crypto.randomUUID(),
          userId: customerId,
          rail: rail.toUpperCase() as PaymentRail,
          currency: body.receiverCurrency as string,
          beneficiaryName: body.recipientName as string,
          ...railFields,
          createdAt: new Date().toISOString(),
        }

        await saveExternalAccount(newAccount)
        resolvedExternalAccountId = newAccount.id
      }
    }

    // 7. Gera um UUID único para a transação composta
    const compositeTransactionId = crypto.randomUUID()

    // 8. Salva a transação composta com status inicial 'pending_deposit'
    const agora = new Date().toISOString()

    const compositeTransaction: CompositeTransaction = {
      id: compositeTransactionId,
      userId: customerId,
      payinId: payinResult.data.id,
      status: 'pending_deposit',
      amount: body.amount as number,
      senderCurrency: body.senderCurrency as string,
      receiverCurrency: body.receiverCurrency as string,
      recipientName: body.recipientName as string,
      ...(resolvedPixKey ? { recipientPixKey: resolvedPixKey } : {}),
      ...(resolvedExternalAccountId ? { recipientExternalAccountId: resolvedExternalAccountId } : {}),
      depositInstructions: payinResult.data.sender_deposit_instructions,
      quoteRate: quote.quotation,
      createdAt: agora,
      updatedAt: agora,
    }

    await saveCompositeTransaction(compositeTransaction)

    // 9. Retorna 201 com as instruções de depósito e dados da cotação
    return NextResponse.json(
      {
        compositeTransactionId,
        depositInstructions: payinResult.data.sender_deposit_instructions,
        quoteRate: quote.quotation,
        expiresAt: quote.expires_at,
      },
      { status: 201 },
    )
  } catch (err) {
    // Captura erros inesperados (ex: variáveis de ambiente não configuradas)
    const mensagem =
      err instanceof Error ? err.message : 'Erro interno ao processar a requisição.'

    return NextResponse.json(
      { mensagem: 'Erro interno do servidor.', erro: mensagem },
      { status: 500 },
    )
  }
}
