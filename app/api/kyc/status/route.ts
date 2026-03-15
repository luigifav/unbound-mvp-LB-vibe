// GET /api/kyc/status
// Retorna os detalhes da verificação KYC/KYB de um cliente.

import { NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'
import { getVerificationDetails } from '@/lib/unblockpay'

export async function GET() {
  try {
    const session = await getServerSession()

    if (!session?.user?.id) {
      return NextResponse.json(
        { mensagem: 'Não autenticado.' },
        { status: 401 },
      )
    }

    const resultado = await getVerificationDetails(session.user.id)

    if (!resultado.success || !resultado.data) {
      return NextResponse.json(
        {
          mensagem: 'Não foi possível consultar o status da verificação na UnblockPay.',
          erro: resultado.error,
        },
        { status: 502 },
      )
    }

    return NextResponse.json(resultado.data)
  } catch (err) {
    const mensagem =
      err instanceof Error ? err.message : 'Erro interno ao processar a requisição.'

    return NextResponse.json(
      { mensagem: 'Erro interno do servidor.', erro: mensagem },
      { status: 500 },
    )
  }
}
