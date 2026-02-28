// Rota POST /api/webhooks/unblockpay
// Recebe notificações automáticas da UnblockPay sobre mudanças de status de transações.
// Não usa autenticação de sessão — a identidade é verificada via segredo compartilhado no header.

import { NextRequest, NextResponse } from 'next/server'
import { createPayout, getWallets } from '@/lib/unblockpay'
import {
  getCompositeTransactionByPayinId,
  getCompositeTransactionByPayoutId,
  updateCompositeTransaction,
} from '@/lib/composite-transactions'
import type { Quote, Transaction } from '@/types'

// ---------------------------------------------------------------------------
// Tipagem do corpo do webhook enviado pela UnblockPay
// ---------------------------------------------------------------------------

interface WebhookBody {
  event: string  // ex: "payin.completed", "payout.failed", "payout.refunded"
  data: Transaction & {
    error_message?: string
  }
}

// ---------------------------------------------------------------------------
// POST /api/webhooks/unblockpay
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    // 1. Verifica o segredo compartilhado no header para garantir autenticidade
    const webhookSecret = process.env.UNBLOCKPAY_WEBHOOK_SECRET
    const headerSecret = request.headers.get('x-webhook-secret')

    if (!webhookSecret || headerSecret !== webhookSecret) {
      return NextResponse.json(
        { mensagem: 'Segredo inválido ou não informado.' },
        { status: 401 },
      )
    }

    // 2. Lê o corpo do webhook
    let body: WebhookBody
    try {
      body = (await request.json()) as WebhookBody
    } catch {
      return NextResponse.json(
        { mensagem: 'O corpo da requisição deve ser um JSON válido.' },
        { status: 400 },
      )
    }

    const { event, data } = body
    const transactionId = data.id

    // 3. Pay-in concluído — buscar cotação off_ramp e criar payout
    if (event === 'payin.completed') {
      // a. Busca a transação composta pelo id do pay-in
      const compositeTx = await getCompositeTransactionByPayinId(transactionId)

      // b. Se não encontrar, retorna 200 (pode ser de outro sistema)
      if (!compositeTx) {
        return NextResponse.json({ received: true }, { status: 200 })
      }

      // c. Atualiza status para 'converting' — payout sendo preparado
      await updateCompositeTransaction(compositeTx.id, { status: 'converting' })

      // d. Busca cotação off_ramp (USDC → moeda de destino)
      const apiKey = process.env.UNBLOCKPAY_API_KEY
      const baseUrl = process.env.UNBLOCKPAY_BASE_URL

      if (!apiKey || !baseUrl) {
        console.error('[Webhook UnblockPay] Variáveis de ambiente da API não configuradas.')
        return NextResponse.json({ received: true }, { status: 200 })
      }

      const quoteResponse = await fetch(`${baseUrl}/quote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: apiKey,
        },
        body: JSON.stringify({
          type: 'off_ramp',
          from: 'USDC',
          to: compositeTx.receiverCurrency,
          amount: data.receiver.amount,
        }),
      })

      if (!quoteResponse.ok) {
        const quoteError = await quoteResponse.text()
        await updateCompositeTransaction(compositeTx.id, {
          status: 'failed',
          errorMessage: `Falha ao obter cotação off_ramp: ${quoteError}`,
        })
        console.error(`[Webhook UnblockPay] Cotação off_ramp falhou para tx composta ${compositeTx.id}:`, quoteError)
        return NextResponse.json({ received: true }, { status: 200 })
      }

      const quote = (await quoteResponse.json()) as Quote

      // e. Busca a wallet do usuário para usar como sender no payout
      const walletsResult = await getWallets(compositeTx.userId)

      if (!walletsResult.success || !walletsResult.data || walletsResult.data.length === 0) {
        await updateCompositeTransaction(compositeTx.id, {
          status: 'failed',
          errorMessage: 'Não foi possível encontrar a wallet do usuário para o payout.',
        })
        console.error(`[Webhook UnblockPay] Wallet não encontrada para usuário ${compositeTx.userId}.`)
        return NextResponse.json({ received: true }, { status: 200 })
      }

      const wallet = walletsResult.data[0]

      // f. Cria o payout (USDC → fiat destino)
      const payoutResult = await createPayout({
        amount: data.receiver.amount ?? 0,
        quote_id: quote.id,
        sender: {
          currency: 'USDC',
          payment_rail: wallet.blockchain,
          address: wallet.address,
        },
        receiver: {
          currency: compositeTx.receiverCurrency,
          ...(compositeTx.recipientPixKey
            ? { pix_key: compositeTx.recipientPixKey }
            : {}),
          ...(compositeTx.recipientExternalAccountId
            ? { external_account_id: compositeTx.recipientExternalAccountId }
            : {}),
        },
      })

      if (!payoutResult.success || !payoutResult.data) {
        await updateCompositeTransaction(compositeTx.id, {
          status: 'failed',
          errorMessage: `Falha ao criar payout: ${payoutResult.error}`,
        })
        console.error(`[Webhook UnblockPay] Payout falhou para tx composta ${compositeTx.id}:`, payoutResult.error)
        return NextResponse.json({ received: true }, { status: 200 })
      }

      // g. Atualiza a transação composta com o id do payout e status 'sending'
      await updateCompositeTransaction(compositeTx.id, {
        payoutId: payoutResult.data.id,
        status: 'sending',
      })

      console.log(
        `[Webhook UnblockPay] payin.completed ${transactionId} — payout ${payoutResult.data.id} criado para tx composta ${compositeTx.id}.`,
      )
    }

    // 4. Payout concluído — marcar transação composta como completed
    else if (event === 'payout.completed') {
      const compositeTx = await getCompositeTransactionByPayoutId(transactionId)

      if (!compositeTx) {
        return NextResponse.json({ received: true }, { status: 200 })
      }

      await updateCompositeTransaction(compositeTx.id, { status: 'completed' })

      console.log(
        `[Webhook UnblockPay] payout.completed ${transactionId} — tx composta ${compositeTx.id} finalizada.`,
      )
    }

    // 5. Pay-in ou payout reembolsado — marcar como refunded
    else if (event === 'payin.refunded' || event === 'payout.refunded') {
      const compositeTx =
        event === 'payin.refunded'
          ? await getCompositeTransactionByPayinId(transactionId)
          : await getCompositeTransactionByPayoutId(transactionId)

      if (compositeTx) {
        await updateCompositeTransaction(compositeTx.id, { status: 'refunded' })
        console.log(
          `[Webhook UnblockPay] ${event} ${transactionId} — tx composta ${compositeTx.id} marcada como refunded.`,
        )
      }
    }

    // 6. Pay-in ou payout falhou ou foi cancelado — marcar como failed
    else if (
      event === 'payin.failed' ||
      event === 'payin.cancelled' ||
      event === 'payout.failed' ||
      event === 'payout.cancelled'
    ) {
      const compositeTx = event.startsWith('payin.')
        ? await getCompositeTransactionByPayinId(transactionId)
        : await getCompositeTransactionByPayoutId(transactionId)

      if (compositeTx) {
        const errorMessage =
          typeof data.error_message === 'string'
            ? data.error_message
            : `Transação ${transactionId} encerrada com evento: ${event}`

        await updateCompositeTransaction(compositeTx.id, {
          status: 'failed',
          errorMessage,
        })

        console.log(
          `[Webhook UnblockPay] ${event} ${transactionId} — tx composta ${compositeTx.id} marcada como failed.`,
        )
      }
    }

    // 7. Retorna 200 em todos os casos — a UnblockPay não reenvia se receber 200
    return NextResponse.json({ received: true }, { status: 200 })
  } catch (err) {
    const mensagem =
      err instanceof Error ? err.message : 'Erro interno ao processar o webhook.'

    console.error('[Webhook UnblockPay] Erro inesperado:', mensagem)

    return NextResponse.json(
      { mensagem: 'Erro interno ao processar o webhook.' },
      { status: 500 },
    )
  }
}
