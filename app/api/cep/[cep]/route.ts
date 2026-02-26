// Rota GET /api/cep/[cep]
// Busca o endereço completo de um CEP brasileiro usando a API pública ViaCEP.
// Nenhuma chave de API é necessária.

import { NextRequest, NextResponse } from 'next/server'
import type { Address } from '@/types'

// URL base da API ViaCEP — serviço público gratuito de consulta de CEPs do Brasil
const VIA_CEP_BASE_URL = 'https://viacep.com.br/ws'

// Formato de resposta da ViaCEP
interface ViaCepResponse {
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  localidade: string
  uf: string
  erro?: boolean
}

// ---------------------------------------------------------------------------
// GET /api/cep/[cep]
// ---------------------------------------------------------------------------
// Parâmetro de rota:
//   cep — CEP brasileiro (somente dígitos ou com traço, ex: "01310100" ou "01310-100")
//
// Retorna:
// {
//   "cep": "01310-100",
//   "logradouro": "Avenida Paulista",
//   "bairro": "Bela Vista",
//   "cidade": "São Paulo",
//   "estado": "SP",
//   "address": { ... }   ← já no formato Address do projeto
// }
//
// Exemplo de teste com curl:
// curl http://localhost:3000/api/cep/01310100
// curl http://localhost:3000/api/cep/01310-100

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ cep: string }> },
) {
  const { cep: cepRaw } = await params

  // Remove hífen e espaços do CEP para normalizar antes de validar
  const cep = cepRaw.replace(/\D/g, '')

  // Valida se o CEP tem exatamente 8 dígitos numéricos
  if (cep.length !== 8) {
    return NextResponse.json(
      { mensagem: 'CEP inválido. Informe apenas os 8 dígitos numéricos (ex: 01310100).' },
      { status: 400 },
    )
  }

  try {
    // Consulta a API pública ViaCEP
    const response = await fetch(`${VIA_CEP_BASE_URL}/${cep}/json/`, {
      // Desativa cache para sempre retornar dados atualizados
      next: { revalidate: 0 },
    })

    if (!response.ok) {
      return NextResponse.json(
        { mensagem: 'Não foi possível consultar o CEP. Tente novamente em instantes.' },
        { status: 502 },
      )
    }

    const data: ViaCepResponse = await response.json()

    // A ViaCEP retorna { "erro": true } quando o CEP não é encontrado
    if (data.erro) {
      return NextResponse.json(
        { mensagem: 'CEP não encontrado. Verifique se o número está correto.' },
        { status: 404 },
      )
    }

    // Monta o endereço no formato Address já usado pelo projeto (types/index.ts)
    const address: Omit<Address, 'street_line_2'> & { street_line_2?: string } = {
      street_line_1: data.logradouro || '',
      street_line_2: data.complemento || undefined,
      city: data.localidade,
      state: data.uf,
      postal_code: data.cep,
      country: 'BRA', // CEPs são exclusivamente brasileiros
    }

    // Retorna os dados no formato amigável com o address já pronto para uso
    return NextResponse.json({
      cep: data.cep,
      logradouro: data.logradouro,
      bairro: data.bairro,
      cidade: data.localidade,
      estado: data.uf,
      address,
    })
  } catch (err) {
    // Captura erros de rede ou problemas inesperados
    const mensagem =
      err instanceof Error ? err.message : 'Erro desconhecido ao consultar o CEP.'

    return NextResponse.json(
      { mensagem: 'Erro interno do servidor ao consultar o CEP.', erro: mensagem },
      { status: 500 },
    )
  }
}
