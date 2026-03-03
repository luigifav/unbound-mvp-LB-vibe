// Página de detalhes de uma transação específica — Server Component
// Busca os dados reais via UnblockPay API e exibe status, valor e metadados.

import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "@/lib/auth";
import { getTransaction } from "@/lib/unblockpay";
import StatusBadge from "@/components/ui/StatusBadge";

/** Mapeia o status da UnblockPay para os tipos aceitos pelo StatusBadge */
function mapStatus(status: string): 'pending' | 'completed' | 'failed' | 'processing' {
  if (status === 'completed') return 'completed'
  if (['failed', 'refunded', 'cancelled', 'error'].includes(status)) return 'failed'
  if (status === 'processing') return 'processing'
  return 'pending'
}

export default async function TransactionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  // Protege a rota — redireciona para login se não autenticado
  const session = await getServerSession();
  if (!session) redirect("/login");

  const { id } = await params;

  // Busca os dados reais da transação na UnblockPay
  const resultado = await getTransaction(id);

  if (!resultado.success || !resultado.data) {
    notFound();
  }

  const tx = resultado.data;
  const isPayin = tx.type === 'on_ramp';
  const statusMapped = mapStatus(tx.status);
  const valor = tx.sender?.amount ?? tx.receiver?.amount ?? 0;

  return (
    <div className="min-h-screen bg-[#000904] flex flex-col items-center justify-center px-5 py-12 relative overflow-hidden">

      {/* Brilho roxo decorativo */}
      <div className="fixed top-[-200px] left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[radial-gradient(ellipse,rgba(124,34,213,0.2)_0%,transparent_70%)] pointer-events-none z-0" />

      {/* Card principal */}
      <div className="relative z-10 w-full max-w-[480px] flex flex-col gap-6 animate-[fadeUp_0.45s_ease_0.1s_both]">

        {/* Link de voltar */}
        <Link href="/dashboard" className="text-white/40 hover:text-white/70 text-sm font-medium transition-colors w-fit">
          ← Voltar ao painel
        </Link>

        {/* Card de detalhes */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-[20px] p-8 flex flex-col gap-6">

          {/* Cabeçalho: tipo + status */}
          <div className="flex items-center justify-between">
            <span className="text-white/50 font-bold text-sm">
              {isPayin ? '↓ Recebimento' : '↑ Envio'}
            </span>
            <StatusBadge status={statusMapped} />
          </div>

          {/* Valor em destaque */}
          <div>
            <p className="text-white/45 font-bold text-[11px] uppercase tracking-widest mb-2">
              Valor
            </p>
            <p className="text-white font-black text-[38px] leading-none">
              {valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
              <span className="text-white/35 text-xl font-bold ml-2">USDC</span>
            </p>
          </div>

          {/* Divisor */}
          <hr className="border-white/[0.06]" />

          {/* Metadados */}
          <div className="flex flex-col gap-4">

            {/* ID da transação */}
            <div>
              <p className="text-white/45 font-bold text-[11px] uppercase tracking-widest mb-1">
                ID da Transação
              </p>
              <p className="text-white/70 font-mono text-sm break-all">{tx.id}</p>
            </div>

            {/* Tipo */}
            <div>
              <p className="text-white/45 font-bold text-[11px] uppercase tracking-widest mb-1">
                Tipo
              </p>
              <p className="text-white/70 text-sm font-medium">
                {isPayin ? 'Pay-in (Recebimento)' : 'Payout (Envio)'}
              </p>
            </div>

            {/* Data de criação */}
            {tx.created_at && (
              <div>
                <p className="text-white/45 font-bold text-[11px] uppercase tracking-widest mb-1">
                  Criada em
                </p>
                <p className="text-white/70 text-sm font-medium">
                  {new Date(tx.created_at).toLocaleString('pt-BR')}
                </p>
              </div>
            )}

            {/* Data de conclusão */}
            {tx.finished_at && (
              <div>
                <p className="text-white/45 font-bold text-[11px] uppercase tracking-widest mb-1">
                  Concluída em
                </p>
                <p className="text-white/70 text-sm font-medium">
                  {new Date(tx.finished_at).toLocaleString('pt-BR')}
                </p>
              </div>
            )}

            {/* Instruções de depósito (pay-in aguardando) */}
            {tx.sender_deposit_instructions && (
              <div className="bg-[rgba(124,34,213,0.08)] border border-[rgba(124,34,213,0.2)] rounded-[12px] p-4">
                <p className="text-white/45 font-bold text-[11px] uppercase tracking-widest mb-3">
                  Instruções de Depósito
                </p>
                <p className="text-white/60 text-sm font-medium mb-1">
                  Envie <span className="text-white font-bold">{tx.sender_deposit_instructions.amount} {tx.sender_deposit_instructions.currency}</span> via {tx.sender_deposit_instructions.payment_rail.toUpperCase()} para:
                </p>
                <p className="text-white font-mono text-sm break-all">
                  {tx.sender_deposit_instructions.deposit_address}
                </p>
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
}
