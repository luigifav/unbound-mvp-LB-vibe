"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  ArrowUpRight,
  ArrowDownLeft,
  Users,
  Clock,
  UserCircle,
  LogOut,
  Bell,
  RefreshCw,
  Menu,
  X,
  Send,
} from "lucide-react";
import type { CompositeTransaction, CompositeTransactionStatus } from "@/types";

/* ═══════════════════════════════════════════════
   MOCK DATA (saldos e câmbio permanecem estáticos)
   ═══════════════════════════════════════════════ */

const balances = [
  {
    flag: "🇺🇸",
    name: "Dólar Americano",
    code: "USD",
    balance: "$2,450.00",
    change: "+$120.00 este mês",
    changeColor: "text-green-400",
  },
  {
    flag: "🇧🇷",
    name: "Real Brasileiro",
    code: "BRL",
    balance: "R$ 13.284,50",
    change: "+R$ 650,00 este mês",
    changeColor: "text-green-400",
  },
  {
    flag: "🇪🇺",
    name: "Euro",
    code: "EUR",
    balance: "€890.00",
    change: "Sem movimentação",
    changeColor: "text-gray-500",
  },
];

const exchangeRates = [
  { from: "USD", to: "BRL", value: "R$ 5,42" },
  { from: "EUR", to: "BRL", value: "R$ 5,89" },
  { from: "GBP", to: "BRL", value: "R$ 6,71" },
  { from: "CAD", to: "BRL", value: "R$ 3,98" },
];

const navLinks = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard", active: true },
  { label: "Enviar", icon: ArrowUpRight, href: "/send", active: false },
  { label: "Receber", icon: ArrowDownLeft, href: "/receive", active: false },
  { label: "Destinatários", icon: Users, href: "/external-accounts", active: false },
  { label: "Histórico", icon: Clock, href: "/history", active: false },
  { label: "Perfil", icon: UserCircle, href: "/profile", active: false },
];

/* ═══════════════════════════════════════════════
   UTILITÁRIOS DE HISTÓRICO
   ═══════════════════════════════════════════════ */

// Traduz o status da transação composta para português, sem mencionar cripto
const statusLabel: Record<CompositeTransactionStatus, string> = {
  pending_deposit: "Aguardando Pix",
  converting:      "Processando",
  sending:         "A caminho",
  completed:       "Concluído",
  failed:          "Falhou",
  refunded:        "Reembolsado",
};

// Estilos de cor por status
const statusStyles: Record<CompositeTransactionStatus, string> = {
  pending_deposit: "bg-yellow-500/10 text-yellow-400",
  converting:      "bg-blue-500/10 text-blue-400",
  sending:         "bg-purple-500/10 text-purple-400",
  completed:       "bg-green-500/10 text-green-400",
  failed:          "bg-red-500/10 text-red-400",
  refunded:        "bg-gray-500/10 text-gray-400",
};

// Formata a data para "Hoje, 14:32", "Ontem, 09:15" ou "25/02/2026, 11:22"
function formatarData(isoString: string): string {
  const data = new Date(isoString);
  const agora = new Date();

  const mesmoDia = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const ontem = new Date(agora);
  ontem.setDate(agora.getDate() - 1);

  const hora = data.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (mesmoDia(data, agora)) return `Hoje, ${hora}`;
  if (mesmoDia(data, ontem)) return `Ontem, ${hora}`;

  return data.toLocaleDateString("pt-BR") + ", " + hora;
}

/* ═══════════════════════════════════════════════
   SIDEBAR
   ═══════════════════════════════════════════════ */

