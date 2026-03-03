// Rota GET /api/transactions/history
// Retorna o histórico de transações compostas do usuário autenticado,
// ordenadas da mais recente para a mais antiga.

import { NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'
import { listCompositeTransactionsByUser } from '@/lib/composite-transactions'

// ---------------------------------------------------------------------------
// GET /api/transactions/history
// ---------------------------------------------------------------------------
// Requer autenticação via sessão NextAuth (JWT).
//
// Possíveis respostas:
//   200 — { transacoes: [...] } ordenado por createdAt decrescente
//   401 — usuário não autenticado
//   500 — erro interno ao buscar as transações
//
// Exemplo de teste com curl (requer cookie de sessão):
// curl -b "next-auth.session-token=..." https://unbound-mvp.vercel.app/api/transactions/history

export async function GET() {
  // Verifica se o usuário está autenticado
  const session = await getServerSession()

  if (!session?.user?.id) {
    return NextResponse.json(
      { mensagem: 'Não autorizado. Faça login para acessar o histórico de transações.' },
      { status: 401 },
    )
  }

  try {
    // Busca todas as transações compostas do usuário autenticado
    const transacoes = await listCompositeTransactionsByUser(session.user.id)

    // Ordena as transações da mais recente para a mais antiga
    const transacoesOrdenadas = transacoes.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )

    return NextResponse.json({ transacoes: transacoesOrdenadas }, { status: 200 })
  } catch (err) {
    // Captura erros inesperados (ex: arquivo de storage corrompido ou ausente)
    const mensagem =
      err instanceof Error ? err.message : 'Erro interno ao processar a requisição.'

    return NextResponse.json(
      { mensagem: 'Erro interno do servidor.', erro: mensagem },
      { status: 500 },
    )
  }
}
