// Rota GET /api/transactions/[id]
// Busca o status e os dados completos de uma transação na UnblockPay pelo seu ID.
// Verifica que a transação pertence ao usuário autenticado via composite_transactions.

import { NextRequest, NextResponse } from 'next/server'
import { getTransaction } from '@/lib/unblockpay'
import { getServerSession } from '@/lib/auth'
import {
  getCompositeTransaction,
  getCompositeTransactionByPayinId,
  getCompositeTransactionByPayoutId,
} from '@/lib/composite-transactions'

// ---------------------------------------------------------------------------
// GET /api/transactions/[id]
// ---------------------------------------------------------------------------

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession()
  if (!session?.user?.id) {
    return NextResponse.json(
      { mensagem: 'Não autorizado. Faça login para continuar.' },
      { status: 401 },
    )
  }

  const { id } = await params

  if (!id) {
    return NextResponse.json(
      { mensagem: 'O parâmetro id da transação é obrigatório.' },
      { status: 400 },
    )
  }

  try {
    // Verifica se a transação pertence ao usuário autenticado
    // Busca na tabela composite_transactions pelo id, payin_id ou payout_id
    const composite =
      await getCompositeTransaction(id) ??
      await getCompositeTransactionByPayinId(id) ??
      await getCompositeTransactionByPayoutId(id)

    if (composite && composite.userId !== session.user.id) {
      return NextResponse.json(
        { mensagem: 'Acesso negado. Esta transação não pertence ao usuário autenticado.' },
        { status: 403 },
      )
    }

    const resultado = await getTransaction(id)

    if (!resultado.success && resultado.error?.includes('404')) {
      return NextResponse.json(
        { mensagem: 'Transação não encontrada. Verifique se o ID está correto.' },
        { status: 404 },
      )
    }

    if (!resultado.success || !resultado.data) {
      return NextResponse.json(
        {
          mensagem: 'Não foi possível buscar a transação na UnblockPay.',
          erro: resultado.error,
        },
        { status: 500 },
      )
    }

    return NextResponse.json(
      { transacao: resultado.data },
      { status: 200 },
    )
  } catch (err) {
    const mensagem =
      err instanceof Error ? err.message : 'Erro interno ao processar a requisição.'

    return NextResponse.json(
      { mensagem: 'Erro interno do servidor.', erro: mensagem },
      { status: 500 },
    )
  }
}
