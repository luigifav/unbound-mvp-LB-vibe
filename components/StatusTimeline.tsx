import React from 'react';
import { CompositeTransactionStatus } from '@/types';

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

function computeStepStates(
  status: CompositeTransactionStatus,
): [StepState, StepState, StepState, StepState] {
  if (status === 'completed') {
    return ['completed', 'completed', 'completed', 'completed'];
  }

  const activated: boolean[] = [
    status !== 'pending_deposit',
    (['converting', 'sending', 'completed'] as CompositeTransactionStatus[]).includes(status),
    (['sending', 'completed'] as CompositeTransactionStatus[]).includes(status),
    false,
  ];

  const lastActiveIdx = activated.lastIndexOf(true);
  const currentIdx = lastActiveIdx === -1 ? 0 : lastActiveIdx;

  return activated.map((_, i) => {
    if (i < currentIdx) return 'completed';
    if (i === currentIdx) return 'active';
    return 'pending';
  }) as [StepState, StepState, StepState, StepState];
}

function StepIcon({ state }: { state: StepState }) {
  if (state === 'completed') {
    return (
      <div className="w-10 h-10 rounded-full bg-[#22c55e] flex items-center justify-center shadow-lg shadow-green-500/30">
        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
    );
  }

  if (state === 'active') {
    return (
      <div className="relative w-10 h-10 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-[#9523ef] opacity-25 animate-pulse" />
        <div className="relative w-10 h-10 rounded-full border-2 border-[#9523ef] bg-[#9523ef]/10 flex items-center justify-center">
          <svg className="w-5 h-5 text-[#9523ef] animate-spin" fill="none" viewBox="0 0 24 24" aria-label="Processando">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="w-10 h-10 rounded-full border-2 border-[#e0d8ee] bg-transparent flex items-center justify-center">
      <div className="w-2.5 h-2.5 rounded-full bg-[#a1a1aa]" />
    </div>
  );
}

export default function StatusTimeline({
  status,
  recipientName,
  senderCurrency,
  receiverCurrency,
  amount,
}: StatusTimelineProps) {
  const [s1, s2, s3, s4] = computeStepStates(status);

  const valorFormatado = amount.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const etapas: Step[] = [
    { label: 'Pix\nrecebido',                    state: s1 },
    { label: 'Convertendo\nvalor',               state: s2 },
    { label: `Enviando para\n${recipientName}`,  state: s3 },
    { label: 'Enviado com\nsucesso',             state: s4 },
  ];

  return (
    <div className="w-full px-2 py-4">
      <p className="text-center text-sm text-[#a1a1aa] mb-6">
        <span className="text-[#0a0a0a] font-semibold">
          {valorFormatado} {senderCurrency}
        </span>
        <span className="mx-2 text-[#a1a1aa]">→</span>
        <span className="text-[#0a0a0a] font-semibold">{receiverCurrency}</span>
      </p>

      <div className="flex items-start">
        {etapas.map((etapa, idx) => (
          <React.Fragment key={idx}>
            <div className="flex flex-col items-center" style={{ minWidth: '2.5rem' }}>
              <StepIcon state={etapa.state} />
              <p
                className={[
                  'mt-2 text-xs text-center leading-tight whitespace-pre-line',
                  'max-w-[4.5rem]',
                  etapa.state === 'completed'
                    ? 'text-[#22c55e]'
                    : etapa.state === 'active'
                      ? 'text-[#9523ef] font-medium'
                      : 'text-[#a1a1aa]',
                ].join(' ')}
              >
                {etapa.label}
              </p>
            </div>

            {idx < etapas.length - 1 && (
              <div
                className={[
                  'flex-1 h-px mt-5 self-start mx-1 transition-colors duration-500',
                  etapa.state === 'completed' ? 'bg-[#22c55e]' : 'bg-[#e0d8ee]',
                ].join(' ')}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
