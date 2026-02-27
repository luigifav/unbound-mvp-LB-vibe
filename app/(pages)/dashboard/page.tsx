// Página principal do usuário após login
// Exibe saldo e histórico de transações reais buscados via API da UnblockPay.

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "@/lib/auth";
import { getWallets, getWalletBalance, getTransactions } from "@/lib/unblockpay";
import BalanceDisplay from "@/components/ui/BalanceDisplay";
import TransactionCard from "@/components/ui/TransactionCard";
import type { Transaction } from "@/types";

export const metadata: Metadata = {
  title: "Meu Painel",
  robots: { index: false, follow: false },
};

/** Mapeia o status da UnblockPay para os tipos aceitos pelo TransactionCard */
function mapStatus(status: string): 'pending' | 'completed' | 'failed' | 'processing' {
  if (status === 'completed') return 'completed'
  if (['failed', 'refunded', 'cancelled', 'error'].includes(status)) return 'failed'
  if (status === 'processing') return 'processing'
  return 'pending' // awaiting_deposit → pending
}

/** Extrai o valor principal de uma transação (montante em USDC movimentado) */
function extrairValor(tx: Transaction): number {
  return tx.sender?.amount ?? tx.receiver?.amount ?? 0
}

export default async function DashboardPage() {
  // Busca a sessão atual no servidor — retorna null se não autenticado
  const session = await getServerSession();

  // Redireciona para login se não há sessão ativa
  if (!session) {
    redirect("/login");
  }

  const customerId = session.user.id;

  // ─── Busca saldo real ──────────────────────────────────────────
  let saldoUsdc = 0;
  const walletsResult = await getWallets(customerId);
  if (walletsResult.success && walletsResult.data && walletsResult.data.length > 0) {
    const primeiraWallet = walletsResult.data[0];
    const balanceResult = await getWalletBalance(customerId, primeiraWallet.id);
    if (balanceResult.success && balanceResult.data) {
      const entradaUsdc = balanceResult.data.balances?.find(b => b.currency === 'USDC');
      saldoUsdc = entradaUsdc?.balance ?? balanceResult.data.total_balance ?? 0;
    }
  }

  // ─── Busca transações reais ────────────────────────────────────
  const txResult = await getTransactions(customerId);
  const transacoes = txResult.success && txResult.data ? txResult.data : [];

  return (
    <main className="min-h-screen bg-[#000904] py-8 px-6">
      <div className="max-w-2xl mx-auto flex flex-col gap-8">

        {/* Título da página */}
        <h1 className="text-2xl font-black text-white tracking-tight">
          Meu Painel
        </h1>

        {/* Exibição do saldo disponível */}
        <BalanceDisplay
          balance={saldoUsdc}
          currency="USDC"
          isLoading={false}
        />

        {/* Botões de ação rápida lado a lado */}
        <div className="flex gap-4">
          <Link
            href="/send"
            className="flex-1 text-center py-3 px-6 rounded-xl bg-[#7c22d5] text-white font-bold text-sm hover:bg-[#6a1cb8] transition-colors duration-150"
          >
            Enviar dinheiro
          </Link>
          <Link
            href="/receive"
            className="flex-1 text-center py-3 px-6 rounded-xl bg-[rgba(124,34,213,0.15)] border border-[rgba(124,34,213,0.35)] text-white font-bold text-sm hover:bg-[rgba(124,34,213,0.25)] transition-colors duration-150"
          >
            Receber dinheiro
          </Link>
        </div>

        {/* Seção de transações recentes */}
        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-bold text-white">
            Transações recentes
          </h2>

          {transacoes.length === 0 ? (
            <p className="text-white/40 text-sm">
              Nenhuma transação ainda. Envie ou receba dinheiro para começar.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {transacoes.map((tx) => (
                <TransactionCard
                  key={tx.id}
                  id={tx.id}
                  type={tx.type === 'on_ramp' ? 'payin' : 'payout'}
                  amount={extrairValor(tx)}
                  currency="USDC"
                  status={mapStatus(tx.status)}
                  createdAt={tx.created_at}
                />
              ))}
            </div>
          )}
        </section>

      </div>
    </main>
  );
}
