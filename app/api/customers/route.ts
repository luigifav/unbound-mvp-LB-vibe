// Rota POST /api/customers
// Cria um novo cliente na UnblockPay e, automaticamente, uma wallet para ele.

import { NextRequest, NextResponse } from 'next/server'
import { createCustomer, createWallet } from '@/lib/unblockpay'
import { saveUser } from '@/lib/users'
import { sendKycEmail } from '@/lib/email'
import { checkRateLimit } from '@/lib/rate-limit'
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
//   "tin": "12345678900",            // CPF, SSN, etc.
//   "country": "BRA",                // ISO 3166-1 alpha-3
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
//   "date_of_incorporation": "2010-05-20",
//   "email": "contato@empresa.com",
//   "phone_number": "+5511999999999",
//   "tax_id": "12345678000195",       // CNPJ, EIN, etc.
//   "country": "BRA",
//   "address": { ... },
//   "website": "https://empresa.com", // opcional
//   "no_ubos": false                  // opcional — true se não há sócios
// }
//
// Exemplo de teste com curl (substitua pela URL do seu projeto na Vercel):
// curl -X POST https://unbound-mvp.vercel.app/api/customers \
//   -H "Content-Type: application/json" \
//   -d '{
//     "type": "individual",
//     "first_name": "João",
//     "last_name": "Silva",
//     "email": "joao@exemplo.com",
//     "phone_number": "+5511999999999",
//     "date_of_birth": "1990-01-15",
//     "tin": "12345678900",
//     "country": "BRA",
//     "address": {
//       "street_line_1": "Rua das Flores, 100",
//       "city": "São Paulo",
//       "state": "SP",
//       "postal_code": "01310-100",
//       "country": "BRA"
//     }
//   }'

