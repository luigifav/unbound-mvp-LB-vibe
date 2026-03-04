// Rota POST /api/transactions/payin
// Inicia uma transação de pay-in: converte moeda fiat em stablecoin (on-ramp)
// e deposita na wallet do cliente na UnblockPay.

import { NextRequest, NextResponse } from 'next/server'
import { createPayin } from '@/lib/unblockpay'
import { getServerSession } from '@/lib/auth'
import type { CreatePayinData } from '@/types'

// ---------------------------------------------------------------------------
// POST /api/transactions/payin
// ---------------------------------------------------------------------------
// Corpo esperado:
// {
//   "customerId": "uuid-do-customer",           // obrigatório
//   "amount": 100,                              // obrigatório — valor a converter
//   "quoteId": "uuid-da-cotacao",               // obrigatório — obtido via /quote
//   "senderCurrency": "BRL",                    // obrigatório — moeda de origem
//   "senderPaymentRail": "pix",                 // obrigatório — método de pagamento
//   "senderName": "João Silva",                 // obrigatório — nome do remetente
//   "senderDocument": "123.456.789-00",         // obrigatório — CPF, RFC, etc.
//   "receiverCurrency": "USDC",                 // obrigatório — stablecoin de destino
//   "receiverPaymentRail": "solana",            // obrigatório — blockchain de destino
//   "receiverWalletId": "uuid-da-wallet",       // opcional — wallet gerenciada pela UnblockPay
//   "receiverAddress": "endereco-blockchain"    // opcional — endereço externo de blockchain
// }
//
// Exemplo de teste com curl (substitua pela URL do seu projeto na Vercel):
// curl -X POST https://unbound-mvp.vercel.app/api/transactions/payin \
//   -H "Content-Type: application/json" \
//   -d '{
//     "customerId": "uuid-do-customer-aqui",
//     "amount": 100,
//     "quoteId": "uuid-da-cotacao-aqui",
//     "senderCurrency": "BRL",
//     "senderPaymentRail": "pix",
//     "senderName": "João Silva",
//     "senderDocument": "123.456.789-00",
//     "receiverCurrency": "USDC",
//     "receiverPaymentRail": "solana",
//     "receiverWalletId": "uuid-da-wallet-aqui"
//   }'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session?.user?.id) {
      return NextResponse.json(
        { mensagem: 'Não autenticado.' },
        { status: 401 },
      )
    }

    // customerId é sempre extraído da sessão — ignora body.customerId
    const customerId = session.user.id

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
    if (!body.amount || typeof body.amount !== 'number') {
      return NextResponse.json(
        { mensagem: 'O campo "amount" é obrigatório e deve ser um número.' },
        { status: 400 },
      )
    }

    if (!body.quoteId || typeof body.quoteId !== 'string') {
      return NextResponse.json(
        { mensagem: 'O campo "quoteId" é obrigatório. Obtenha uma cotação via endpoint /quote antes de criar o pay-in.' },
        { status: 400 },
      )
    }

    if (!body.senderCurrency || typeof body.senderCurrency !== 'string') {
      return NextResponse.json(
        { mensagem: 'O campo "senderCurrency" é obrigatório (ex: "BRL", "MXN").' },
        { status: 400 },
      )
    }

    if (!body.senderPaymentRail || typeof body.senderPaymentRail !== 'string') {
      return NextResponse.json(
        { mensagem: 'O campo "senderPaymentRail" é obrigatório (ex: "pix", "spei").' },
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
        { mensagem: 'O campo "senderDocument" é obrigatório (CPF, RFC, etc.).' },
        { status: 400 },
      )
    }

    if (!body.receiverCurrency || typeof body.receiverCurrency !== 'string') {
      return NextResponse.json(
        { mensagem: 'O campo "receiverCurrency" é obrigatório (ex: "USDC", "USDT").' },
        { status: 400 },
      )
    }

    if (!body.receiverPaymentRail || typeof body.receiverPaymentRail !== 'string') {
      return NextResponse.json(
        { mensagem: 'O campo "receiverPaymentRail" é obrigatório (ex: "solana", "ethereum").' },
        { status: 400 },
      )
    }

    // Monta o objeto de dados da transação conforme a interface CreatePayinData
    const payinData: CreatePayinData = {
      amount: body.amount,
      quote_id: body.quoteId,
      customer_id: customerId, // sempre da sessão — nunca do body
      sender: {
        currency: body.senderCurrency,
        payment_rail: body.senderPaymentRail,
        name: body.senderName,
        document: body.senderDocument,
      },
      receiver: {
        currency: body.receiverCurrency,
        payment_rail: body.receiverPaymentRail,
        ...(typeof body.receiverWalletId === 'string' && body.receiverWalletId
          ? { wallet_id: body.receiverWalletId }
          : {}),
        ...(typeof body.receiverAddress === 'string' && body.receiverAddress
          ? { address: body.receiverAddress }
          : {}),
      },
    }

    // Chama a API da UnblockPay para criar a transação de pay-in
    const resultado = await createPayin(payinData)

    if (!resultado.success || !resultado.data) {
      return NextResponse.json(
        {
          mensagem: 'Não foi possível criar a transação de pay-in na UnblockPay.',
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
