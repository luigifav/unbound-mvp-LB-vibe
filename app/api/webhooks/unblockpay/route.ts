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
  event: string           // ex: "transaction.completed", "transaction.failed"
  transaction_id: string  // UUID da transação na UnblockPay
  transaction_type: string // "on_ramp" ou "off_ramp"
  status: string          // novo status da transação
  data: Transaction       // objeto Transaction completo
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

    const { event, transaction_id, transaction_type, data } = body

    // 3. Pay-in (on_ramp) concluído — buscar cotação off_ramp e criar payout
    if (event === 'transaction.completed' && transaction_type === 'on_ramp') {
      // a. Busca a transação composta pelo id do pay-in
      const compositeTx = await getCompositeTransactionByPayinId(transaction_id)

      // b. Se não encontrar, retorna 200 (pode ser transação antiga ou de outro sistema)
      if (!compositeTx) {
        return NextResponse.json({ received: true }, { status: 200 })
      }

      // c. Atualiza status para 'converting' — indica que o payout está sendo preparado
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

      // f. Cria o payout (USDC → fiat destino) com wallet do usuário como sender
      //    e dados do destinatário salvos na transação composta como receiver
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
        `[Webhook UnblockPay] Pay-in ${transaction_id} concluído — payout ${payoutResult.data.id} criado para tx composta ${compositeTx.id}.`,
      )
    }

    // 4. Payout (off_ramp) concluído — marcar transação composta como completed
    else if (event === 'transaction.completed' && transaction_type === 'off_ramp') {
      // a. Busca a transação composta pelo id do payout
      const compositeTx = await getCompositeTransactionByPayoutId(transaction_id)

      if (!compositeTx) {
        return NextResponse.json({ received: true }, { status: 200 })
      }

      // b. Atualiza status para 'completed' — fluxo completo encerrado com sucesso
      await updateCompositeTransaction(compositeTx.id, { status: 'completed' })

      console.log(
        `[Webhook UnblockPay] Payout ${transaction_id} concluído — tx composta ${compositeTx.id} finalizada.`,
      )
    }

    // 5. Transação falhou — marcar a transação composta como failed
    else if (event === 'transaction.failed') {
      // a. Tenta localizar a transação composta pelo payinId e depois pelo payoutId
      const compositeTx =
        (await getCompositeTransactionByPayinId(transaction_id)) ??
        (await getCompositeTransactionByPayoutId(transaction_id))

      if (compositeTx) {
        // b. Atualiza status para 'failed' com a mensagem de erro da UnblockPay
        const errorMessage =
          typeof (data as unknown as { error_message?: string }).error_message === 'string'
            ? (data as unknown as { error_message: string }).error_message
            : `Transação ${transaction_id} falhou com status: ${body.status}`

        await updateCompositeTransaction(compositeTx.id, {
          status: 'failed',
          errorMessage,
        })

        console.log(
          `[Webhook UnblockPay] Transação ${transaction_id} falhou — tx composta ${compositeTx.id} marcada como failed.`,
        )
      }
    }

    // 6. Retorna 200 em todos os casos de sucesso — a UnblockPay não reenvia se receber 200
    return NextResponse.json({ received: true }, { status: 200 })
  } catch (err) {
    // Captura erros inesperados e loga para depuração
    const mensagem =
      err instanceof Error ? err.message : 'Erro interno ao processar o webhook.'

    console.error('[Webhook UnblockPay] Erro inesperado:', mensagem)

    return NextResponse.json(
      { mensagem: 'Erro interno ao processar o webhook.' },
      { status: 500 },
    )
  }
}
