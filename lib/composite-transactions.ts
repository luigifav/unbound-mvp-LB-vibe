/*
 * Rodar no Supabase Studio > SQL Editor antes de fazer deploy:
 *
 * create table if not exists composite_transactions (
 *   id                            text primary key,
 *   user_id                       text not null,
 *   payin_id                      text not null unique,
 *   payout_id                     text unique,
 *   status                        text not null,
 *   amount                        numeric not null,
 *   sender_currency               text not null,
 *   receiver_currency             text not null,
 *   recipient_name                text not null,
 *   recipient_pix_key             text,
 *   recipient_external_account_id text,
 *   deposit_instructions          jsonb,
 *   quote_rate                    text,
 *   error_message                 text,
 *   created_at                    timestamptz not null,
 *   updated_at                    timestamptz not null
 * );
 * create index if not exists idx_composite_transactions_user_id   on composite_transactions(user_id);
 * create index if not exists idx_composite_transactions_payin_id  on composite_transactions(payin_id);
 * create index if not exists idx_composite_transactions_payout_id on composite_transactions(payout_id);
 */

// Funções CRUD para persistência de transações compostas (fluxo unificado)
// Utiliza Supabase (PostgreSQL) como storage

import { createClient } from '@supabase/supabase-js'
import { CompositeTransaction } from '@/types'

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

// Mapeia um objeto CompositeTransaction (camelCase) para uma linha do banco (snake_case)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toRow(tx: CompositeTransaction): Record<string, any> {
  return {
    id: tx.id,
    user_id: tx.userId,
    payin_id: tx.payinId,
    payout_id: tx.payoutId,
    status: tx.status,
    amount: tx.amount,
    sender_currency: tx.senderCurrency,
    receiver_currency: tx.receiverCurrency,
    recipient_name: tx.recipientName,
    recipient_pix_key: tx.recipientPixKey,
    recipient_external_account_id: tx.recipientExternalAccountId,
    deposit_instructions: tx.depositInstructions,
    quote_rate: tx.quoteRate,
    error_message: tx.errorMessage,
    created_at: tx.createdAt,
    updated_at: tx.updatedAt,
  }
}

// Mapeia uma linha do banco (snake_case) para um objeto CompositeTransaction (camelCase)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fromRow(row: Record<string, any>): CompositeTransaction {
  return {
    id: row.id,
    userId: row.user_id,
    payinId: row.payin_id,
    payoutId: row.payout_id ?? undefined,
    status: row.status,
    amount: Number(row.amount),
    senderCurrency: row.sender_currency,
    receiverCurrency: row.receiver_currency,
    recipientName: row.recipient_name,
    recipientPixKey: row.recipient_pix_key ?? undefined,
    recipientExternalAccountId: row.recipient_external_account_id ?? undefined,
    depositInstructions: row.deposit_instructions ?? undefined,
    quoteRate: row.quote_rate ?? undefined,
    errorMessage: row.error_message ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

// Salva uma nova transação composta no Supabase
export async function saveCompositeTransaction(tx: CompositeTransaction): Promise<void> {
  const supabase = getSupabase()
  const { error } = await supabase.from('composite_transactions').insert(toRow(tx))
  if (error) throw new Error(`Erro ao salvar transação: ${error.message}`)
}

// Busca uma transação composta pelo seu id único
export async function getCompositeTransaction(id: string): Promise<CompositeTransaction | null> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('composite_transactions')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw new Error(`Erro ao buscar transação: ${error.message}`)
  }

  return data ? fromRow(data) : null
}

// Atualiza campos de uma transação existente pelo id
// Sempre atualiza o campo updated_at com o timestamp atual
export async function updateCompositeTransaction(
  id: string,
  updates: Partial<CompositeTransaction>
): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rowUpdates: Record<string, any> = { updated_at: new Date().toISOString() }

  if (updates.userId !== undefined)                     rowUpdates.user_id = updates.userId
  if (updates.payinId !== undefined)                    rowUpdates.payin_id = updates.payinId
  if (updates.payoutId !== undefined)                   rowUpdates.payout_id = updates.payoutId
  if (updates.status !== undefined)                     rowUpdates.status = updates.status
  if (updates.amount !== undefined)                     rowUpdates.amount = updates.amount
  if (updates.senderCurrency !== undefined)             rowUpdates.sender_currency = updates.senderCurrency
  if (updates.receiverCurrency !== undefined)           rowUpdates.receiver_currency = updates.receiverCurrency
  if (updates.recipientName !== undefined)              rowUpdates.recipient_name = updates.recipientName
  if (updates.recipientPixKey !== undefined)            rowUpdates.recipient_pix_key = updates.recipientPixKey
  if (updates.recipientExternalAccountId !== undefined) rowUpdates.recipient_external_account_id = updates.recipientExternalAccountId
  if (updates.depositInstructions !== undefined)        rowUpdates.deposit_instructions = updates.depositInstructions
  if (updates.quoteRate !== undefined)                  rowUpdates.quote_rate = updates.quoteRate
  if (updates.errorMessage !== undefined)               rowUpdates.error_message = updates.errorMessage

  const supabase = getSupabase()
  const { error } = await supabase
    .from('composite_transactions')
    .update(rowUpdates)
    .eq('id', id)

  if (error) throw new Error(`Erro ao atualizar transação: ${error.message}`)
}

// Busca uma transação composta pelo id do pay-in correspondente
export async function getCompositeTransactionByPayinId(
  payinId: string
): Promise<CompositeTransaction | null> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('composite_transactions')
    .select('*')
    .eq('payin_id', payinId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw new Error(`Erro ao buscar transação por payin_id: ${error.message}`)
  }

  return data ? fromRow(data) : null
}

// Busca uma transação composta pelo id do payout correspondente
export async function getCompositeTransactionByPayoutId(
  payoutId: string
): Promise<CompositeTransaction | null> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('composite_transactions')
    .select('*')
    .eq('payout_id', payoutId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw new Error(`Erro ao buscar transação por payout_id: ${error.message}`)
  }

  return data ? fromRow(data) : null
}

// Retorna todas as transações compostas de um usuário específico
export async function listCompositeTransactionsByUser(
  userId: string
): Promise<CompositeTransaction[]> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('composite_transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(`Erro ao listar transações do usuário: ${error.message}`)

  return (data ?? []).map(fromRow)
}
