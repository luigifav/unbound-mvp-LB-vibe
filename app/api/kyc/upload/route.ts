// POST /api/kyc/upload
// Faz upload de um documento KYC/KYB para a UnblockPay.

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'
import { uploadCustomerDocument } from '@/lib/unblockpay'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session?.user?.id) {
      return NextResponse.json(
        { mensagem: 'Não autenticado.' },
        { status: 401 },
      )
    }

    const customerId = session.user.id

    let formData: FormData
    try {
      formData = await request.formData()
    } catch {
      return NextResponse.json(
        { mensagem: 'A requisição deve conter um FormData válido.' },
        { status: 400 },
      )
    }

    const file = formData.get('file')
    const documentType = formData.get('document_type')
    const documentSide = formData.get('document_side')
    const country = formData.get('country')
    const beneficiaryId = formData.get('beneficiary_id')

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { mensagem: 'O campo "file" é obrigatório e deve ser um arquivo.' },
        { status: 400 },
      )
    }

    if (!documentType || typeof documentType !== 'string') {
      return NextResponse.json(
        { mensagem: 'O campo "document_type" é obrigatório.' },
        { status: 400 },
      )
    }

    const resultado = await uploadCustomerDocument(customerId, file, {
      document_type: documentType as Parameters<typeof uploadCustomerDocument>[2]['document_type'],
      document_side: typeof documentSide === 'string' ? documentSide as 'FRONT' | 'BACK' : undefined,
      country: typeof country === 'string' ? country : undefined,
      beneficiary_id: typeof beneficiaryId === 'string' ? beneficiaryId : undefined,
    })

    if (!resultado.success || !resultado.data) {
      return NextResponse.json(
        {
          mensagem: 'Não foi possível fazer upload do documento na UnblockPay.',
          erro: resultado.error,
        },
        { status: 502 },
      )
    }

    return NextResponse.json({ documentId: resultado.data.id })
  } catch (err) {
    const mensagem =
      err instanceof Error ? err.message : 'Erro interno ao processar a requisição.'

    return NextResponse.json(
      { mensagem: 'Erro interno do servidor.', erro: mensagem },
      { status: 500 },
    )
  }
}
