'use client';

// Página de detalhe de uma CompositeTransaction (envio internacional)
// Busca os dados em GET /api/transactions/send/[id] e exibe status, timeline e detalhes.
// Polling a cada 10s enquanto o status não for terminal (completed / failed / refunded).

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import StatusBadge from '@/components/ui/StatusBadge';
import StatusTimeline from '@/components/StatusTimeline';
import { CompositeTransaction, CompositeTransactionStatus } from '@/types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Mapeia o status composto para os tipos aceitos pelo StatusBadge */
function mapStatus(status: CompositeTransactionStatus): 'pending' | 'completed' | 'failed' | 'processing' {
  if (status === 'completed') return 'completed';
  if (status === 'failed' || status === 'refunded') return 'failed';
  if (status === 'converting' || status === 'sending') return 'processing';
  return 'pending'; // pending_deposit
}

/** Status que encerram o ciclo de polling */
const STATUS_TERMINAIS: CompositeTransactionStatus[] = ['completed', 'failed', 'refunded'];

// ─── Componente principal ──────────────────────────────────────────────────────

export default function SendDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  // ── Estado da transação ──────────────────────────────────────────────────
  const [transacao, setTransacao] = useState<CompositeTransaction | null>(null);
  const [erroCarregamento, setErroCarregamento] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);

  // ── Estado da UI de depósito ─────────────────────────────────────────────
  const [chaveCopiada, setChaveCopiada] = useState(false);

  // Referência ao intervalo de polling para limpeza adequada
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Busca os dados da transação composta pela API ────────────────────────
  const buscarTransacao = useCallback(async () => {
    try {
      const resposta = await fetch(`/api/transactions/send/${id}`);

      if (!resposta.ok) {
        // Extrai mensagem de erro da resposta, se disponível
        const dados = await resposta.json().catch(() => ({}));
        setErroCarregamento(dados.mensagem ?? 'Transação não encontrada.');
        return;
      }

      const dados: CompositeTransaction = await resposta.json();
      setTransacao(dados);

      // Encerra o polling ao atingir estado terminal
      if (STATUS_TERMINAIS.includes(dados.status)) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    } catch {
      // Erros de rede não interrompem o polling — nova tentativa no próximo ciclo
    } finally {
      setCarregando(false);
    }
  }, [id]);

  // ── Inicia busca inicial e polling a cada 10 segundos ────────────────────
  useEffect(() => {
    buscarTransacao();

    // Agenda polling somente se o status ainda não for terminal
    intervalRef.current = setInterval(buscarTransacao, 10_000);

    // Limpa o intervalo ao desmontar o componente
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [buscarTransacao]);

  // ── Copia o endereço Pix para a área de transferência ───────────────────
  const handleCopiarChave = async () => {
    if (!transacao?.depositInstructions?.deposit_address) return;
    await navigator.clipboard.writeText(transacao.depositInstructions.deposit_address);
    setChaveCopiada(true);
    setTimeout(() => setChaveCopiada(false), 3000);
  };

  // ── Estado: carregando ────────────────────────────────────────────────────
  if (carregando) {
    return (
      <div className="flex-1 bg-[#000904] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#7C22D5] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ── Estado: erro ou transação não encontrada ──────────────────────────────
  if (erroCarregamento || !transacao) {
    return (
      <div className="flex-1 bg-[#000904] flex flex-col items-center justify-center px-5 gap-4">
        <p className="text-white/50 text-sm font-medium text-center">
          {erroCarregamento ?? 'Transação não encontrada.'}
        </p>
        <Link
          href="/dashboard"
          className="text-[#9b4de0] font-bold text-sm hover:text-white/70 transition-colors"
        >
          ← Voltar ao painel
        </Link>
      </div>
    );
  }

  // ── Dados derivados para renderização ────────────────────────────────────
  const statusMapeado = mapStatus(transacao.status);
  const valorFormatado = transacao.amount.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="flex-1 bg-[#000904] flex flex-col items-center justify-center px-5 py-12 relative overflow-hidden">

      {/* Brilho roxo decorativo ao fundo */}
      <div className="fixed top-[-200px] left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[radial-gradient(ellipse,rgba(124,34,213,0.2)_0%,transparent_70%)] pointer-events-none z-0" />

      <div className="relative z-10 w-full max-w-[480px] flex flex-col gap-6 animate-[fadeUp_0.45s_ease_0.1s_both]">

        {/* Link de voltar ao painel */}
        <Link
          href="/dashboard"
          className="text-white/40 hover:text-white/70 text-sm font-medium transition-colors w-fit"
        >
          ← Voltar ao painel
        </Link>

        {/* ══ Card principal: status + valor + timeline ══════════════════════ */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-[20px] p-8 flex flex-col gap-6">

          {/* Cabeçalho: tipo de operação + badge de status */}
          <div className="flex items-center justify-between">
            <span className="text-white/50 font-bold text-sm">↑ Envio Internacional</span>
            <StatusBadge status={statusMapeado} />
          </div>

          {/* Destinatário */}
          <div>
            <p className="text-white/45 font-bold text-[11px] uppercase tracking-widest mb-1">
              Enviado para
            </p>
            <p className="text-white font-bold text-[18px]">{transacao.recipientName}</p>
          </div>

          {/* Valor em destaque com estimativa na moeda de destino */}
          <div>
            <p className="text-white/45 font-bold text-[11px] uppercase tracking-widest mb-2">
              Valor
            </p>
            <p className="text-white font-black text-[38px] leading-none">
              R$ {valorFormatado}
            </p>
            <p className="text-white/40 text-sm font-medium mt-1.5">
              → {transacao.receiverCurrency} estimado
            </p>
          </div>

          {/* Divisor */}
          <hr className="border-white/[0.06]" />

          {/* Timeline visual de progresso do envio */}
          <StatusTimeline
            status={transacao.status}
            recipientName={transacao.recipientName}
            senderCurrency={transacao.senderCurrency}
            receiverCurrency={transacao.receiverCurrency}
            amount={transacao.amount}
          />
        </div>

        {/* ══ Caixa de erro — exibida apenas quando status = 'failed' ════════ */}
        {transacao.status === 'failed' && (
          <div className="bg-red-500/10 border border-red-500/25 rounded-[16px] p-6 flex flex-col gap-4">
            <div>
              <p className="text-red-400 font-bold text-sm uppercase tracking-widest mb-2">
                Problema no envio
              </p>
              <p className="text-white/60 text-sm font-medium leading-relaxed">
                {transacao.errorMessage ?? 'Não foi possível concluir a transferência. Entre em contato com o suporte.'}
              </p>
            </div>
            {/* Botão "Tentar novamente" redireciona para a página de envio */}
            <button
              onClick={() => router.push('/send')}
              className="w-full py-3.5 rounded-[10px] bg-[#7c22d5] text-white font-black text-sm hover:bg-[#9b4de0] transition-all duration-200"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {/* ══ Instruções de depósito — exibidas quando status = 'pending_deposit' ══ */}
        {transacao.status === 'pending_deposit' && transacao.depositInstructions && (
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-[20px] p-8 flex flex-col gap-5">

            {/* Cabeçalho com ícone Pix */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[rgba(124,34,213,0.15)] border border-[rgba(124,34,213,0.25)] flex items-center justify-center flex-shrink-0">
                {/* Ícone losango representando Pix */}
                <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
                  <path
                    d="M14 3L25 14L14 25L3 14L14 3Z"
                    stroke="#7c22d5"
                    strokeWidth="2"
                    strokeLinejoin="round"
                    fill="rgba(124,34,213,0.2)"
                  />
                </svg>
              </div>
              <div>
                <p className="text-white font-bold text-[15px]">Aguardando Pix</p>
                <p className="text-white/40 text-xs font-medium">Realize o pagamento para continuar</p>
              </div>
            </div>

            {/* Valor e método de pagamento */}
            <div>
              <p className="text-white/45 font-bold text-[11px] uppercase tracking-widest mb-1">
                Envie via {transacao.depositInstructions.payment_rail.toUpperCase()}
              </p>
              <p className="text-white font-black text-[24px]">
                {transacao.depositInstructions.currency}{' '}
                {transacao.depositInstructions.amount.toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>

            {/* Endereço / chave Pix de depósito */}
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-[12px] p-4">
              <p className="text-white/35 text-[11px] font-bold uppercase tracking-widest mb-2">
                {transacao.depositInstructions.payment_rail === 'pix' ? 'Chave Pix' : 'Endereço de depósito'}
              </p>
              <p className="text-white font-bold text-[15px] break-all leading-relaxed">
                {transacao.depositInstructions.deposit_address}
              </p>
            </div>

            {/* Botão para copiar a chave/endereço */}
            <button
              onClick={handleCopiarChave}
              className={`w-full py-3.5 rounded-[10px] font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                chaveCopiada
                  ? 'bg-green-500/15 border border-green-500/30 text-green-400'
                  : 'bg-[#7c22d5] text-white hover:bg-[#9b4de0]'
              }`}
            >
              {chaveCopiada ? (
                <>
                  {/* Ícone de check após copiar */}
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M2 7L5.5 10.5L12 4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Chave copiada!
                </>
              ) : (
                <>
                  {/* Ícone de copiar */}
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <rect x="4" y="4" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                    <path
                      d="M2 10V3C2 2.45 2.45 2 3 2h7"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  Copiar chave Pix
                </>
              )}
            </button>
          </div>
        )}

        {/* ══ Seção de detalhes da transferência ════════════════════════════ */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-[20px] p-8 flex flex-col gap-5">

          <p className="text-white/45 font-bold text-[11px] uppercase tracking-widest">
            Detalhes da transferência
          </p>

          {/* Data de criação */}
          <div>
            <p className="text-white/45 font-bold text-[11px] uppercase tracking-widest mb-1">
              Criada em
            </p>
            <p className="text-white/70 text-sm font-medium">
              {new Date(transacao.createdAt).toLocaleString('pt-BR')}
            </p>
          </div>

          {/* Taxa de câmbio usada na cotação */}
          {transacao.quoteRate && (
            <div>
              <p className="text-white/45 font-bold text-[11px] uppercase tracking-widest mb-1">
                Taxa de câmbio
              </p>
              <p className="text-white/70 text-sm font-medium font-mono">
                1 {transacao.senderCurrency} = {transacao.quoteRate} {transacao.receiverCurrency}
              </p>
            </div>
          )}

          {/* Método de pagamento: sempre Pix para envios neste fluxo */}
          <div>
            <p className="text-white/45 font-bold text-[11px] uppercase tracking-widest mb-1">
              Método de pagamento
            </p>
            <p className="text-white/70 text-sm font-medium">Pix</p>
          </div>

          {/* Dados do destinatário */}
          <div>
            <p className="text-white/45 font-bold text-[11px] uppercase tracking-widest mb-1">
              Destinatário
            </p>
            <p className="text-white/70 text-sm font-medium">{transacao.recipientName}</p>

            {/* Conta bancária externa (CLABE, CBU, etc.) */}
            {transacao.recipientExternalAccountId && (
              <p className="text-white/40 font-mono text-xs mt-1 break-all">
                Conta: {transacao.recipientExternalAccountId}
              </p>
            )}

            {/* Chave Pix do destinatário, se houver */}
            {transacao.recipientPixKey && (
              <p className="text-white/40 font-mono text-xs mt-1 break-all">
                Pix: {transacao.recipientPixKey}
              </p>
            )}
          </div>

          {/* Par de moedas da conversão */}
          <div>
            <p className="text-white/45 font-bold text-[11px] uppercase tracking-widest mb-1">
              Conversão
            </p>
            <p className="text-white/70 text-sm font-medium">
              {transacao.senderCurrency} → {transacao.receiverCurrency}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
