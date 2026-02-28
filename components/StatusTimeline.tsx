// Componente StatusTimeline: exibe o progresso de uma transação composta como linha do tempo visual

import React from 'react';
import { CompositeTransactionStatus } from '@/types';

// ─── Tipos ────────────────────────────────────────────────────────────────────

/** Estado visual de cada etapa da timeline */
type StepState = 'pending' | 'active' | 'completed';

interface StatusTimelineProps {
  status: CompositeTransactionStatus;
  recipientName: string;
  senderCurrency: string;
  receiverCurrency: string;
  amount: number;
}

interface Step {
  label: string;
  state: StepState;
}

// ─── Lógica de estado ─────────────────────────────────────────────────────────

/**
 * Calcula o estado de cada uma das 4 etapas com base no status da transação.
 *
 * Regras de ativação (a etapa passa de 'pending' para 'active' ou 'completed'):
 *   Etapa 1 "Pix recebido"      → status !== 'pending_deposit'
 *   Etapa 2 "Convertendo valor" → status ∈ { converting, sending, completed }
 *   Etapa 3 "Enviando"          → status ∈ { sending, completed }
 *   Etapa 4 "Enviado"           → status === 'completed'
 *
 * A etapa atual (com spinner) é a última ativada ainda não sucedida por outra.
 * Para 'failed' e 'refunded', a Etapa 1 fica como 'active' (sem tratamento especial).
 */
function computeStepStates(
  status: CompositeTransactionStatus,
): [StepState, StepState, StepState, StepState] {
  // Caso especial: transação totalmente concluída — todas as etapas verdes
  if (status === 'completed') {
    return ['completed', 'completed', 'completed', 'completed'];
  }

  // Flags de ativação de cada etapa conforme condições definidas
  const activated: boolean[] = [
    status !== 'pending_deposit',
    (['converting', 'sending', 'completed'] as CompositeTransactionStatus[]).includes(status),
    (['sending', 'completed'] as CompositeTransactionStatus[]).includes(status),
    status === 'completed',
  ];

  // Etapa atual = última ativada; se nenhuma foi ativada (pending_deposit), usa a primeira
  const lastActiveIdx = activated.lastIndexOf(true);
  const currentIdx = lastActiveIdx === -1 ? 0 : lastActiveIdx;

  return activated.map((_, i) => {
    if (i < currentIdx) return 'completed';
    if (i === currentIdx) return 'active';
    return 'pending';
  }) as [StepState, StepState, StepState, StepState];
}

// ─── Sub-componentes ──────────────────────────────────────────────────────────

/** Ícone circular que reflete visualmente o estado da etapa */
function StepIcon({ state }: { state: StepState }) {
  // Etapa concluída: círculo verde com checkmark
  if (state === 'completed') {
    return (
      <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/30">
        <svg
          className="w-5 h-5 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
    );
  }

  // Etapa atual: círculo roxo com halo de pulse e spinner de carregamento
  if (state === 'active') {
    return (
      <div className="relative w-10 h-10 flex items-center justify-center">
        {/* Halo de pulse em roxo ao redor do ícone ativo */}
        <div className="absolute inset-0 rounded-full bg-[#7C22D5] opacity-25 animate-pulse" />
        {/* Borda e fundo roxo translúcido */}
        <div className="relative w-10 h-10 rounded-full border-2 border-[#7C22D5] bg-[#7C22D5]/10 flex items-center justify-center">
          {/* Spinner de carregamento */}
          <svg
            className="w-5 h-5 text-[#7C22D5] animate-spin"
            fill="none"
            viewBox="0 0 24 24"
            aria-label="Processando"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth={4}
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        </div>
      </div>
    );
  }

  // Etapa pendente: círculo cinza com ponto central
  return (
    <div className="w-10 h-10 rounded-full border-2 border-gray-600 bg-transparent flex items-center justify-center">
      <div className="w-2.5 h-2.5 rounded-full bg-gray-600" />
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

/**
 * StatusTimeline
 *
 * Exibe as 4 etapas do fluxo unificado (Pix → conversão → envio → conclusão)
 * com ícones coloridos e linhas conectoras que refletem o estado atual.
 */
export default function StatusTimeline({
  status,
  recipientName,
  senderCurrency,
  receiverCurrency,
  amount,
}: StatusTimelineProps) {
  const [s1, s2, s3, s4] = computeStepStates(status);

  // Valor formatado no padrão brasileiro com duas casas decimais
  const valorFormatado = amount.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // Definição das 4 etapas: rótulo exibido e estado calculado
  const etapas: Step[] = [
    { label: 'Pix\nrecebido',                    state: s1 },
    { label: 'Convertendo\nvalor',               state: s2 },
    { label: `Enviando para\n${recipientName}`,  state: s3 },
    { label: 'Enviado com\nsucesso',             state: s4 },
  ];

  return (
    <div className="w-full px-2 py-4">
      {/* Resumo da transferência: valor e par de moedas */}
      <p className="text-center text-sm text-gray-400 mb-6">
        <span className="text-white font-semibold">
          {valorFormatado} {senderCurrency}
        </span>
        <span className="mx-2 text-gray-500">→</span>
        <span className="text-white font-semibold">{receiverCurrency}</span>
      </p>

      {/* Faixa da timeline: ícones, conectores e labels */}
      <div className="flex items-start">
        {etapas.map((etapa, idx) => (
          <React.Fragment key={idx}>
            {/* Coluna de cada etapa: ícone centralizado + texto descritivo abaixo */}
            <div className="flex flex-col items-center" style={{ minWidth: '2.5rem' }}>
              <StepIcon state={etapa.state} />

              {/* Texto descritivo abaixo do ícone, colorido conforme o estado */}
              <p
                className={[
                  'mt-2 text-xs text-center leading-tight whitespace-pre-line',
                  'max-w-[4.5rem]',
                  etapa.state === 'completed'
                    ? 'text-green-400'
                    : etapa.state === 'active'
                      ? 'text-[#7C22D5] font-medium'
                      : 'text-gray-500',
                ].join(' ')}
              >
                {etapa.label}
              </p>
            </div>

            {/* Linha conectora horizontal entre etapas (omitida após a última) */}
            {idx < etapas.length - 1 && (
              <div
                className={[
                  'flex-1 h-px mt-5 self-start mx-1 transition-colors duration-500',
                  etapa.state === 'completed' ? 'bg-green-500' : 'bg-gray-600',
                ].join(' ')}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