function Sidebar({ onClose }: { onClose?: () => void }) {
  return (
    <aside className="w-64 h-full flex flex-col bg-gray-900 border-r border-gray-800 shrink-0">
      {/* Logo */}
      <div className="flex items-center justify-between px-6 pt-8 pb-6">
        <span className="text-xl font-bold text-purple-500">UnboundCash</span>
        {onClose && (
          <button onClick={onClose} className="text-gray-400 hover:text-white md:hidden">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex flex-col gap-1 px-3">
        {navLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.label}
              href={link.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                link.active
                  ? "bg-purple-600/20 text-purple-400"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Sair */}
      <div className="mt-auto px-3 pb-6">
        <Link
          href="/login"
          onClick={onClose}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sair
        </Link>
      </div>
    </aside>
  );
}

/* ═══════════════════════════════════════════════
   SEÇÃO DE HISTÓRICO DE ENVIOS
   ═══════════════════════════════════════════════ */

function HistoricoEnvios() {
  const [transacoes, setTransacoes] = useState<CompositeTransaction[]>([]);
  const [carregando, setCarregando] = useState(true);

  // Busca o histórico de transações compostas ao montar o componente
  useEffect(() => {
    async function buscarHistorico() {
      try {
        const resposta = await fetch("/api/transactions/history");
        if (!resposta.ok) return;
        const dados = await resposta.json();
        setTransacoes(dados.transacoes ?? []);
      } catch {
        // Falha silenciosa — a seção simplesmente ficará vazia
      } finally {
        setCarregando(false);
      }
    }

    buscarHistorico();
  }, []);

  // Exibe skeleton enquanto carrega
  if (carregando) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-gray-900 border border-gray-800 rounded-2xl p-4 animate-pulse"
          >
            <div className="h-4 bg-gray-800 rounded w-1/3 mb-3" />
            <div className="h-3 bg-gray-800 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  // Estado vazio — incentiva o primeiro envio
  if (transacoes.length === 0) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 flex flex-col items-center gap-3 text-center">
        <Send className="w-10 h-10 text-gray-600" />
        <p className="text-gray-400 text-sm">
          Nenhum envio ainda. Que tal enviar agora?
        </p>
        <Link
          href="/send"
          className="mt-1 px-5 py-2 rounded-xl text-sm font-medium bg-purple-600 hover:bg-purple-700 text-white transition-colors"
        >
          Enviar dinheiro
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transacoes.map((tx) => (
        // Cada item leva para a página de detalhe da transação composta
        <Link
          key={tx.id}
          href={`/send/${tx.id}`}
          className="block bg-gray-900 border border-gray-800 rounded-2xl p-4 hover:border-gray-700 hover:bg-gray-800/60 transition-colors"
        >
          {/* Linha superior: destinatário + status */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-white truncate pr-3">
              Enviado para {tx.recipientName}
            </span>
            <span
              className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[tx.status]}`}
            >
              {statusLabel[tx.status]}
            </span>
          </div>

          {/* Linha inferior: valor + data */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">
              {/* Valor enviado em BRL → estimativa na moeda de destino */}
              R$ {tx.amount.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              → {tx.receiverCurrency} estimado
            </span>
            <span className="text-xs text-gray-500 ml-3 shrink-0">
              {formatarData(tx.createdAt)}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN DASHBOARD COMPONENT
   ═══════════════════════════════════════════════ */

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-950">
      {/* ── Desktop sidebar ── */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* ── Mobile sidebar drawer ── */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 md:hidden">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </>
      )}

      {/* ── Main content ── */}
      <div className="flex-1 overflow-y-auto">
        {/* ── HEADER ── */}
        <header className="flex items-center justify-between px-8 py-6 border-b border-gray-800">
          <div className="flex items-center gap-4">
            {/* Mobile hamburger */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-400 hover:text-white md:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-white">
                Bom dia, Bruno 👋
              </h1>
              <p className="text-sm text-gray-400">
                Aqui está o resumo da sua conta
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Sino com ponto de notificação */}
            <button className="relative text-gray-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-red-500" />
            </button>

            {/* Avatar */}
            <div className="w-9 h-9 rounded-full bg-purple-700 flex items-center justify-center text-white text-sm font-bold">
              B
            </div>
          </div>
        </header>

        {/* ── BALANCE CARDS ── */}
        <section className="px-8 py-6">
          <h2 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider">
            Seus saldos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {balances.map((b) => (
              <div
                key={b.code}
                className="bg-gray-900 rounded-2xl p-6 flex flex-col gap-4 border border-gray-800"
              >
                {/* Topo: bandeira + código */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-2xl">{b.flag}</span>
                    <span className="text-sm text-gray-400">{b.name}</span>
                  </div>
                  <span className="text-xs font-mono bg-gray-800 text-gray-300 px-2 py-1 rounded-lg">
                    {b.code}
                  </span>
                </div>

                {/* Saldo */}
                <div>
                  <p className="text-2xl font-bold text-white mt-1">{b.balance}</p>
                  <p className={`text-xs mt-1 ${b.changeColor}`}>{b.change}</p>
                </div>

                {/* Adicionar fundos */}
                <button className="w-full mt-2 py-2 rounded-xl text-sm font-medium border border-gray-700 text-gray-300 hover:border-purple-500 hover:text-purple-400 transition-colors">
                  + Adicionar fundos
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* ── QUICK ACTIONS ── */}
        <section className="px-8 pb-6">
          <div className="flex gap-3 flex-wrap">
            <Link
              href="/send"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors bg-purple-600 hover:bg-purple-700 text-white"
            >
              <ArrowUpRight className="w-4 h-4" />
              Enviar dinheiro
            </Link>
            <Link
              href="/receive"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors bg-gray-800 hover:bg-gray-700 text-white border border-gray-700"
            >
              <ArrowDownLeft className="w-4 h-4" />
              Receber
            </Link>
            <Link
              href="/history"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors bg-gray-800 hover:bg-gray-700 text-white border border-gray-700"
            >
              <Clock className="w-4 h-4" />
              Ver histórico
            </Link>
          </div>
        </section>

        {/* ── EXCHANGE RATE TICKER ── */}
        <section className="mx-8 mb-6 bg-gray-900 border border-gray-800 rounded-2xl px-6 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            {/* Label */}
            <span className="text-xs text-gray-500 uppercase tracking-wider">
              Câmbio ao vivo
            </span>

            {/* Taxas */}
            <div className="flex items-center gap-6 flex-wrap">
              {exchangeRates.map((rate, i) => (
                <div key={rate.from + rate.to} className="flex items-center gap-6">
                  {i > 0 && <div className="w-px h-4 bg-gray-700" />}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">
                      {rate.from} → {rate.to}
                    </span>
                    <span className="text-sm font-semibold text-white">
                      {rate.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Timestamp */}
            <div className="flex items-center gap-1.5">
              <RefreshCw className="w-3 h-3 text-gray-500" />
              <span className="text-xs text-gray-500">Atualizado há 2 min</span>
            </div>
          </div>
        </section>

        {/* ── HISTÓRICO DE ENVIOS (transações compostas reais) ── */}
        <section className="px-8 pb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-white">
              Seus envios
            </h2>
            <Link
              href="/history"
              className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
            >
              Ver todos →
            </Link>
          </div>

          {/* Lista dinâmica de transações compostas */}
          <HistoricoEnvios />
        </section>
      </div>
    </div>
  );
}
