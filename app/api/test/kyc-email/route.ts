// APENAS PARA DESENVOLVIMENTO — retorna 404 em produção
// Use para validar o envio do email KYC sem criar uma conta real na UnblockPay.
//
// Exemplo de uso:
//   curl -X POST http://localhost:3000/api/test/kyc-email \
//     -H "Content-Type: application/json" \
//     -d '{"to":"seu@email.com","name":"João"}'

import { NextRequest, NextResponse } from 'next/server'
import { sendKycEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  let body: { to?: string; name?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido.' }, { status: 400 })
  }

  const { to, name } = body

  if (!to || !name) {
    return NextResponse.json(
      { error: 'Campos obrigatórios: to (email), name (nome do usuário).' },
      { status: 400 },
    )
  }

  await sendKycEmail({
    to,
    name,
    verificationLink: 'https://kyc.example.com/verify?token=TEST_TOKEN_123',
  })

  return NextResponse.json({ ok: true, message: `Email enviado para ${to}` })
}
