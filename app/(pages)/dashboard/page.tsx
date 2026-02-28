"use client";

import { useState } from "react";
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
} from "lucide-react";

/* ═══════════════════════════════════════════════
   MOCK DATA
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

const transactions = [
  {
    date: "28 fev 2026, 14:32",
    type: "Envio" as const,
    pair: "USD → BRL",
    amount: "$500,00",
    fee: "$2,50",
    status: "Concluído" as const,
  },
  {
    date: "27 fev 2026, 09:15",
    type: "Recebimento" as const,
    pair: "EUR → USD",
    amount: "€200,00",
    fee: "€1,00",
    status: "Concluído" as const,
  },
  {
    date: "26 fev 2026, 18:04",
    type: "Envio" as const,
    pair: "USD → BRL",
    amount: "$1.000,00",
    fee: "$5,00",
    status: "Processando" as const,
  },
  {
    date: "25 fev 2026, 11:22",
    type: "Envio" as const,
    pair: "USD → EUR",
    amount: "$300,00",
    fee: "$1,50",
    status: "Pendente" as const,
  },
  {
    date: "24 fev 2026, 07:50",
    type: "Recebimento" as const,
    pair: "BRL → USD",
    amount: "R$ 2.500,00",
    fee: "R$ 12,50",
    status: "Falhou" as const,
  },
];

const navLinks = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard", active: true },
  { label: "Enviar", icon: ArrowUpRight, href: "/send", active: false },
  { label: "Receber", icon: ArrowDownLeft, href: "/receive", active: false },
  { label: "Destinatários", icon: Users, href: "/recipients", active: false },
  { label: "Histórico", icon: Clock, href: "/history", active: false },
  { label: "Perfil", icon: UserCircle, href: "/profile", active: false },
];

const statusStyles: Record<string, string> = {
  Concluído: "bg-green-500/10 text-green-400",
  Processando: "bg-blue-500/10 text-blue-400",
  Pendente: "bg-yellow-500/10 text-yellow-400",
  Falhou: "bg-red-500/10 text-red-400",
};

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
   MAIN DASHBOARD COMPONENT
   ═══════════════════════════════════════════════ */

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex h-screen overflow-hidden bg-gray-950">
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
            {/* Bell with notification dot */}
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
                {/* Top row */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-2xl">{b.flag}</span>
                    <span className="text-sm text-gray-400">{b.name}</span>
                  </div>
                  <span className="text-xs font-mono bg-gray-800 text-gray-300 px-2 py-1 rounded-lg">
                    {b.code}
                  </span>
                </div>

                {/* Balance */}
                <div>
                  <p className="text-2xl font-bold text-white mt-1">{b.balance}</p>
                  <p className={`text-xs mt-1 ${b.changeColor}`}>{b.change}</p>
                </div>

                {/* Add funds */}
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

            {/* Rates */}
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

        {/* ── RECENT TRANSACTIONS ── */}
        <section className="px-8 pb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-white">
              Transações recentes
            </h2>
            <Link
              href="/history"
              className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
            >
              Ver todas →
            </Link>
          </div>

          <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-800/50 text-gray-400 text-xs uppercase tracking-wider">
                  <th className="px-6 py-3 text-left font-medium">Data</th>
                  <th className="px-6 py-3 text-left font-medium">Tipo</th>
                  <th className="px-6 py-3 text-left font-medium">De → Para</th>
                  <th className="px-6 py-3 text-left font-medium">Valor</th>
                  <th className="px-6 py-3 text-left font-medium">Taxa</th>
                  <th className="px-6 py-3 text-left font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, i) => (
                  <tr
                    key={i}
                    className="border-t border-gray-800 hover:bg-gray-800/50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 text-gray-300 whitespace-nowrap">
                      {tx.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="flex items-center gap-1.5">
                        {tx.type === "Envio" ? (
                          <>
                            <ArrowUpRight className="w-3 h-3 text-orange-400" />
                            <span className="text-orange-400">{tx.type}</span>
                          </>
                        ) : (
                          <>
                            <ArrowDownLeft className="w-3 h-3 text-green-400" />
                            <span className="text-green-400">{tx.type}</span>
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-300 whitespace-nowrap">
                      {tx.pair}
                    </td>
                    <td className="px-6 py-4 text-gray-300 whitespace-nowrap">
                      {tx.amount}
                    </td>
                    <td className="px-6 py-4 text-gray-300 whitespace-nowrap">
                      {tx.fee}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[tx.status]}`}
                      >
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
