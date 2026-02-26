// Rota POST /api/webhooks/unblockpay
// Recebe notificações automáticas da UnblockPay quando o status de uma transação muda.
// Esta rota é chamada pela UnblockPay, não pelo usuário.

import { NextRequest, NextResponse } from 'next/server'

// ---------------------------------------------------------------------------
// POST /api/webhooks/unblockpay
// ---------------------------------------------------------------------------
// Corpo esperado (enviado automaticamente pela UnblockPay):
// {
//   "event": "transaction.completed",   // tipo do evento
//   "transactionId": "uuid-da-transacao",
//   "status": "completed",              // novo status da transação
//   "timestamp": "2026-02-26T12:00:00Z" // momento em que o evento ocorreu
// }

export async function POST(request: NextRequest) {
  try {
    // Lê e valida o corpo da requisição enviado pela UnblockPay
    let body: Record<string, unknown>
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { mensagem: 'O corpo da requisição deve ser um JSON válido.' },
        { status: 400 },
      )
    }

    // TODO: verificar assinatura HMAC da UnblockPay antes de processar
    // Isso garante que a requisição foi enviada pela UnblockPay e não por terceiros.
    // Exemplo: comparar o header 'x-unblockpay-signature' com o HMAC calculado do body.

    // Valida os campos obrigatórios do webhook
    if (!body.event || typeof body.event !== 'string') {
      return NextResponse.json(
        { mensagem: 'O campo "event" é obrigatório.' },
        { status: 400 },
      )
    }

    if (!body.transactionId || typeof body.transactionId !== 'string') {
      return NextResponse.json(
        { mensagem: 'O campo "transactionId" é obrigatório.' },
        { status: 400 },
      )
    }

    if (!body.status || typeof body.status !== 'string') {
      return NextResponse.json(
        { mensagem: 'O campo "status" é obrigatório.' },
        { status: 400 },
      )
    }

    if (!body.timestamp || typeof body.timestamp !== 'string') {
      return NextResponse.json(
        { mensagem: 'O campo "timestamp" é obrigatório.' },
        { status: 400 },
      )
    }

    const { event, transactionId, status, timestamp } = body as {
      event: string
      transactionId: string
      status: string
      timestamp: string
    }

    // Processa o evento recebido conforme o tipo
    switch (event) {
      case 'transaction.completed':
        console.log(
          `[Webhook UnblockPay] Transação concluída — id: ${transactionId}, status: ${status}, timestamp: ${timestamp}`,
        )
        break

      case 'transaction.failed':
        console.log(
          `[Webhook UnblockPay] Transação falhou — id: ${transactionId}, status: ${status}, timestamp: ${timestamp}`,
        )
        break

      default:
        console.log(
          `[Webhook UnblockPay] Evento não reconhecido: "${event}" — id: ${transactionId}, timestamp: ${timestamp}`,
        )
    }

    // TODO: salvar atualização no banco de dados quando disponível
    // Exemplo: await db.transactions.update({ id: transactionId, status })

    // TODO: notificar o usuário por email ou push notification
    // Exemplo: await enviarEmailDeConfirmacao(transactionId, status)

    // Confirma o recebimento do webhook para a UnblockPay
    return NextResponse.json({ received: true }, { status: 200 })
  } catch (err) {
    // Captura erros inesperados para não deixar a UnblockPay sem resposta
    const mensagem =
      err instanceof Error ? err.message : 'Erro interno ao processar o webhook.'

    console.error('[Webhook UnblockPay] Erro inesperado:', mensagem)

    return NextResponse.json(
      { mensagem: 'Erro interno ao processar o webhook.' },
      { status: 500 },
    )
  }
}
