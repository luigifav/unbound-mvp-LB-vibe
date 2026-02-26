// Rota GET /api/transactions/[id]
// Busca o status e os dados completos de uma transação na UnblockPay pelo seu ID.

import { NextRequest, NextResponse } from 'next/server'
import { getTransaction } from '@/lib/unblockpay'

// ---------------------------------------------------------------------------
// GET /api/transactions/[id]
// ---------------------------------------------------------------------------
// Parâmetro de rota:
//   id — UUID da transação na UnblockPay (ex: /api/transactions/abc123)
//
// Possíveis respostas:
//   200 — transação encontrada, retorna { transacao: Transaction }
//   404 — transação não encontrada na UnblockPay
//   500 — erro ao comunicar com a API externa ou erro interno do servidor
//
// Exemplo de teste com curl (substitua pela URL do seu projeto na Vercel):
// curl https://unbound-mvp.vercel.app/api/transactions/uuid-da-transacao

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  // Extrai o id da transação dos parâmetros de rota
  const { id } = await params

  // Valida se o id foi fornecido
  if (!id) {
    return NextResponse.json(
      { mensagem: 'O parâmetro id da transação é obrigatório.' },
      { status: 400 },
    )
  }

  try {
    // Busca a transação na UnblockPay pelo ID fornecido
    const resultado = await getTransaction(id)

    // Verifica se a transação não foi encontrada (API externa retornou 404)
    if (!resultado.success && resultado.error?.includes('404')) {
      return NextResponse.json(
        { mensagem: 'Transação não encontrada. Verifique se o ID está correto.' },
        { status: 404 },
      )
    }

    // Verifica se houve outro tipo de erro na chamada à API externa
    if (!resultado.success || !resultado.data) {
      return NextResponse.json(
        {
          mensagem: 'Não foi possível buscar a transação na UnblockPay.',
          erro: resultado.error,
        },
        { status: 500 },
      )
    }

    // Retorna os dados completos da transação com status 200
    return NextResponse.json(
      { transacao: resultado.data },
      { status: 200 },
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
