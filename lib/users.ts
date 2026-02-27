// Camada de persistência de usuários usando Vercel KV (Redis)
// Conecta o cadastro (UnblockPay) com a autenticação (NextAuth)

import { kv } from '@vercel/kv'
import bcrypt from 'bcryptjs'

// Formato do registro salvo no KV
export interface StoredUser {
  email: string
  hashedPassword: string
  customerId: string  // ID do cliente na UnblockPay — usado como session.user.id
  name: string
}

/**
 * Salva um novo usuário no KV após o cadastro bem-sucedido na UnblockPay.
 * A senha é hasheada com bcrypt antes de persistir.
 *
 * @param user Dados do novo usuário (senha em texto plano — será hasheada aqui)
 */
export async function saveUser(user: {
  email: string
  password: string
  customerId: string
  name: string
}): Promise<void> {
  const hashedPassword = await bcrypt.hash(user.password, 10)

  const record: StoredUser = {
    email: user.email,
    hashedPassword,
    customerId: user.customerId,
    name: user.name,
  }

  // Chave no Redis: "user:{email}"
  await kv.set(`user:${user.email.toLowerCase()}`, record)
}

/**
 * Busca um usuário pelo e-mail.
 * Retorna null se não encontrado.
 *
 * @param email E-mail do usuário (normalizado para lowercase)
 */
export async function findUserByEmail(email: string): Promise<StoredUser | null> {
  return kv.get<StoredUser>(`user:${email.toLowerCase()}`)
}
