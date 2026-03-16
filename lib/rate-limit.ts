// Rate limiter simples em memória para o MVP.
// Armazena timestamps de requisições por chave (ex: IP).

const store = new Map<string, number[]>()

// Limpa entradas expiradas a cada 10 minutos para evitar memory leak.
const CLEANUP_INTERVAL_MS = 10 * 60 * 1000

setInterval(() => {
  const now = Date.now()
  for (const [key, timestamps] of store) {
    const valid = timestamps.filter((t) => now - t < 60 * 60 * 1000)
    if (valid.length === 0) {
      store.delete(key)
    } else {
      store.set(key, valid)
    }
  }
}, CLEANUP_INTERVAL_MS)

/**
 * Verifica se a chave (ex: endereço IP) está dentro do limite de requisições
 * para a janela de tempo especificada.
 *
 * @returns `allowed` — true se a requisição pode prosseguir; `remaining` — quantas requisições restam.
 */
export function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number,
): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const timestamps = (store.get(key) ?? []).filter((t) => now - t < windowMs)

  if (timestamps.length >= maxRequests) {
    store.set(key, timestamps)
    return { allowed: false, remaining: 0 }
  }

  timestamps.push(now)
  store.set(key, timestamps)
  return { allowed: true, remaining: maxRequests - timestamps.length }
}