// Valida os campos obrigatórios do objeto address.
// Retorna a mensagem de erro ou null se válido.
function validateAddress(
  address: unknown,
  tipo: string,
): string | null {
  if (!address || typeof address !== 'object') {
    return `O campo "address" é obrigatório para clientes do tipo "${tipo}".`
  }
  const addr = address as Record<string, unknown>
  const requiredFields = ['street_line_1', 'city', 'state', 'postal_code', 'country'] as const
  for (const field of requiredFields) {
    if (!addr[field]) {
      return `O campo "address.${field}" é obrigatório para clientes do tipo "${tipo}".`
    }
  }
  return null
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting por IP — máximo 3 requisições por hora
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      request.headers.get('x-real-ip') ??
      'unknown'
    const { allowed } = checkRateLimit(ip, 3, 60 * 60 * 1000)
    if (!allowed) {
      return NextResponse.json(
        { mensagem: 'Limite de requisições excedido. Tente novamente mais tarde.' },
        { status: 429 },
      )
    }

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
      if (!body.phone_number) {
        return NextResponse.json(
          { mensagem: 'O campo "phone_number" é obrigatório para clientes do tipo "individual".' },
          { status: 400 },
        )
      }
      if (!body.date_of_birth) {
        return NextResponse.json(
          { mensagem: 'O campo "date_of_birth" é obrigatório para clientes do tipo "individual" (formato YYYY-MM-DD).' },
          { status: 400 },
        )
      }
      if (!body.tin) {
        return NextResponse.json(
          { mensagem: 'O campo "tin" é obrigatório para clientes do tipo "individual".' },
          { status: 400 },
        )
      }
      if (!body.country) {
        return NextResponse.json(
          { mensagem: 'O campo "country" é obrigatório para clientes do tipo "individual" (código ISO de 3 letras).' },
          { status: 400 },
        )
      }
      const individualAddressError = validateAddress(body.address, 'individual')
      if (individualAddressError) {
        return NextResponse.json(
          { mensagem: individualAddressError },
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
      if (!body.date_of_incorporation) {
        return NextResponse.json(
          { mensagem: 'O campo "date_of_incorporation" é obrigatório para clientes do tipo "business" (formato YYYY-MM-DD).' },
          { status: 400 },
        )
      }
      if (!body.phone_number) {
        return NextResponse.json(
          { mensagem: 'O campo "phone_number" é obrigatório para clientes do tipo "business".' },
          { status: 400 },
        )
      }
      if (!body.tax_id) {
        return NextResponse.json(
          { mensagem: 'O campo "tax_id" é obrigatório para clientes do tipo "business".' },
          { status: 400 },
        )
      }
      if (!body.country) {
        return NextResponse.json(
          { mensagem: 'O campo "country" é obrigatório para clientes do tipo "business" (código ISO de 3 letras).' },
          { status: 400 },
        )
      }
      const businessAddressError = validateAddress(body.address, 'business')
      if (businessAddressError) {
        return NextResponse.json(
          { mensagem: businessAddressError },
          { status: 400 },
        )
      }
    } else {
      return NextResponse.json(
        { mensagem: 'O campo "type" deve ser "individual" ou "business".' },
        { status: 400 },
      )
    }

    // Extrai a senha em texto plano (não enviada à UnblockPay — apenas para auth local)
    const rawPassword = typeof body.password === 'string' ? body.password : null

    // Extrai as configurações opcionais da wallet antes de montar os dados do cliente
    const walletName = typeof body.wallet_name === 'string' ? body.wallet_name : 'Principal'
    const walletBlockchain = typeof body.wallet_blockchain === 'string' ? body.wallet_blockchain : 'solana'

    // Remove os campos extras (wallet config + senha) antes de enviar para a API de clientes
    const { wallet_name: _wn, wallet_blockchain: _wb, password: _pw, ...customerPayload } = body

    console.log('[POST /api/customers] Enviando para UnblockPay:', JSON.stringify({
      ...customerPayload,
      tin: customerPayload.tin ? '***REDACTED***' : undefined,
      tax_id: customerPayload.tax_id ? '***REDACTED***' : undefined,
    }))

    // Chama a API da UnblockPay para criar o cliente
    const customerResult = await createCustomer(customerPayload as unknown as CreateCustomerData)

    if (!customerResult.success || !customerResult.data) {
      console.error('[POST /api/customers] Falha ao criar cliente:', customerResult.error)
      // Se o erro veio de falha de autenticação (API key inválida), retorna 503
      const isAuthError = customerResult.error?.includes('401')
      return NextResponse.json(
        {
          mensagem: isAuthError
            ? 'Serviço temporariamente indisponível. A integração com a UnblockPay precisa ser reconfigurada.'
            : 'Não foi possível criar o cliente na UnblockPay.',
          erro: customerResult.error,
        },
        { status: isAuthError ? 503 : 502 },
      )
    }

    const customer = customerResult.data

    // Dispara o email com o link de KYC imediatamente após o cliente ser criado na UnblockPay.
    // Feito aqui (antes de createWallet/saveUser) para garantir que o email seja enviado
    // mesmo nos casos de falha parcial (207 de wallet, 500 de saveUser, etc.).
    const kycVerificationLink = customer.verification?.verification_link
    if (kycVerificationLink && customer.email) {
      const kycFirstName = typeof body.first_name === 'string' ? body.first_name : ''
      sendKycEmail({
        to: customer.email,
        name: kycFirstName || customer.email,
        verificationLink: kycVerificationLink,
      })
        .then(() => {
          console.log(`[POST /api/customers] Email KYC enviado com sucesso para ${customer.email}`)
        })
        .catch((err) => {
          console.error('[POST /api/customers] Falha ao enviar email de KYC:', err)
        })
    }

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

    // Salva as credenciais do usuário para possibilitar o login
    if (rawPassword) {
      const firstName = typeof body.first_name === 'string' ? body.first_name : ''
      const lastName = typeof body.last_name === 'string' ? body.last_name : ''
      try {
        await saveUser({
          email: customer.email,
          password: rawPassword,
          customerId: customer.id,
          name: `${firstName} ${lastName}`.trim() || customer.email,
        })
      } catch (saveErr) {
        // Conta criada na UnblockPay mas credenciais não salvas — informa o usuário
        const saveMsg = saveErr instanceof Error ? saveErr.message : 'Erro desconhecido'
        return NextResponse.json(
          {
            mensagem: 'Conta criada na UnblockPay, mas não foi possível salvar as credenciais de login.',
            erro: saveMsg,
            customer,
            wallet,
          },
          { status: 500 },
        )
      }
    }

    // Retorna os dados completos do cliente e da wallet criados
    return NextResponse.json(
      { customer, wallet, verificationLink: kycVerificationLink ?? null },
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
