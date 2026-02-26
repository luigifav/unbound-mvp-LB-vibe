'use client';

// Botão de copiar endereço da wallet — Client Component
// Separado do Server Component (page.tsx) pois usa navigator.clipboard,
// que é uma API do browser e só funciona no lado do cliente.

import { useState } from 'react';
import Feedback from '@/components/ui/Feedback';

interface CopyButtonProps {
  /** Endereço da wallet que será copiado para a área de transferência */
  enderecoWallet: string;
}

export default function CopyButton({ enderecoWallet }: CopyButtonProps) {
  // Controla a exibição do feedback de cópia (null = oculto, true = visível)
  const [feedbackCopiado, setFeedbackCopiado] = useState<boolean | null>(null);

  // Copia o endereço para a área de transferência e exibe feedback temporário
  const handleCopiarEndereco = async () => {
    await navigator.clipboard.writeText(enderecoWallet);
    setFeedbackCopiado(true);

    // Remove o feedback após 3 segundos
    setTimeout(() => {
      setFeedbackCopiado(null);
    }, 3000);
  };

  return (
    <>
      <button
        onClick={handleCopiarEndereco}
        className="w-full py-3.5 px-6 rounded-[12px] bg-[#7c22d5] text-white font-bold text-sm hover:bg-[#6a1cb8] active:scale-[0.98] transition-all duration-150"
      >
        Copiar endereço
      </button>

      {/* Feedback exibido após copiar — desaparece automaticamente após 3 segundos */}
      {feedbackCopiado && (
        <div className="mt-4">
          <Feedback type="success" message="Endereço copiado!" />
        </div>
      )}
    </>
  );
}
