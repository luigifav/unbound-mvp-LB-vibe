// API Routes para gerenciamento de contas externas (PIX, SPEI, WIRE, SEPA)
// GET  — Lista todas as contas externas do usuário autenticado
// POST — Cria uma nova conta externa

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import {
  listExternalAccountsByUser,
  saveExternalAccount,
  type ExternalAccount,
  type PaymentRail,
} from '@/lib/external-accounts'
import { randomUUID } from 'crypto'

// ─── GET /api/external-accounts ──────────────────────────────────────────────

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ mensagem: 'Não autenticado.' }, { status: 401 })
  }

  const accounts = await listExternalAccountsByUser(session.user.id)
  return NextResponse.json({ accounts })
}

// ─── POST /api/external-accounts ─────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ mensagem: 'Não autenticado.' }, { status: 401 })
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { mensagem: 'O corpo da requisição deve ser um JSON válido.' },
      { status: 400 },
    )
  }

  const rail = body.rail as PaymentRail
  const beneficiaryName = body.beneficiaryName as string

  if (!rail || !['PIX', 'SPEI', 'WIRE', 'SEPA'].includes(rail)) {
    return NextResponse.json(
      { mensagem: 'Campo "rail" inválido. Use: PIX, SPEI, WIRE ou SEPA.' },
      { status: 400 },
    )
  }
  if (!beneficiaryName?.trim()) {
    return NextResponse.json(
      { mensagem: 'Campo "beneficiaryName" é obrigatório.' },
      { status: 400 },
    )
  }

  // Validação específica por rail
  if (rail === 'PIX') {
    if (!body.pixKey) {
      return NextResponse.json({ mensagem: 'Campo "pixKey" é obrigatório para PIX.' }, { status: 400 })
    }
    if (!body.document) {
      return NextResponse.json({ mensagem: 'Campo "document" é obrigatório para PIX.' }, { status: 400 })
    }
  } else if (rail === 'SPEI') {
    if (!body.clabe) {
      return NextResponse.json({ mensagem: 'Campo "clabe" é obrigatório para SPEI.' }, { status: 400 })
    }
  } else if (rail === 'WIRE') {
    if (!body.routingNumber || !body.accountNumber) {
      return NextResponse.json(
        { mensagem: 'Campos "routingNumber" e "accountNumber" são obrigatórios para WIRE.' },
        { status: 400 },
      )
    }
  } else if (rail === 'SEPA') {
    if (!body.iban || !body.bic) {
      return NextResponse.json(
        { mensagem: 'Campos "iban" e "bic" são obrigatórios para SEPA.' },
        { status: 400 },
      )
    }
  }

  const currencyByRail: Record<PaymentRail, string> = {
    PIX: 'BRL',
    SPEI: 'MXN',
    WIRE: 'USD',
    SEPA: 'EUR',
  }

  const newAccount: ExternalAccount = {
    id: randomUUID(),
    userId: session.user.id,
    rail,
    currency: currencyByRail[rail],
    beneficiaryName: beneficiaryName.trim(),
    pixKey: typeof body.pixKey === 'string' ? body.pixKey : undefined,
    document: typeof body.document === 'string' ? body.document : undefined,
    bankCode: typeof body.bankCode === 'string' ? body.bankCode : undefined,
    clabe: typeof body.clabe === 'string' ? body.clabe : undefined,
    routingNumber: typeof body.routingNumber === 'string' ? body.routingNumber : undefined,
    accountNumber: typeof body.accountNumber === 'string' ? body.accountNumber : undefined,
    bankName: typeof body.bankName === 'string' ? body.bankName : undefined,
    iban: typeof body.iban === 'string' ? body.iban : undefined,
    bic: typeof body.bic === 'string' ? body.bic : undefined,
    country: typeof body.country === 'string' ? body.country : undefined,
    createdAt: new Date().toISOString(),
  }

  await saveExternalAccount(newAccount)

  return NextResponse.json({ account: newAccount }, { status: 201 })
}
