// Funções CRUD para persistência de contas externas (PIX, SPEI, WIRE, SEPA)
// Utiliza um arquivo JSON local como storage — adequado para MVP

import fs from 'fs/promises'
import path from 'path'

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type PaymentRail = 'PIX' | 'SPEI' | 'WIRE' | 'SEPA'

export interface ExternalAccount {
  id: string
  userId: string
  rail: PaymentRail
  currency: string
  beneficiaryName: string
  // PIX
  pixKey?: string
  document?: string
  // SPEI
  bankCode?: string
  clabe?: string
  // WIRE
  routingNumber?: string
  accountNumber?: string
  bankName?: string
  // SEPA
  iban?: string
  bic?: string
  country?: string
  createdAt: string
}

// ─── Storage ──────────────────────────────────────────────────────────────────

const filePath = path.join(process.cwd(), 'data', 'external-accounts.json')

async function ensureFileExists(): Promise<void> {
  try {
    await fs.access(filePath)
  } catch {
    // Cria o diretório e arquivo caso não existam
    await fs.mkdir(path.dirname(filePath), { recursive: true })
    await fs.writeFile(filePath, '[]', 'utf-8')
  }
}

async function readAll(): Promise<ExternalAccount[]> {
  await ensureFileExists()
  const raw = await fs.readFile(filePath, 'utf-8')
  return JSON.parse(raw) as ExternalAccount[]
}

async function writeAll(data: ExternalAccount[]): Promise<void> {
  await ensureFileExists()
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')
}

// ─── Funções públicas ─────────────────────────────────────────────────────────

export async function listExternalAccountsByUser(userId: string): Promise<ExternalAccount[]> {
  const all = await readAll()
  return all.filter((acc) => acc.userId === userId)
}

export async function saveExternalAccount(account: ExternalAccount): Promise<void> {
  const all = await readAll()
  all.push(account)
  await writeAll(all)
}

export async function getExternalAccount(id: string): Promise<ExternalAccount | null> {
  const all = await readAll()
  return all.find((acc) => acc.id === id) ?? null
}

export async function deleteExternalAccount(id: string, userId: string): Promise<boolean> {
  const all = await readAll()
  const filtered = all.filter((acc) => !(acc.id === id && acc.userId === userId))
  if (filtered.length === all.length) return false
  await writeAll(filtered)
  return true
}
