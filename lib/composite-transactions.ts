// Funções CRUD para persistência de transações compostas (fluxo unificado)
// Utiliza um arquivo JSON local como storage — adequado para MVP

import fs from 'fs/promises'
import path from 'path'
import { CompositeTransaction } from '@/types'

// Caminho absoluto para o arquivo de storage
const filePath = path.join(process.cwd(), 'data', 'composite-transactions.json')

// Lê todas as transações do arquivo JSON
async function readAll(): Promise<CompositeTransaction[]> {
  const raw = await fs.readFile(filePath, 'utf-8')
  return JSON.parse(raw) as CompositeTransaction[]
}

// Sobrescreve o arquivo JSON com o array atualizado
async function writeAll(data: CompositeTransaction[]): Promise<void> {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')
}

// Salva uma nova transação composta no arquivo JSON
export async function saveCompositeTransaction(tx: CompositeTransaction): Promise<void> {
  const all = await readAll()
  all.push(tx)
  await writeAll(all)
}

// Busca uma transação composta pelo seu id único
export async function getCompositeTransaction(id: string): Promise<CompositeTransaction | null> {
  const all = await readAll()
  return all.find((tx) => tx.id === id) ?? null
}

// Atualiza campos de uma transação existente pelo id
// Sempre atualiza o campo updatedAt com o timestamp atual
export async function updateCompositeTransaction(
  id: string,
  updates: Partial<CompositeTransaction>
): Promise<void> {
  const all = await readAll()
  const index = all.findIndex((tx) => tx.id === id)
  if (index === -1) return
  all[index] = {
    ...all[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  await writeAll(all)
}

// Busca uma transação composta pelo id do pay-in correspondente
export async function getCompositeTransactionByPayinId(
  payinId: string
): Promise<CompositeTransaction | null> {
  const all = await readAll()
  return all.find((tx) => tx.payinId === payinId) ?? null
}

// Retorna todas as transações compostas de um usuário específico
export async function listCompositeTransactionsByUser(
  userId: string
): Promise<CompositeTransaction[]> {
  const all = await readAll()
  return all.filter((tx) => tx.userId === userId)
}
