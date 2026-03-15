// POST /api/kyc/start
// Inicia a verificação KYC/KYB de um cliente na UnblockPay.

import { NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'
import { runKycCheck } from '@/lib/unblockpay'

export async function POST() {
  try {
    const session = await getServerSession()

    if (!session?.user?.id) {
      return NextResponse.json(
        { mensagem: 'Não autenticado.' },
        { status: 401 },
      )
    }

    const resultado = await runKycCheck(session.user.id)

    if (!resultado.success) {
      return NextResponse.json(
        {
          mensagem: 'Não foi possível iniciar a verificação KYC na UnblockPay.',
          erro: resultado.error,
        },
        { status: 502 },
      )
    }

    return NextResponse.json({ mensagem: 'Verificação iniciada com sucesso.' })
  } catch (err) {
    const mensagem =
      err instanceof Error ? err.message : 'Erro interno ao processar a requisição.'

    return NextResponse.json(
      { mensagem: 'Erro interno do servidor.', erro: mensagem },
      { status: 500 },
    )
  }
}
