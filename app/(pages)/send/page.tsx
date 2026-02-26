'use client';

import { useState } from 'react';
import LoadingButton from '@/components/ui/LoadingButton';
import Feedback from '@/components/ui/Feedback';

// Tipos para o estado do resultado da transação
type Resultado = { tipo: 'sucesso' | 'erro'; mensagem: string } | null;

export default function SendPage() {
  // ─── Estado do formulário ───────────────────────────────────────
  const [valor, setValor] = useState('');
  const [moeda, setMoeda] = useState('USD');
  const [nomeDestinatario, setNomeDestinatario] = useState('');
  const [bancoDestinatario, setBancoDestinatario] = useState('');
  const [numeroConta, setNumeroConta] = useState('');

  // ─── Estado de carregamento e resultado ─────────────────────────
  const [isLoading, setIsLoading] = useState(false);
  const [resultado, setResultado] = useState<Resultado>(null);

  // ─── Ponto de conexão com a API de envio ────────────────────────
  // TODO: conectar com a rota POST /api/transactions/payout
  const handleEnviar = () => {
    setIsLoading(true);
    setResultado(null);

    // TODO: substituir pela chamada real à API
    setTimeout(() => {
      setIsLoading(false);
      setResultado({
        tipo: 'sucesso',
        mensagem: `Transferência de ${valor} ${moeda} para ${nomeDestinatario} enviada com sucesso!`,
      });
    }, 2000);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#000904] flex flex-col items-center justify-center px-5 py-12 relative overflow-hidden">

      {/* Brilho roxo decorativo ao fundo */}
      <div className="fixed top-[-200px] left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[radial-gradient(ellipse,rgba(124,34,213,0.2)_0%,transparent_70%)] pointer-events-none" />

      {/* Card principal */}
      <div className="w-full max-w-[480px] bg-white/[0.03] border border-white/[0.08] rounded-[20px] p-9 animate-[fadeUp_0.45s_ease_0.1s_both]">

        {/* Cabeçalho da página */}
        <div className="mb-8">
          <h1 className="text-white font-black text-[26px] leading-tight mb-1.5">
            Enviar Dinheiro
          </h1>
          <p className="text-white/45 font-medium text-sm">
            Preencha os dados da transferência internacional
          </p>
        </div>

        {/* Formulário de envio */}
        <form
          onSubmit={e => { e.preventDefault(); handleEnviar(); }}
          className="flex flex-col gap-5"
        >
          {/* Linha: Valor + Moeda */}
          <div className="flex gap-3">

            {/* Campo: Valor a enviar */}
            <div className="flex flex-col gap-1.5 flex-1">
              <label className="text-white/45 font-bold text-[11px] uppercase tracking-widest">
                Valor
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="0,00"
                value={valor}
                onChange={e => setValor(e.target.value)}
                required
                className="bg-white/[0.06] border border-white/10 rounded-[10px] px-4 py-3.5 text-white font-medium text-[15px] outline-none w-full transition-colors focus:border-[#7c22d5] focus:bg-[rgba(124,34,213,0.08)] placeholder:text-white/20"
              />
            </div>

            {/* Campo: Moeda de destino */}
            <div className="flex flex-col gap-1.5 w-28">
              <label className="text-white/45 font-bold text-[11px] uppercase tracking-widest">
                Moeda
              </label>
              <select
                value={moeda}
                onChange={e => setMoeda(e.target.value)}
                required
                className="bg-[#0a1a14] border border-white/10 rounded-[10px] px-4 py-3.5 text-white font-medium text-[15px] outline-none cursor-pointer transition-colors focus:border-[#7c22d5]"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
          </div>

          {/* Campo: Nome do destinatário */}
          <div className="flex flex-col gap-1.5">
            <label className="text-white/45 font-bold text-[11px] uppercase tracking-widest">
              Nome do Destinatário
            </label>
            <input
              type="text"
              placeholder="Ex: John Smith"
              value={nomeDestinatario}
              onChange={e => setNomeDestinatario(e.target.value)}
              required
              className="bg-white/[0.06] border border-white/10 rounded-[10px] px-4 py-3.5 text-white font-medium text-[15px] outline-none w-full transition-colors focus:border-[#7c22d5] focus:bg-[rgba(124,34,213,0.08)] placeholder:text-white/20"
            />
          </div>

          {/* Campo: Banco do destinatário */}
          <div className="flex flex-col gap-1.5">
            <label className="text-white/45 font-bold text-[11px] uppercase tracking-widest">
              Banco do Destinatário
            </label>
            <input
              type="text"
              placeholder="Ex: Bank of America"
              value={bancoDestinatario}
              onChange={e => setBancoDestinatario(e.target.value)}
              required
              className="bg-white/[0.06] border border-white/10 rounded-[10px] px-4 py-3.5 text-white font-medium text-[15px] outline-none w-full transition-colors focus:border-[#7c22d5] focus:bg-[rgba(124,34,213,0.08)] placeholder:text-white/20"
            />
          </div>

          {/* Campo: Número da conta */}
          <div className="flex flex-col gap-1.5">
            <label className="text-white/45 font-bold text-[11px] uppercase tracking-widest">
              Número da Conta
            </label>
            <input
              type="text"
              placeholder="Ex: 0001234567"
              value={numeroConta}
              onChange={e => setNumeroConta(e.target.value)}
              required
              className="bg-white/[0.06] border border-white/10 rounded-[10px] px-4 py-3.5 text-white font-medium text-[15px] outline-none w-full transition-colors focus:border-[#7c22d5] focus:bg-[rgba(124,34,213,0.08)] placeholder:text-white/20"
            />
          </div>

          {/* Feedback de sucesso ou erro após submissão */}
          {resultado && (
            <Feedback
              type={resultado.tipo === 'sucesso' ? 'success' : 'error'}
              message={resultado.mensagem}
              onClose={() => setResultado(null)}
            />
          )}

          {/* Botão de envio com estado de carregamento */}
          <div className="mt-2">
            <LoadingButton
              label="Enviar"
              loadingLabel="Enviando..."
              isLoading={isLoading}
              onClick={handleEnviar}
              fullWidth
            />
          </div>
        </form>
      </div>

      {/* Rodapé de segurança */}
      <p className="mt-6 font-bold text-[10px] text-white/15 tracking-[0.12em] uppercase animate-[fadeUp_0.5s_ease_0.2s_both]">
        Protegido por UnboundCash
      </p>
    </div>
  );
}
