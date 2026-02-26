// Rota POST /api/customers
// Cria um novo cliente na UnblockPay e, automaticamente, uma wallet para ele.

import { NextRequest, NextResponse } from 'next/server'
import { createCustomer, createWallet } from '@/lib/unblockpay'
import type { CreateCustomerData, CreateWalletData } from '@/types'

// ---------------------------------------------------------------------------
// POST /api/customers
// ---------------------------------------------------------------------------
// Corpo esperado (pessoa física):
// {
//   "type": "individual",
//   "first_name": "João",
//   "last_name": "Silva",
//   "email": "joao@exemplo.com",
//   "phone_number": "+5511999999999",
//   "date_of_birth": "1990-01-15",
//   "identity_documents": [{ "type": "tax_id", "value": "123.456.789-00", "country": "BRA" }],
//   "address": {
//     "street_line_1": "Rua das Flores, 100",
//     "city": "São Paulo",
//     "state": "SP",
//     "postal_code": "01310-100",
//     "country": "BRA"
//   },
//   "wallet_name": "Principal",       // opcional — padrão: "Principal"
//   "wallet_blockchain": "solana"     // opcional — padrão: "solana"
// }
//
// Corpo esperado (pessoa jurídica):
// {
//   "type": "business",
//   "business_legal_name": "Empresa LTDA",
//   "email": "contato@empresa.com",
//   "phone_number": "+5511999999999",
//   "identity_documents": [...],
//   "address": { ... }
// }
//
// Exemplo de teste com curl:
// curl -X POST http://localhost:3000/api/customers \
//   -H "Content-Type: application/json" \
//   -d '{
//     "type": "individual",
//     "first_name": "João",
//     "last_name": "Silva",
//     "email": "joao@exemplo.com",
//     "phone_number": "+5511999999999",
//     "date_of_birth": "1990-01-15",
//     "identity_documents": [{ "type": "tax_id", "value": "12345678900", "country": "BRA" }],
//     "address": {
//       "street_line_1": "Rua das Flores, 100",
//       "city": "São Paulo",
//       "state": "SP",
//       "postal_code": "01310-100",
//       "country": "BRA"
//     }
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

    // Valida campos obrigatórios comuns a qualquer tipo de cliente
    if (!body.type) {
      return NextResponse.json(
        { mensagem: 'O campo "type" é obrigatório. Use "individual" ou "business".' },
        { status: 400 },
      )
    }

    if (!body.email) {
      return NextResponse.json(
        { mensagem: 'O campo "email" é obrigatório.' },
        { status: 400 },
      )
    }

    // Valida campos específicos de acordo com o tipo de cliente
    if (body.type === 'individual') {
      if (!body.first_name || !body.last_name) {
        return NextResponse.json(
          { mensagem: 'Para clientes do tipo "individual", os campos "first_name" e "last_name" são obrigatórios.' },
          { status: 400 },
        )
      }
    } else if (body.type === 'business') {
      if (!body.business_legal_name) {
        return NextResponse.json(
          { mensagem: 'Para clientes do tipo "business", o campo "business_legal_name" é obrigatório.' },
          { status: 400 },
        )
      }
    } else {
      return NextResponse.json(
        { mensagem: 'O campo "type" deve ser "individual" ou "business".' },
        { status: 400 },
      )
    }

    // Extrai as configurações opcionais da wallet antes de montar os dados do cliente
    const walletName = typeof body.wallet_name === 'string' ? body.wallet_name : 'Principal'
    const walletBlockchain = typeof body.wallet_blockchain === 'string' ? body.wallet_blockchain : 'solana'

    // Remove os campos extras da wallet antes de enviar para a API de clientes
    const { wallet_name: _wn, wallet_blockchain: _wb, ...customerPayload } = body

    // Chama a API da UnblockPay para criar o cliente
    const customerResult = await createCustomer(customerPayload as CreateCustomerData)

    if (!customerResult.success || !customerResult.data) {
      return NextResponse.json(
        {
          mensagem: 'Não foi possível criar o cliente na UnblockPay.',
          erro: customerResult.error,
        },
        { status: 502 },
      )
    }

    const customer = customerResult.data

    // Com o cliente criado, cria automaticamente uma wallet para ele
    const walletData: CreateWalletData = {
      name: walletName,
      blockchain: walletBlockchain as CreateWalletData['blockchain'],
    }

    const walletResult = await createWallet(customer.id, walletData)

    if (!walletResult.success || !walletResult.data) {
      // O cliente foi criado mas a wallet falhou — retorna 207 (Multi-Status)
      // indicando sucesso parcial, junto com os dados do cliente e o erro da wallet
      return NextResponse.json(
        {
          mensagem: 'Cliente criado, mas houve uma falha ao criar a wallet automaticamente.',
          customer,
          wallet: null,
          erro_wallet: walletResult.error,
        },
        { status: 207 },
      )
    }

    const wallet = walletResult.data

    // Retorna os dados completos do cliente e da wallet criados
    return NextResponse.json(
      { customer, wallet },
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
