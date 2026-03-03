'use client';

// Página de envio internacional de dinheiro
// Estados: 'form' → 'deposit' → 'tracking'
import { useState, useEffect, useRef, useCallback } from 'react';
import { useSession } from 'next-auth/react';

// ─── Tipos locais ─────────────────────────────────────────────────────────────

type Etapa = 'form' | 'deposit' | 'tracking';

type StatusComposito =
  | 'pending_deposit'
  | 'converting'
  | 'sending'
  | 'completed'
  | 'failed'
  | 'refunded';

interface InstrucoesDeposito {
  amount: number;
  currency: string;
  payment_rail: string;
  deposit_address: string;
}

// ─── Configuração dos países de destino disponíveis ───────────────────────────

interface ConfigPais {
  valor: string;
  label: string;
  moeda: string;
  rail: string;
  campoLabel: string;
  campoPlaceholder: string;
  taxaAprox: number; // taxa aproximada BRL → moeda destino (indicativa, apenas para preview)
}

const PAISES: ConfigPais[] = [
  {
    valor: 'MEX',
    label: 'México',
    moeda: 'MXN',
    rail: 'spei',
    campoLabel: 'CLABE (18 dígitos)',
    campoPlaceholder: '000000000000000000',
    taxaAprox: 3.6,
  },
  {
    valor: 'ARG',
    label: 'Argentina',
    moeda: 'ARS',
    rail: 'cbu',
    campoLabel: 'CBU/CVU (22 dígitos)',
    campoPlaceholder: '0000000000000000000000',
    taxaAprox: 200,
  },
  {
    valor: 'COL',
    label: 'Colômbia',
    moeda: 'COP',
    rail: 'pse',
    campoLabel: 'Número de conta bancária',
    campoPlaceholder: 'Ex: 1234567890',
    taxaAprox: 800,
  },
  {
    valor: 'PER',
    label: 'Peru',
    moeda: 'PEN',
    rail: 'transfer',
    campoLabel: 'CCI — Código Interbancário (20 dígitos)',
    campoPlaceholder: '00000000000000000000',
    taxaAprox: 0.56,
  },
  {
    valor: 'CHL',
    label: 'Chile',
    moeda: 'CLP',
    rail: 'transfer',
    campoLabel: 'Número de conta bancária',
    campoPlaceholder: 'Ex: 1234567890',
    taxaAprox: 72,
  },
];

// ─── Componente StatusTimeline ─────────────────────────────────────────────────
// Exibe a timeline visual de progresso do envio internacional

interface StatusTimelineProps {
  status: StatusComposito;
  nomeDestinatario: string;
}

