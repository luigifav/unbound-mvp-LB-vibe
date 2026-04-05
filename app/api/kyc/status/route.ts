// GET /api/kyc/status
// Retorna os detalhes da verificação KYC/KYB de um cliente.

import { NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'
import { getVerificationDetails } from '@/lib/unblockpay'
import { findUserByCustomerId, markKycApprovedEmailSent } from '@/lib/users'
import { sendKycApprovedEmail } from '@/lib/email'

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

    // Dispara e-mail de conta aprovada na primeira vez que o status "approved" é detectado
    if (resultado.data.customer_status === 'approved') {
      const user = await findUserByCustomerId(session.user.id)
      if (user && !user.kycApprovedEmailSent) {
        await markKycApprovedEmailSent(session.user.id)
        sendKycApprovedEmail({ to: user.email, name: user.name }).catch((err) =>
          console.error('[KYC Status] Falha ao enviar e-mail de KYC aprovado:', err),
        )
      }
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
