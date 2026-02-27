// Página principal do usuário após login
// Exibe saldo e lista de transações recentes com dados mock.
// TODO: Substituir todos os dados mock pela chamada real à API quando a integração
// com o backend estiver pronta. Buscar saldo via GET /api/wallets e
// transações via GET /api/transactions.

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Meu Painel",
  robots: { index: false, follow: false },
};
import BalanceDisplay from "@/components/ui/BalanceDisplay";
import TransactionCard from "@/components/ui/TransactionCard";

// Dados mock do saldo — TODO: substituir pelo dado real da API
const mockSaldo = {
  balance: 1250.75,
  currency: "USDC",
  isLoading: false,
};

// Dados mock das transações recentes — TODO: substituir pelo dado real da API
const mockTransacoes = [
  {
    id: "txn-001", // TODO: substituir pelo dado real da API
    type: "payin" as const,
    amount: 500.0, // TODO: substituir pelo dado real da API
    currency: "USDC",
    status: "completed" as const,
    createdAt: "2026-02-24T14:30:00Z", // TODO: substituir pelo dado real da API
  },
  {
    id: "txn-002", // TODO: substituir pelo dado real da API
    type: "payout" as const,
    amount: 200.5, // TODO: substituir pelo dado real da API
    currency: "USDC",
    status: "pending" as const,
    createdAt: "2026-02-23T09:15:00Z", // TODO: substituir pelo dado real da API
  },
  {
    id: "txn-003", // TODO: substituir pelo dado real da API
    type: "payout" as const,
    amount: 1000.0, // TODO: substituir pelo dado real da API
    currency: "USDC",
    status: "processing" as const,
    createdAt: "2026-02-22T17:45:00Z", // TODO: substituir pelo dado real da API
  },
];

export default async function DashboardPage() {
  // Busca a sessão atual no servidor — retorna null se não autenticado
  const session = await getServerSession();

  // Redireciona para login se não há sessão ativa
  if (!session) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-[#000904] py-8 px-6">
      <div className="max-w-2xl mx-auto flex flex-col gap-8">

        {/* Título da página */}
        <h1 className="text-2xl font-black text-white tracking-tight">
          Meu Painel
        </h1>

        {/* Exibição do saldo disponível */}
        <BalanceDisplay
          balance={mockSaldo.balance}
          currency={mockSaldo.currency}
          isLoading={mockSaldo.isLoading}
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

          <div className="flex flex-col gap-3">
            {mockTransacoes.map((transacao) => (
              <TransactionCard
                key={transacao.id}
                id={transacao.id}
                type={transacao.type}
                amount={transacao.amount}
                currency={transacao.currency}
                status={transacao.status}
                createdAt={transacao.createdAt}
              />
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
