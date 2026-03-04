// Rota POST /api/webhooks/unblockpay/[token]
// Recebe notificações automáticas da UnblockPay sobre mudanças de status de transações.
// A autenticidade é verificada via token no path e HMAC-SHA256 (segredo compartilhado) e também pelo
// verify-by-callback: consulta a própria API da UnblockPay para confirmar o status.

import { createHmac, timingSafeEqual } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { createPayout, getTransaction, getWallets } from '@/lib/unblockpay'
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
// POST /api/webhooks/unblockpay/[token]
// ---------------------------------------------------------------------------

// Mapeamento evento → status esperado na API da UnblockPay
const EVENT_TO_STATUS: Record<string, string> = {
  'payin.completed': 'completed',
  'payin.failed': 'failed',
  'payin.cancelled': 'cancelled',
  'payin.refunded': 'refunded',
  'payout.completed': 'completed',
  'payout.failed': 'failed',
  'payout.cancelled': 'cancelled',
  'payout.refunded': 'refunded',
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  try {
    // 0. Verifica token do path
    const { token } = await params
    const expectedToken = process.env.UNBLOCKPAY_WEBHOOK_TOKEN
    if (!expectedToken || token !== expectedToken) {
      return NextResponse.json({ mensagem: 'Não autorizado.' }, { status: 401 })
    }

    // 1. Lê o corpo como texto RAW para calcular o HMAC antes de fazer parse
    const rawBody = await request.text()
    let body: WebhookBody
    try {
      body = JSON.parse(rawBody) as WebhookBody
    } catch {
      return NextResponse.json({ mensagem: 'JSON inválido.' }, { status: 400 })
    }

    // 2. Verifica se o segredo está configurado
    const secret = process.env.UNBLOCKPAY_WEBHOOK_SECRET
    if (!secret) {
      console.error('[Webhook] UNBLOCKPAY_WEBHOOK_SECRET não configurado.')
      return NextResponse.json({ mensagem: 'Configuração interna inválida.' }, { status: 500 })
    }

    // 3. Verifica a assinatura HMAC-SHA256
    // TODO: confirmar nome exato do header com o suporte da UnblockPay
    const assinatura = request.headers.get('x-unblockpay-signature') ?? ''

    const hmacEsperado = createHmac('sha256', secret)
      .update(rawBody, 'utf8')
      .digest('hex')

    const bufferRecebido = Buffer.from(assinatura, 'hex')
    const bufferEsperado = Buffer.from(hmacEsperado, 'hex')

    const assinaturaValida =
      bufferRecebido.length === bufferEsperado.length &&
      timingSafeEqual(bufferRecebido, bufferEsperado)

    if (!assinaturaValida) {
      console.warn('[Webhook] Assinatura inválida — possível spoofing.')
      return NextResponse.json({ mensagem: 'Assinatura inválida.' }, { status: 401 })
    }

    const { event, data } = body
    const transactionId = data.id

    // 4. Verify-by-callback: confirma que a transação existe na UnblockPay
    //    e que o status dela é compatível com o evento recebido.
    const txResult = await getTransaction(transactionId)

    if (!txResult.success || !txResult.data) {
      console.warn(
        `[Webhook UnblockPay] Transação ${transactionId} não encontrada na API — webhook ignorado.`,
      )
      // Retorna 200 para a UnblockPay não reenviar; provavelmente é spoofing
      return NextResponse.json({ received: true }, { status: 200 })
    }

    const expectedStatus = EVENT_TO_STATUS[event]
    if (expectedStatus && txResult.data.status !== expectedStatus) {
      console.warn(
        `[Webhook UnblockPay] Status inconsistente para tx ${transactionId}: ` +
          `evento="${event}" esperava status="${expectedStatus}" mas API retornou "${txResult.data.status}" — webhook ignorado.`,
      )
      return NextResponse.json({ received: true }, { status: 200 })
    }

    // 5. Processa o evento verificado
    // Pay-in concluído — buscar cotação off_ramp e criar payout
    if (event === 'payin.completed') {
      // a. Busca a transação composta pelo id do pay-in
      const compositeTx = await getCompositeTransactionByPayinId(transactionId)

      // b. Se não encontrar, retorna 200 (pode ser de outro sistema)
      if (!compositeTx) {
        return NextResponse.json({ received: true }, { status: 200 })
      }

      // c. Evita criar payout duplicado se webhook for entregue mais de uma vez
      if (['converting', 'sending', 'completed'].includes(compositeTx.status)) {
        console.warn(`[Webhook] payin.completed já processado para tx ${compositeTx.id} — ignorando.`)
        return NextResponse.json({ received: true }, { status: 200 })
      }

      // d. Atualiza status para 'converting' — payout sendo preparado
      await updateCompositeTransaction(compositeTx.id, { status: 'converting' })

      // e. Busca cotação off_ramp (USDC → moeda de destino)
      const apiKey = process.env.UNBLOCKPAY_API_KEY
      const baseUrl = process.env.UNBLOCKPAY_BASE_URL

      if (!apiKey || !baseUrl) {
        console.error('[Webhook UnblockPay] Variáveis de ambiente da API não configuradas.')
        return NextResponse.json({ received: true }, { status: 200 })
      }

      const quoteResponse = await fetch(`${baseUrl}/v1/quote`, {
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

      // f. Busca a wallet do usuário para usar como sender no payout
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

      // g. Cria o payout (USDC → fiat destino)
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

      // h. Atualiza a transação composta com o id do payout e status 'sending'
      await updateCompositeTransaction(compositeTx.id, {
        payoutId: payoutResult.data.id,
        status: 'sending',
      })

      console.log(
        `[Webhook UnblockPay] payin.completed ${transactionId} — payout ${payoutResult.data.id} criado para tx composta ${compositeTx.id}.`,
      )
    }

    // Payout concluído — marcar transação composta como completed
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

    // Pay-in ou payout reembolsado — marcar como refunded
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

    // Pay-in ou payout falhou ou foi cancelado — marcar como failed
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

    // 6. Retorna 200 em todos os casos — a UnblockPay não reenvia se receber 200
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