function StatusTimeline({ status, nomeDestinatario }: StatusTimelineProps) {
  // Cada etapa define quais status a marcam como concluída e qual a ativa
  const etapas: Array<{
    label: string;
    concluido: StatusComposito[];
    ativo: StatusComposito;
  }> = [
    {
      label: 'Pix recebido',
      concluido: ['converting', 'sending', 'completed'],
      ativo: 'pending_deposit',
    },
    {
      label: 'Processando',
      concluido: ['sending', 'completed'],
      ativo: 'converting',
    },
    {
      label: `Enviando para ${nomeDestinatario}`,
      concluido: ['completed'],
      ativo: 'sending',
    },
    {
      label: 'Concluído',
      concluido: [],
      ativo: 'completed',
    },
  ];

  return (
    <div className="flex flex-col">
      {etapas.map((etapa, idx) => {
        const concluida = etapa.concluido.includes(status);
        const ativa = etapa.ativo === status;
        const futura = !concluida && !ativa;
        const ultimaEtapa = idx === etapas.length - 1;

        return (
          <div key={idx} className="flex items-start gap-4">
            {/* Coluna do indicador visual */}
            <div className="flex flex-col items-center flex-shrink-0">
              {/* Círculo de status */}
              <div
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
                  concluida
                    ? 'bg-[#7c22d5] border-[#7c22d5]'
                    : ativa
                    ? 'bg-[rgba(124,34,213,0.15)] border-[#7c22d5]'
                    : 'bg-transparent border-white/15'
                }`}
              >
                {/* Ícone de check para etapas concluídas */}
                {concluida && (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M2 7L5.5 10.5L12 4"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
                {/* Ponto animado para etapa ativa */}
                {ativa && (
                  <div className="w-2.5 h-2.5 rounded-full bg-[#7c22d5] animate-pulse" />
                )}
              </div>

              {/* Linha vertical conectando as etapas */}
              {!ultimaEtapa && (
                <div
                  className={`w-0.5 h-10 transition-all duration-500 ${
                    concluida ? 'bg-[#7c22d5]/50' : 'bg-white/8'
                  }`}
                />
              )}
            </div>

            {/* Coluna do texto */}
            <div className={`pt-1 ${ultimaEtapa ? 'pb-0' : 'pb-3'}`}>
              <p
                className={`font-bold text-sm transition-colors duration-300 ${
                  concluida
                    ? 'text-white/50'
                    : ativa
                    ? 'text-white'
                    : futura
                    ? 'text-white/20'
                    : 'text-white/20'
                }`}
              >
                {etapa.label}
              </p>

              {/* Label de status para etapa ativa */}
              {ativa && (
                <p className="text-[#9b4de0] text-xs font-medium mt-0.5">
                  Em andamento...
                </p>
              )}
              {/* Label de concluído */}
              {concluida && (
                <p className="text-white/30 text-xs font-medium mt-0.5">
                  Concluído
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Página principal de envio ─────────────────────────────────────────────────

export default function SendPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: session } = useSession();

  // ─── Controle da etapa atual ──────────────────────────────────────────
  const [etapa, setEtapa] = useState<Etapa>('form');

  // ─── Campos do formulário ─────────────────────────────────────────────
  const [valor, setValor] = useState('');
  const [paisSelecionado, setPaisSelecionado] = useState<string>(PAISES[0].valor);
  const [nomeDestinatario, setNomeDestinatario] = useState('');
  const [campoBancario, setCampoBancario] = useState('');
  const [nomeRemetente, setNomeRemetente] = useState('');
  const [cpfRemetente, setCpfRemetente] = useState('');

  // ─── Controle do preview de cotação ──────────────────────────────────
  const [cotacaoVisivel, setCotacaoVisivel] = useState(false);

  // ─── Estados de UI ────────────────────────────────────────────────────
  const [isLoadingEnvio, setIsLoadingEnvio] = useState(false);
  const [erroEnvio, setErroEnvio] = useState<string | null>(null);

  // ─── Dados retornados após submissão do formulário ───────────────────
  const [compositeTransactionId, setCompositeTransactionId] = useState<string | null>(null);
  const [instrucoesDeposito, setInstrucoesDeposito] = useState<InstrucoesDeposito | null>(null);
  // Dados salvos do formulário para exibição nas etapas seguintes
  const [nomeDestinatarioSalvo, setNomeDestinatarioSalvo] = useState('');
  const [valorEnviado, setValorEnviado] = useState('');
  const [paisLabelSalvo, setPaisLabelSalvo] = useState('');

  // ─── Estado do tracking ───────────────────────────────────────────────
  const [statusAtual, setStatusAtual] = useState<StatusComposito>('pending_deposit');
  const [chaveCopiada, setChaveCopiada] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ─── Configuração do país selecionado ─────────────────────────────────
  const paisConfig = PAISES.find(p => p.valor === paisSelecionado) ?? PAISES[0];
  const valorNumerico = parseFloat(valor) || 0;
  // Taxa aproximada para preview (sem chamada à API de cotação)
  const valorConvertido = valorNumerico * paisConfig.taxaAprox;

  // ─── Limpa campo bancário e preview ao trocar de país ─────────────────
  useEffect(() => {
    setCampoBancario('');
    setCotacaoVisivel(false);
    setErroEnvio(null);
  }, [paisSelecionado]);

  // ─── Função de polling do status da transação ─────────────────────────
  const buscarStatus = useCallback(async (id: string) => {
    try {
      const resposta = await fetch(`/api/transactions/send/${id}`);
      if (!resposta.ok) return;

      const dados = await resposta.json();
      const novoStatus = dados.status as StatusComposito;
      setStatusAtual(novoStatus);

      // Interrompe o polling quando a transação atingir estado final
      if (['completed', 'failed', 'refunded'].includes(novoStatus)) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    } catch {
      // Erros de rede não interrompem o polling — tenta novamente no próximo ciclo
    }
  }, []);

  // ─── Inicia polling ao entrar na etapa de tracking ───────────────────
  useEffect(() => {
    if (etapa !== 'tracking' || !compositeTransactionId) return;

    // Primeira busca imediata
    buscarStatus(compositeTransactionId);

    // Polling a cada 5 segundos
    intervalRef.current = setInterval(() => {
      buscarStatus(compositeTransactionId);
    }, 5000);

    // Limpa o intervalo ao sair da etapa ou desmontar o componente
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [etapa, compositeTransactionId, buscarStatus]);

  // ─── Submissão do formulário para a API ───────────────────────────────
  const handleEnviar = async () => {
    // Valida preenchimento dos campos obrigatórios
    if (!valor || valorNumerico <= 0) {
      setErroEnvio('Informe o valor a enviar.');
      return;
    }
    if (!nomeDestinatario.trim()) {
      setErroEnvio('Informe o nome completo do destinatário.');
      return;
    }
    if (!campoBancario.trim()) {
      setErroEnvio(`Informe o ${paisConfig.campoLabel}.`);
      return;
    }
    if (!nomeRemetente.trim()) {
      setErroEnvio('Informe seu nome completo.');
      return;
    }
    if (!cpfRemetente.trim()) {
      setErroEnvio('Informe seu CPF.');
      return;
    }

    setIsLoadingEnvio(true);
    setErroEnvio(null);

    try {
      const resposta = await fetch('/api/transactions/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: valorNumerico,
          senderCurrency: 'BRL',
          senderPaymentRail: 'pix',
          senderName: nomeRemetente,
          senderDocument: cpfRemetente,
          receiverCurrency: paisConfig.moeda,
          receiverPaymentRail: paisConfig.rail,
          recipientName: nomeDestinatario,
          recipientExternalAccountId: campoBancario,
        }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        setErroEnvio(dados.mensagem ?? 'Erro ao processar a transferência.');
        return;
      }

      // Salva os dados retornados pela API no estado
      setCompositeTransactionId(dados.compositeTransactionId);
      setInstrucoesDeposito(dados.depositInstructions);

      // Salva dados do formulário para exibição nas etapas seguintes
      setNomeDestinatarioSalvo(nomeDestinatario);
      setValorEnviado(valor);
      setPaisLabelSalvo(paisConfig.label);

      // Avança para a etapa de depósito
      setEtapa('deposit');
    } catch {
      setErroEnvio('Não foi possível conectar ao servidor. Tente novamente.');
    } finally {
      setIsLoadingEnvio(false);
    }
  };

  // ─── Copia a chave/endereço de depósito para a área de transferência ──
  const handleCopiarChave = async () => {
    if (!instrucoesDeposito?.deposit_address) return;
    await navigator.clipboard.writeText(instrucoesDeposito.deposit_address);
    setChaveCopiada(true);
    setTimeout(() => setChaveCopiada(false), 3000);
  };

  // ─── Reinicia o fluxo para um novo envio ─────────────────────────────
  const handleNovoEnvio = () => {
    setEtapa('form');
    setValor('');
    setPaisSelecionado(PAISES[0].valor);
    setNomeDestinatario('');
    setCampoBancario('');
    setNomeRemetente('');
    setCpfRemetente('');
    setCotacaoVisivel(false);
    setErroEnvio(null);
    setCompositeTransactionId(null);
    setInstrucoesDeposito(null);
    setStatusAtual('pending_deposit');
    setChaveCopiada(false);
  };

  // ─── Estilos compartilhados ───────────────────────────────────────────
  const inputClass =
    'bg-white/[0.06] border border-white/10 rounded-[10px] px-4 py-3.5 text-white font-medium text-[15px] outline-none w-full transition-colors focus:border-[#7c22d5] focus:bg-[rgba(124,34,213,0.08)] placeholder:text-white/20';

  const labelClass =
    'text-white/45 font-bold text-[11px] uppercase tracking-widest';

  return (
    <div className="min-h-screen bg-[#000904] flex flex-col items-center justify-center px-5 py-12 relative overflow-hidden">

      {/* Brilho roxo decorativo ao fundo */}
      <div className="fixed top-[-200px] left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[radial-gradient(ellipse,rgba(124,34,213,0.2)_0%,transparent_70%)] pointer-events-none z-0" />

      {/* ══════════════════════════════════════════════════════════════════
          ETAPA: FORMULÁRIO
          Coleta dados do envio e exibe preview de cotação
      ══════════════════════════════════════════════════════════════════ */}
      {etapa === 'form' && (
        <div className="relative z-10 w-full max-w-[480px] bg-white/[0.03] border border-white/[0.08] rounded-[20px] p-9 animate-[fadeUp_0.45s_ease_0.1s_both]">

          {/* Cabeçalho */}
          <div className="mb-8">
            <h1 className="text-white font-black text-[26px] leading-tight mb-1.5">
              Enviar Dinheiro
            </h1>
            <p className="text-white/45 font-medium text-sm">
              Transferência internacional simples e rápida
            </p>
          </div>

          <div className="flex flex-col gap-5">

            {/* Campo: Valor em BRL */}
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Valor a Enviar (BRL)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35 font-bold text-[15px] pointer-events-none">
                  R$
                </span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0,00"
                  value={valor}
                  onChange={e => {
                    setValor(e.target.value);
                    setCotacaoVisivel(false);
                  }}
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>

            {/* Campo: País de destino */}
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>País de Destino</label>
              <select
                value={paisSelecionado}
                onChange={e => setPaisSelecionado(e.target.value)}
                className="bg-[#000904] border border-white/10 rounded-[10px] px-4 py-3.5 text-white font-medium text-[15px] outline-none cursor-pointer transition-colors focus:border-[#7c22d5] appearance-none"
              >
                {PAISES.map(p => (
                  <option key={p.valor} value={p.valor}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Campo: Nome completo do destinatário */}
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Nome Completo do Destinatário</label>
              <input
                type="text"
                placeholder="Nome como consta na conta bancária"
                value={nomeDestinatario}
                onChange={e => setNomeDestinatario(e.target.value)}
                className={inputClass}
              />
            </div>

            {/* Campo condicional por país: CLABE (México), CBU (Argentina), etc. */}
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>{paisConfig.campoLabel}</label>
              <input
                type="text"
                placeholder={paisConfig.campoPlaceholder}
                value={campoBancario}
                onChange={e => setCampoBancario(e.target.value)}
                className={inputClass}
              />
            </div>

            {/* Separador visual: dados do remetente */}
            <div className="relative flex items-center gap-3 my-1">
              <div className="flex-1 h-px bg-white/[0.06]" />
              <span className="text-white/25 text-[11px] font-bold uppercase tracking-widest flex-shrink-0">
                Seus dados
              </span>
              <div className="flex-1 h-px bg-white/[0.06]" />
            </div>

            {/* Campo: Nome completo do remetente */}
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Seu Nome Completo</label>
              <input
                type="text"
                placeholder="Nome como consta no seu CPF"
                value={nomeRemetente}
                onChange={e => setNomeRemetente(e.target.value)}
                className={inputClass}
              />
            </div>

            {/* Campo: CPF do remetente */}
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Seu CPF</label>
              <input
                type="text"
                placeholder="000.000.000-00"
                value={cpfRemetente}
                onChange={e => setCpfRemetente(e.target.value)}
                maxLength={14}
                className={inputClass}
              />
            </div>

            {/* Preview de cotação — exibido após clicar em "Ver quanto chega" */}
            {cotacaoVisivel && valorNumerico > 0 && (
              <div className="bg-[rgba(124,34,213,0.08)] border border-[rgba(124,34,213,0.25)] rounded-[12px] p-4 animate-[fadeUp_0.3s_ease_both]">
                <p className={`${labelClass} mb-2`}>Estimativa de chegada</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-white font-black text-[26px]">
                    {valorConvertido.toLocaleString('pt-BR', {
                      maximumFractionDigits: 2,
                    })}
                  </span>
                  <span className="text-white/55 font-bold text-[16px]">
                    {paisConfig.moeda}
                  </span>
                </div>
                <p className="text-white/30 text-xs font-medium mt-1.5">
                  Taxa indicativa · Valor final confirmado no envio
                </p>
              </div>
            )}

            {/* Mensagem de erro */}
            {erroEnvio && (
              <div className="bg-red-500/10 border border-red-500/25 rounded-[10px] px-4 py-3">
                <p className="text-red-400 text-sm font-medium">{erroEnvio}</p>
              </div>
            )}

            {/* Botões de ação */}
            <div className="flex flex-col gap-3 mt-1">

              {/* Botão: Ver quanto chega — mostra preview da cotação */}
              <button
                type="button"
                onClick={() => {
                  if (!valor || valorNumerico <= 0) {
                    setErroEnvio('Informe o valor a enviar para ver a estimativa.');
                    return;
                  }
                  setErroEnvio(null);
                  setCotacaoVisivel(true);
                }}
                className="w-full py-3.5 rounded-[10px] border border-[rgba(124,34,213,0.4)] text-[#9b4de0] font-bold text-sm hover:bg-[rgba(124,34,213,0.08)] transition-all duration-200"
              >
                Ver quanto chega
              </button>

              {/* Botão: Enviar agora — submete o formulário */}
              <button
                type="button"
                disabled={isLoadingEnvio}
                onClick={handleEnviar}
                className="w-full py-3.5 rounded-[10px] bg-[#7c22d5] text-white font-black text-sm hover:bg-[#9b4de0] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
              >
                {isLoadingEnvio ? (
                  <>
                    {/* Spinner de carregamento */}
                    <div className="w-[14px] h-[14px] border-2 border-white/30 border-t-white rounded-full animate-[spin_0.7s_linear_infinite]" />
                    Processando...
                  </>
                ) : (
                  'Enviar agora'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          ETAPA: DEPÓSITO
          Instrui o usuário a realizar o Pix para a chave retornada
      ══════════════════════════════════════════════════════════════════ */}
      {etapa === 'deposit' && instrucoesDeposito && (
        <div className="relative z-10 w-full max-w-[480px] bg-white/[0.03] border border-white/[0.08] rounded-[20px] p-9 animate-[fadeUp_0.45s_ease_0.1s_both]">

          {/* Ícone representando Pix */}
          <div className="w-14 h-14 rounded-2xl bg-[rgba(124,34,213,0.15)] border border-[rgba(124,34,213,0.25)] flex items-center justify-center mb-6">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path
                d="M14 3L25 14L14 25L3 14L14 3Z"
                stroke="#7c22d5"
                strokeWidth="2"
                strokeLinejoin="round"
                fill="rgba(124,34,213,0.2)"
              />
            </svg>
          </div>

          <h2 className="text-white font-black text-[22px] leading-tight mb-2">
            Faça o Pix
          </h2>
          <p className="text-white/45 font-medium text-sm mb-7">
            Envie{' '}
            <span className="text-white font-bold">
              R${' '}
              {parseFloat(valorEnviado).toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
              })}
            </span>{' '}
            para a chave abaixo
          </p>

          {/* Exibe a chave/endereço de depósito retornado pela API */}
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-[14px] p-5 mb-5">
            <p className="text-white/35 text-[11px] font-bold uppercase tracking-widest mb-2">
              {instrucoesDeposito.payment_rail === 'pix' ? 'Chave Pix' : 'Endereço de depósito'}
            </p>
            <p className="text-white font-bold text-[15px] break-all leading-relaxed">
              {instrucoesDeposito.deposit_address}
            </p>
          </div>

          {/* Botão para copiar a chave/endereço */}
          <button
            onClick={handleCopiarChave}
            className={`w-full py-3.5 rounded-[10px] font-bold text-sm transition-all duration-200 mb-4 flex items-center justify-center gap-2 ${
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
                Copiar chave
              </>
            )}
          </button>

          {/* Informação sobre o processamento automático */}
          <div className="bg-[rgba(124,34,213,0.06)] border border-[rgba(124,34,213,0.15)] rounded-[10px] p-4 mb-6">
            <p className="text-white/55 text-sm font-medium leading-relaxed">
              Assim que identificarmos seu pagamento, o envio para{' '}
              <span className="text-white font-bold">{nomeDestinatarioSalvo}</span>{' '}
              em <span className="text-white font-bold">{paisLabelSalvo}</span> é automático.
            </p>
          </div>

          {/* Botão: Já fiz o Pix — avança para acompanhamento */}
          <button
            onClick={() => setEtapa('tracking')}
            className="w-full py-3.5 rounded-[10px] border border-white/15 text-white/55 font-bold text-sm hover:border-white/30 hover:text-white/75 transition-all duration-200"
          >
            Já fiz o Pix →
          </button>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          ETAPA: ACOMPANHAMENTO
          Polling de status com timeline visual de progresso
      ══════════════════════════════════════════════════════════════════ */}
      {etapa === 'tracking' && (
        <div className="relative z-10 w-full max-w-[480px] animate-[fadeUp_0.45s_ease_0.1s_both]">

          {/* Card principal de tracking */}
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-[20px] p-9 mb-4">

            {/* ── Transação concluída com sucesso ── */}
            {statusAtual === 'completed' && (
              <>
                <div className="flex flex-col items-center text-center mb-8">
                  {/* Ícone de sucesso */}
                  <div className="w-16 h-16 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center mb-5">
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                      <path
                        d="M5 14L10.5 19.5L23 8"
                        stroke="#4ade80"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <h2 className="text-white font-black text-[24px] mb-2">
                    Dinheiro enviado!
                  </h2>
                  <p className="text-white/45 font-medium text-sm leading-relaxed">
                    A transferência para{' '}
                    <span className="text-white font-bold">{nomeDestinatarioSalvo}</span>{' '}
                    foi concluída com sucesso.
                  </p>
                </div>

                <button
                  onClick={handleNovoEnvio}
                  className="w-full py-3.5 rounded-[10px] bg-[#7c22d5] text-white font-black text-sm hover:bg-[#9b4de0] transition-all duration-200"
                >
                  Fazer novo envio
                </button>
              </>
            )}

            {/* ── Transação com falha ou reembolso ── */}
            {(statusAtual === 'failed' || statusAtual === 'refunded') && (
              <>
                <div className="flex flex-col items-center text-center mb-8">
                  {/* Ícone de erro */}
                  <div className="w-16 h-16 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center mb-5">
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                      <path
                        d="M8 8L20 20M20 8L8 20"
                        stroke="#f87171"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  <h2 className="text-white font-black text-[24px] mb-2">
                    {statusAtual === 'refunded'
                      ? 'Reembolso em andamento'
                      : 'Problema no envio'}
                  </h2>
                  <p className="text-white/45 font-medium text-sm leading-relaxed">
                    {statusAtual === 'refunded'
                      ? 'Seu valor será devolvido em até 2 dias úteis.'
                      : 'Não foi possível concluir a transferência. Entre em contato com o suporte.'}
                  </p>
                </div>

                <button
                  onClick={handleNovoEnvio}
                  className="w-full py-3.5 rounded-[10px] border border-white/15 text-white/55 font-bold text-sm hover:border-white/30 hover:text-white/75 transition-all duration-200"
                >
                  Tentar novamente
                </button>
              </>
            )}

            {/* ── Em progresso: timeline visual ── */}
            {statusAtual !== 'completed' &&
              statusAtual !== 'failed' &&
              statusAtual !== 'refunded' && (
              <>
                <div className="mb-7">
                  <h2 className="text-white font-black text-[22px] mb-1.5">
                    Acompanhe o envio
                  </h2>
                  <p className="text-white/45 font-medium text-sm">
                    Atualiza automaticamente a cada 5 segundos
                  </p>
                </div>

                {/* Timeline de status do envio */}
                <StatusTimeline
                  status={statusAtual}
                  nomeDestinatario={nomeDestinatarioSalvo}
                />
              </>
            )}
          </div>

          {/* Card de resumo da transferência — visível enquanto em progresso */}
          {statusAtual !== 'completed' &&
            statusAtual !== 'failed' &&
            statusAtual !== 'refunded' && (
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-[14px] p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/35 text-xs font-bold uppercase tracking-widest">
                  Destinatário
                </span>
                <span className="text-white/65 text-sm font-bold">
                  {nomeDestinatarioSalvo}
                </span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/35 text-xs font-bold uppercase tracking-widest">
                  País
                </span>
                <span className="text-white/65 text-sm font-bold">
                  {paisLabelSalvo}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/35 text-xs font-bold uppercase tracking-widest">
                  Valor enviado
                </span>
                <span className="text-white/65 text-sm font-bold">
                  R${' '}
                  {parseFloat(valorEnviado).toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Rodapé de segurança */}
      <p className="relative z-10 mt-6 font-bold text-[10px] text-white/15 tracking-[0.12em] uppercase animate-[fadeUp_0.5s_ease_0.2s_both]">
        Protegido por UnboundCash
      </p>
    </div>
  );
}
