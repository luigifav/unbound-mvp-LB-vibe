// Rota POST /api/wallets
// Cria uma nova wallet de stablecoin para um cliente já existente na UnblockPay.

import { NextRequest, NextResponse } from 'next/server'
import { createWallet } from '@/lib/unblockpay'
import type { CreateWalletData } from '@/types'

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
// Exemplo de teste com curl:
// curl -X POST http://localhost:3000/api/wallets \
//   -H "Content-Type: application/json" \
//   -d '{
//     "customerId": "uuid-do-customer-aqui",
//     "name": "Carteira Principal",
//     "blockchain": "solana"
//   }'

export async function POST(request: NextRequest) {
  try {
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

    // Valida se o customerId foi enviado
    if (!body.customerId || typeof body.customerId !== 'string') {
      return NextResponse.json(
        { mensagem: 'O campo "customerId" é obrigatório.' },
        { status: 400 },
      )
    }

    const customerId = body.customerId

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
