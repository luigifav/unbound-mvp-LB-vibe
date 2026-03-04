/*
 * Rodar no Supabase Studio > SQL Editor antes de fazer deploy:
 *
 * create table if not exists external_accounts (
 *   id               text primary key,
 *   user_id          text not null,
 *   rail             text not null,
 *   currency         text not null,
 *   beneficiary_name text not null,
 *   pix_key          text,
 *   document         text,
 *   bank_code        text,
 *   clabe            text,
 *   routing_number   text,
 *   account_number   text,
 *   bank_name        text,
 *   iban             text,
 *   bic              text,
 *   country          text,
 *   created_at       timestamptz not null
 * );
 * create index if not exists idx_external_accounts_user_id on external_accounts(user_id);
 */

// Funções CRUD para persistência de contas externas (PIX, SPEI, WIRE, SEPA)
// Utiliza Supabase (PostgreSQL) como storage

import { createClient } from '@supabase/supabase-js'

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

// ─── Supabase ─────────────────────────────────────────────────────────────────

// Cliente Supabase — instanciado sob demanda para evitar erros em build time
function getSupabase() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error(
      'Variáveis SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY não configuradas. ' +
        'Adicione-as no painel do Vercel ou no arquivo .env.local.',
    )
  }

  return createClient(url, key)
}

// Mapeia um ExternalAccount (camelCase) para uma linha do banco (snake_case)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toRow(account: ExternalAccount): Record<string, any> {
  return {
    id: account.id,
    user_id: account.userId,
    rail: account.rail,
    currency: account.currency,
    beneficiary_name: account.beneficiaryName,
    pix_key: account.pixKey,
    document: account.document,
    bank_code: account.bankCode,
    clabe: account.clabe,
    routing_number: account.routingNumber,
    account_number: account.accountNumber,
    bank_name: account.bankName,
    iban: account.iban,
    bic: account.bic,
    country: account.country,
    created_at: account.createdAt,
  }
}

// Mapeia uma linha do banco (snake_case) para um ExternalAccount (camelCase)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fromRow(row: Record<string, any>): ExternalAccount {
  return {
    id: row.id,
    userId: row.user_id,
    rail: row.rail,
    currency: row.currency,
    beneficiaryName: row.beneficiary_name,
    pixKey: row.pix_key ?? undefined,
    document: row.document ?? undefined,
    bankCode: row.bank_code ?? undefined,
    clabe: row.clabe ?? undefined,
    routingNumber: row.routing_number ?? undefined,
    accountNumber: row.account_number ?? undefined,
    bankName: row.bank_name ?? undefined,
    iban: row.iban ?? undefined,
    bic: row.bic ?? undefined,
    country: row.country ?? undefined,
    createdAt: row.created_at,
  }
}

// ─── Funções públicas ─────────────────────────────────────────────────────────

export async function listExternalAccountsByUser(userId: string): Promise<ExternalAccount[]> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('external_accounts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(`Erro ao listar contas do usuário: ${error.message}`)

  return (data ?? []).map(fromRow)
}

export async function saveExternalAccount(account: ExternalAccount): Promise<void> {
  const supabase = getSupabase()
  const { error } = await supabase.from('external_accounts').insert(toRow(account))
  if (error) throw new Error(`Erro ao salvar conta externa: ${error.message}`)
}

export async function getExternalAccount(id: string): Promise<ExternalAccount | null> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('external_accounts')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw new Error(`Erro ao buscar conta externa: ${error.message}`)
  }

  return data ? fromRow(data) : null
}

export async function deleteExternalAccount(id: string, userId: string): Promise<boolean> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('external_accounts')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)
    .select('id')

  if (error) throw new Error(`Erro ao deletar conta externa: ${error.message}`)

  return (data ?? []).length > 0
}
