// Rota GET /api/transactions/send/[id]
// Busca uma CompositeTransaction pelo ID e retorna os dados completos.
// Apenas o dono da transação pode acessá-la.

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'
import { getCompositeTransaction } from '@/lib/composite-transactions'

// ---------------------------------------------------------------------------
// GET /api/transactions/send/[id]
// ---------------------------------------------------------------------------

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // 1. Valida autenticação — retorna 401 se o usuário não estiver logado
    const session = await getServerSession()

    if (!session?.user?.id) {
      return NextResponse.json(
        { mensagem: 'Não autorizado. Faça login para continuar.' },
        { status: 401 },
      )
    }

    // 2. Pega o id da transação a partir dos parâmetros da URL
    const { id } = params

    // 3. Busca a CompositeTransaction pelo ID
    const compositeTransaction = await getCompositeTransaction(id)

    // 4. Retorna 404 se a transação não for encontrada
    if (!compositeTransaction) {
      return NextResponse.json(
        { mensagem: 'Transação não encontrada.' },
        { status: 404 },
      )
    }

    // 5. Verifica se a transação pertence ao usuário autenticado — retorna 403 se não for o dono
    if (compositeTransaction.userId !== session.user.id) {
      return NextResponse.json(
        { mensagem: 'Acesso negado. Esta transação não pertence ao usuário autenticado.' },
        { status: 403 },
      )
    }

    // 6. Retorna 200 com o objeto CompositeTransaction completo
    return NextResponse.json(compositeTransaction, { status: 200 })
  } catch (err) {
    // Captura erros inesperados
    const mensagem =
      err instanceof Error ? err.message : 'Erro interno ao processar a requisição.'

    return NextResponse.json(
      { mensagem: 'Erro interno do servidor.', erro: mensagem },
      { status: 500 },
    )
  }
}
