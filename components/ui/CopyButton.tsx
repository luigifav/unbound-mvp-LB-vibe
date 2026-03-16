'use client';

import { useState } from 'react';
import Feedback from '@/components/ui/Feedback';

interface CopyButtonProps {
  enderecoWallet: string;
}

export default function CopyButton({ enderecoWallet }: CopyButtonProps) {
  const [feedbackCopiado, setFeedbackCopiado] = useState<boolean | null>(null);

  const handleCopiarEndereco = async () => {
    await navigator.clipboard.writeText(enderecoWallet);
    setFeedbackCopiado(true);
    setTimeout(() => {
      setFeedbackCopiado(null);
    }, 3000);
  };

  return (
    <>
      <button
        onClick={handleCopiarEndereco}
        className="w-full py-3.5 px-6 rounded-[12px] bg-[#9523ef] text-white font-bold text-sm hover:bg-[#7a1bc9] active:scale-[0.98] transition-all duration-150"
      >
        Copiar endereço
      </button>

      {feedbackCopiado && (
        <div className="mt-4">
          <Feedback type="success" message="Endereço copiado!" />
        </div>
      )}
    </>
  );
}
