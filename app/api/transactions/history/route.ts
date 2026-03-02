// Rota GET /api/transactions/history
// Retorna o histórico de transações compostas do usuário autenticado,
// ordenadas da mais recente para a mais antiga.

import { NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'
import { listCompositeTransactionsByUser } from '@/lib/composite-transactions'

// ---------------------------------------------------------------------------
// GET /api/transactions/history
// ---------------------------------------------------------------------------
// Não recebe parâmetros — usa o userId da sessão autenticada.
//
// Possíveis respostas:
//   200 — lista de transações compostas do usuário (pode ser vazia)
//   401 — usuário não autenticado
//   500 — erro interno do servidor

export async function GET() {
  try {
    // Valida autenticação — retorna 401 se o usuário não estiver logado
    const session = await getServerSession()

    if (!session?.user?.id) {
      return NextResponse.json(
        { mensagem: 'Não autorizado. Faça login para continuar.' },
        { status: 401 },
      )
    }

    const userId = session.user.id

    // Busca todas as transações compostas do usuário, ordenadas por data decrescente
    const transacoes = await listCompositeTransactionsByUser(userId)
    const ordenadas = transacoes.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )

    return NextResponse.json({ transacoes: ordenadas }, { status: 200 })
  } catch (err) {
    const mensagem =
      err instanceof Error ? err.message : 'Erro interno ao processar a requisição.'

    return NextResponse.json(
      { mensagem: 'Erro interno do servidor.', erro: mensagem },
      { status: 500 },
    )
  }
}
