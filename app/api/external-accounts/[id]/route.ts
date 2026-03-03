// DELETE /api/external-accounts/[id] — Remove uma conta externa do usuário

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { deleteExternalAccount } from '@/lib/external-accounts'

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ mensagem: 'Não autenticado.' }, { status: 401 })
  }

  const { id } = await params
  const deleted = await deleteExternalAccount(id, session.user.id)
  if (!deleted) {
    return NextResponse.json(
      { mensagem: 'Conta não encontrada ou sem permissão para excluir.' },
      { status: 404 },
    )
  }

  return NextResponse.json({ mensagem: 'Conta excluída com sucesso.' })
}
