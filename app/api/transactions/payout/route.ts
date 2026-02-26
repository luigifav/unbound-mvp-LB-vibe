// Rota POST /api/transactions/payout
// Inicia uma transação de payout: converte stablecoin em moeda fiat (off-ramp)
// e envia para a conta bancária do destinatário.

import { NextRequest, NextResponse } from 'next/server'
import { createPayout } from '@/lib/unblockpay'
import type { CreatePayoutData } from '@/types'

// ---------------------------------------------------------------------------
// POST /api/transactions/payout
// ---------------------------------------------------------------------------
// Corpo esperado:
// {
//   "customerId": "uuid-do-customer",           // obrigatório
//   "amount": 1000,                             // obrigatório — valor a enviar
//   "currency": "USD",                          // obrigatório — moeda de destino (ex: "USD", "EUR")
//   "recipientName": "John Doe",                // obrigatório — nome do destinatário
//   "recipientBank": "Bank of America",         // obrigatório — banco do destinatário
//   "recipientAccount": "12345678",             // obrigatório — número da conta do destinatário
//   "quoteId": "uuid-da-cotacao",               // necessário para processar — obtido via /quote
//   "senderCurrency": "USDC",                   // opcional — moeda estável de origem (padrão: "USDC")
//   "senderPaymentRail": "solana"               // opcional — blockchain de origem (padrão: "solana")
// }
//
// Exemplo de teste com curl (substitua pela URL do seu projeto na Vercel):
// curl -X POST https://unbound-mvp.vercel.app/api/transactions/payout \
//   -H "Content-Type: application/json" \
//   -d '{
//     "customerId": "uuid-do-customer-aqui",
//     "amount": 1000,
//     "currency": "USD",
//     "recipientName": "John Doe",
//     "recipientBank": "Bank of America",
//     "recipientAccount": "12345678",
//     "quoteId": "uuid-da-cotacao-aqui"
//   }'

export async function POST(request: NextRequest) {
  try {
    // Lê e valida o corpo da requisição
    let body: Record<string, unknown>
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { mensagem: 'O corpo da requisição deve ser um JSON válido.' },
        { status: 400 },
      )
    }

    // Valida os campos obrigatórios
    if (!body.customerId || typeof body.customerId !== 'string') {
      return NextResponse.json(
        { mensagem: 'O campo "customerId" é obrigatório.' },
        { status: 400 },
      )
    }

    if (!body.amount || typeof body.amount !== 'number' || body.amount <= 0) {
      return NextResponse.json(
        { mensagem: 'O campo "amount" é obrigatório e deve ser um número positivo.' },
        { status: 400 },
      )
    }

    if (!body.currency || typeof body.currency !== 'string') {
      return NextResponse.json(
        { mensagem: 'O campo "currency" é obrigatório (ex: "USD", "EUR").' },
        { status: 400 },
      )
    }

    if (!body.recipientName || typeof body.recipientName !== 'string') {
      return NextResponse.json(
        { mensagem: 'O campo "recipientName" é obrigatório.' },
        { status: 400 },
      )
    }

    if (!body.recipientBank || typeof body.recipientBank !== 'string') {
      return NextResponse.json(
        { mensagem: 'O campo "recipientBank" é obrigatório.' },
        { status: 400 },
      )
    }

    if (!body.recipientAccount || typeof body.recipientAccount !== 'string') {
      return NextResponse.json(
        { mensagem: 'O campo "recipientAccount" é obrigatório.' },
        { status: 400 },
      )
    }

    // Monta o objeto de dados da transação conforme a interface CreatePayoutData
    const payoutData: CreatePayoutData = {
      amount: body.amount,
      // quoteId é necessário para processar o payout — obtido previamente via /quote
      quote_id: typeof body.quoteId === 'string' ? body.quoteId : '',
      sender: {
        // Moeda estável de origem (padrão USDC) e blockchain (padrão Solana)
        currency: typeof body.senderCurrency === 'string' ? body.senderCurrency : 'USDC',
        payment_rail: typeof body.senderPaymentRail === 'string' ? body.senderPaymentRail : 'solana',
      },
      receiver: {
        // Moeda fiat de destino e identificador da conta do destinatário
        currency: body.currency,
        external_account_id: body.recipientAccount,
      },
    }

    // Chama a API da UnblockPay para criar a transação de payout
    const resultado = await createPayout(payoutData)

    if (!resultado.success || !resultado.data) {
      return NextResponse.json(
        {
          mensagem: 'Não foi possível criar a transação de payout na UnblockPay.',
          erro: resultado.error,
        },
        { status: 500 },
      )
    }

    // Retorna os dados da transação criada
    return NextResponse.json(
      { transacao: resultado.data },
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
