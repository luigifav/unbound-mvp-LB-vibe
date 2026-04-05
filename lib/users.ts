// Camada de persistência de usuários usando Supabase (PostgreSQL)
// Conecta o cadastro (UnblockPay) com a autenticação (NextAuth)

import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

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

// Formato retornado pelas funções de busca
export interface StoredUser {
  email: string
  hashedPassword: string
  customerId: string  // ID do cliente na UnblockPay — usado como session.user.id
  name: string
  kycApprovedEmailSent: boolean
}

/**
 * Salva um novo usuário na tabela `users` do Supabase após o cadastro
 * bem-sucedido na UnblockPay. A senha é hasheada com bcrypt antes de persistir.
 *
 * @param user Dados do novo usuário (senha em texto plano — hasheada aqui)
 */
/**
 * Busca um usuário pelo customer_id (ID na UnblockPay) na tabela `users` do Supabase.
 * Retorna null se não encontrado.
 */
export async function findUserByCustomerId(customerId: string): Promise<StoredUser | null> {
  const supabase = getSupabase()

  const { data, error } = await supabase
    .from('users')
    .select('email, hashed_password, customer_id, name, kyc_approved_email_sent')
    .eq('customer_id', customerId)
    .single()

  if (error || !data) return null

  return {
    email: data.email,
    hashedPassword: data.hashed_password,
    customerId: data.customer_id,
    name: data.name,
    kycApprovedEmailSent: data.kyc_approved_email_sent ?? false,
  }
}

/**
 * Marca que o e-mail de KYC aprovado já foi enviado para o usuário,
 * evitando reenvios em chamadas subsequentes ao endpoint de status.
 */
export async function markKycApprovedEmailSent(customerId: string): Promise<void> {
  const supabase = getSupabase()

  const { error } = await supabase
    .from('users')
    .update({ kyc_approved_email_sent: true })
    .eq('customer_id', customerId)

  if (error) {
    throw new Error(`Erro ao marcar kyc_approved_email_sent: ${error.message}`)
  }
}

export async function saveUser(user: {
  email: string
  password: string
  customerId: string
  name: string
}): Promise<void> {
  const hashedPassword = await bcrypt.hash(user.password, 10)
  const supabase = getSupabase()

  const { error } = await supabase.from('users').insert({
    email: user.email.toLowerCase(),
    hashed_password: hashedPassword,
    customer_id: user.customerId,
    name: user.name,
  })

  if (error) {
    throw new Error(`Erro ao salvar usuário: ${error.message}`)
  }
}

/**
 * Busca um usuário pelo e-mail na tabela `users` do Supabase.
 * Retorna null se não encontrado.
 *
 * @param email E-mail do usuário (normalizado para lowercase)
 */
export async function findUserByEmail(email: string): Promise<StoredUser | null> {
  const supabase = getSupabase()

  const { data, error } = await supabase
    .from('users')
    .select('email, hashed_password, customer_id, name, kyc_approved_email_sent')
    .eq('email', email.toLowerCase())
    .single()

  if (error || !data) return null

  return {
    email: data.email,
    hashedPassword: data.hashed_password,
    customerId: data.customer_id,
    name: data.name,
    kycApprovedEmailSent: data.kyc_approved_email_sent ?? false,
  }
}
