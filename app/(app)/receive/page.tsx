// Página de recebimento de dinheiro — Server Component
// Busca o endereço real da wallet no servidor antes de renderizar a página.
// O botão de copiar é delegado ao CopyButton (Client Component) por usar navigator.clipboard.

import { getServerSession } from '@/lib/auth';
import { getWallets } from '@/lib/unblockpay';
import Feedback from '@/components/ui/Feedback';
import CopyButton from '@/components/ui/CopyButton';

export default async function ReceivePage() {
  // Busca a sessão do usuário logado — contém o customerId necessário para a API
  const sessao = await getServerSession();

  let enderecoWallet: string | null = null;
  let erroMensagem: string | null = null;

  if (!sessao?.user?.id) {
    // Usuário não autenticado ou sessão expirada
    erroMensagem = 'Não foi possível identificar o usuário. Faça login novamente.';
  } else {
    // Busca as wallets do cliente usando o customerId da sessão
    const resultado = await getWallets(sessao.user.id);

    if (!resultado.success || !resultado.data || resultado.data.length === 0) {
      erroMensagem =
        'Não foi possível carregar o endereço da sua wallet. Tente novamente mais tarde.';
    } else {
      // Usa o endereço da primeira wallet disponível
      enderecoWallet = resultado.data[0].address;
    }
  }

  return (
    <div className="min-h-screen bg-[#000904] flex flex-col items-center justify-center px-5 py-12 relative overflow-hidden">

      {/* Brilho roxo decorativo ao fundo */}
      <div className="fixed top-[-200px] left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[radial-gradient(ellipse,rgba(124,34,213,0.2)_0%,transparent_70%)] pointer-events-none z-0" />

      {/* Card principal */}
      <div className="relative z-10 w-full max-w-[480px] bg-white/[0.03] border border-white/[0.08] rounded-[20px] p-9 animate-[fadeUp_0.45s_ease_0.1s_both]">

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

        {/* Mensagem de erro amigável exibida quando a busca da wallet falha */}
        {erroMensagem && (
          <Feedback type="error" message={erroMensagem} />
        )}

        {/* Seção do endereço da wallet — só exibida quando o endereço foi carregado com sucesso */}
        {enderecoWallet && (
          <>
            <div className="bg-[rgba(124,34,213,0.08)] border border-[rgba(124,34,213,0.25)] rounded-[14px] p-5 mb-4">
              <p className="text-white/45 font-bold text-[11px] uppercase tracking-widest mb-3">
                Seu endereço
              </p>
              {/* Endereço exibido em fonte mono para facilitar leitura */}
              <p className="text-white font-bold text-[17px] tracking-wide font-mono break-all">
                {enderecoWallet}
              </p>
            </div>

            {/* Botão de copiar — Client Component que recebe o endereço como prop */}
            <CopyButton enderecoWallet={enderecoWallet} />
          </>
        )}

      </div>

      {/* Rodapé de segurança */}
      <p className="relative z-10 mt-6 font-bold text-[10px] text-white/15 tracking-[0.12em] uppercase animate-[fadeUp_0.5s_ease_0.2s_both]">
        Protegido por UnboundCash
      </p>
    </div>
  );
}
