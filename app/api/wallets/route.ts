// Rotas GET e POST /api/wallets
// GET  — Lista as wallets de um cliente existente na UnblockPay.
// POST — Cria uma nova wallet de stablecoin para um cliente já existente na UnblockPay.

import { NextRequest, NextResponse } from 'next/server'
import { createWallet, getWallets } from '@/lib/unblockpay'
import { getServerSession } from '@/lib/auth'
import type { CreateWalletData } from '@/types'

// ---------------------------------------------------------------------------
// GET /api/wallets?customerId=uuid
// ---------------------------------------------------------------------------
// Retorna todas as wallets de um cliente.
//
// Parâmetros de query:
//   customerId (obrigatório) — UUID do cliente na UnblockPay
//
// Exemplo de teste com curl:
// curl "https://unbound-mvp.vercel.app/api/wallets?customerId=uuid-do-customer"

export async function GET(request: NextRequest) {
  const session = await getServerSession()

  if (!session?.user?.id) {
    return NextResponse.json(
      { mensagem: 'Não autenticado.' },
      { status: 401 },
    )
  }

  // customerId é sempre extraído da sessão — ignora qualquer query string
  const customerId = session.user.id

  try {
    const resultado = await getWallets(customerId)

    if (!resultado.success || !resultado.data) {
      return NextResponse.json(
        {
          mensagem: 'Não foi possível buscar as wallets na UnblockPay.',
          erro: resultado.error,
        },
        { status: 502 },
      )
    }

    return NextResponse.json({ wallets: resultado.data })
  } catch (err) {
    const mensagem =
      err instanceof Error ? err.message : 'Erro interno ao processar a requisição.'

    return NextResponse.json(
      { mensagem: 'Erro interno do servidor.', erro: mensagem },
      { status: 500 },
    )
  }
}

// ---------------------------------------------------------------------------
// POST /api/wallets
// ---------------------------------------------------------------------------
// Corpo esperado:
// {
//   "customerId": "uuid-do-customer",   // obrigatório
//   "name": "Carteira Principal",       // opcional — padrão: "Principal"
//   "blockchain": "solana"              // opcional — padrão: "solana"
//                                       // valores aceitos: "solana", "ethereum", "polygon"
// }
//
// Exemplo de teste com curl (substitua pela URL do seu projeto na Vercel):
// curl -X POST https://unbound-mvp.vercel.app/api/wallets \
//   -H "Content-Type: application/json" \
//   -d '{
//     "customerId": "uuid-do-customer-aqui",
//     "name": "Carteira Principal",
//     "blockchain": "solana"
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

    // Define os dados da wallet com valores padrão para campos opcionais
    const walletData: CreateWalletData = {
      name: typeof body.name === 'string' && body.name.trim() ? body.name.trim() : 'Principal',
      blockchain: typeof body.blockchain === 'string'
        ? (body.blockchain as CreateWalletData['blockchain'])
        : 'solana',
    }

    // Chama a API da UnblockPay para criar a wallet
    const walletResult = await createWallet(customerId, walletData)

    if (!walletResult.success || !walletResult.data) {
      return NextResponse.json(
        {
          mensagem: 'Não foi possível criar a wallet na UnblockPay.',
          erro: walletResult.error,
        },
        { status: 502 },
      )
    }

    // Retorna os dados da wallet criada
    return NextResponse.json(
      { wallet: walletResult.data },
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
