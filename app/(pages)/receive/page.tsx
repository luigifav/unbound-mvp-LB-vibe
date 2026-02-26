'use client';

// Página de recebimento de dinheiro
// Exibe o endereço da wallet para o usuário compartilhar com quem vai enviar
// TODO: buscar o endereço real da wallet via GET /api/wallets

import { useState } from 'react';
import Feedback from '@/components/ui/Feedback';

// TODO: substituir pelo endereço real da wallet via API
const ENDERECO_WALLET_MOCK = '0xAbCd...1234';

export default function ReceivePage() {
  // Controla a exibição do feedback de cópia (null = oculto, true = visível)
  const [feedbackCopiado, setFeedbackCopiado] = useState<boolean | null>(null);

  // Copia o endereço para a área de transferência e exibe feedback temporário
  const handleCopiarEndereco = async () => {
    await navigator.clipboard.writeText(ENDERECO_WALLET_MOCK);
    setFeedbackCopiado(true);

    // Remove o feedback após 3 segundos
    setTimeout(() => {
      setFeedbackCopiado(null);
    }, 3000);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#000904] flex flex-col items-center justify-center px-5 py-12 relative overflow-hidden">

      {/* Brilho roxo decorativo ao fundo */}
      <div className="fixed top-[-200px] left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[radial-gradient(ellipse,rgba(124,34,213,0.2)_0%,transparent_70%)] pointer-events-none" />

      {/* Card principal */}
      <div className="w-full max-w-[480px] bg-white/[0.03] border border-white/[0.08] rounded-[20px] p-9 animate-[fadeUp_0.45s_ease_0.1s_both]">

        {/* Título da página */}
        <div className="mb-8">
          <h1 className="text-white font-black text-[26px] leading-tight mb-1.5">
            Receber dinheiro
          </h1>
          <p className="text-white/45 font-medium text-sm">
            Compartilhe seu endereço para receber USDC
          </p>
        </div>

        {/* Card de instruções */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-[14px] p-5 mb-6">
          <p className="text-white/60 font-bold text-[11px] uppercase tracking-widest mb-4">
            Como receber
          </p>
          <ol className="flex flex-col gap-3">
            <li className="flex gap-3 items-start">
              {/* Número do passo */}
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[rgba(124,34,213,0.25)] border border-[rgba(124,34,213,0.4)] text-[#b06aff] text-[11px] font-black flex items-center justify-center">
                1
              </span>
              <p className="text-white/70 font-medium text-sm leading-relaxed">
                Compartilhe o endereço da sua wallet com quem vai te enviar
              </p>
            </li>
            <li className="flex gap-3 items-start">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[rgba(124,34,213,0.25)] border border-[rgba(124,34,213,0.4)] text-[#b06aff] text-[11px] font-black flex items-center justify-center">
                2
              </span>
              <p className="text-white/70 font-medium text-sm leading-relaxed">
                A rede aceita é <span className="text-white font-bold">Ethereum (ERC-20)</span>
              </p>
            </li>
            <li className="flex gap-3 items-start">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[rgba(124,34,213,0.25)] border border-[rgba(124,34,213,0.4)] text-[#b06aff] text-[11px] font-black flex items-center justify-center">
                3
              </span>
              <p className="text-white/70 font-medium text-sm leading-relaxed">
                A moeda aceita é <span className="text-white font-bold">USDC</span>
              </p>
            </li>
          </ol>
        </div>

        {/* Seção do endereço da wallet em destaque */}
        <div className="bg-[rgba(124,34,213,0.08)] border border-[rgba(124,34,213,0.25)] rounded-[14px] p-5 mb-4">
          <p className="text-white/45 font-bold text-[11px] uppercase tracking-widest mb-3">
            Seu endereço
          </p>
          {/* Endereço exibido em fonte mono para facilitar leitura */}
          <p className="text-white font-bold text-[17px] tracking-wide font-mono break-all">
            {ENDERECO_WALLET_MOCK}
          </p>
        </div>

        {/* Botão de copiar endereço */}
        <button
          onClick={handleCopiarEndereco}
          className="w-full py-3.5 px-6 rounded-[12px] bg-[#7c22d5] text-white font-bold text-sm hover:bg-[#6a1cb8] active:scale-[0.98] transition-all duration-150"
        >
          Copiar endereço
        </button>

        {/* Feedback exibido após copiar — desaparece automaticamente após 3 segundos */}
        {feedbackCopiado && (
          <div className="mt-4">
            <Feedback
              type="success"
              message="Endereço copiado!"
            />
          </div>
        )}

      </div>

      {/* Rodapé de segurança */}
      <p className="mt-6 font-bold text-[10px] text-white/15 tracking-[0.12em] uppercase animate-[fadeUp_0.5s_ease_0.2s_both]">
        Protegido por UnboundCash
      </p>
    </div>
  );
}
