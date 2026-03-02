"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, TrendingUp } from "lucide-react";

const RATES: Record<string, Record<string, number>> = {
  USD: { BRL: 5.78, EUR: 0.92, GBP: 0.79 },
  EUR: { BRL: 6.28, USD: 1.09, GBP: 0.86 },
  GBP: { BRL: 7.31, USD: 1.27, EUR: 1.16 },
};

const CURRENCIES = [
  { code: "USD", flag: "🇺🇸", label: "Dólar" },
  { code: "EUR", flag: "🇪🇺", label: "Euro" },
  { code: "GBP", flag: "🇬🇧", label: "Libra" },
  { code: "BRL", flag: "🇧🇷", label: "Real" },
];

const FEE_PERCENT = 1.5;

function formatCurrency(value: number, code: string) {
  if (code === "BRL") {
    return new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export default function CurrencyConverter() {
  const [sendAmount, setSendAmount] = useState("1000");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("BRL");

  const numericAmount = parseFloat(sendAmount.replace(/,/g, "").replace(/\./g, "")) || 0;
  const rate = RATES[fromCurrency]?.[toCurrency] ?? 1;
  const fee = numericAmount * (FEE_PERCENT / 100);
  const receiveAmount = numericAmount * rate;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    setSendAmount(raw);
  };

  const displaySendAmount = numericAmount
    ? formatCurrency(numericAmount, fromCurrency)
    : "";

  const sendOptions = CURRENCIES.filter((c) => c.code !== toCurrency);
  const receiveOptions = CURRENCIES.filter((c) => c.code !== fromCurrency);

  return (
    <div className="w-full max-w-[540px] mx-auto">
      <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 sm:p-7 backdrop-blur-sm relative overflow-hidden">
        {/* Subtle glow accent */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-[radial-gradient(circle,rgba(124,34,213,0.15)_0%,transparent_70%)] pointer-events-none" />

        {/* Currency panels */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch relative">
          {/* Send panel */}
          <div className="flex-1 bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 transition-colors hover:border-white/[0.1]">
            <span className="block text-[11px] font-bold tracking-[0.12em] uppercase text-white/40 mb-3">
              Você envia
            </span>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg leading-none">
                {CURRENCIES.find((c) => c.code === fromCurrency)?.flag}
              </span>
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="bg-transparent text-white font-bold text-sm outline-none cursor-pointer appearance-none pr-4"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='none'%3E%3Cpath d='M1 1l4 4 4-4' stroke='rgba(255,255,255,0.4)' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right center",
                }}
              >
                {sendOptions.map((c) => (
                  <option key={c.code} value={c.code} className="bg-[#0a1a14] text-white">
                    {c.code}
                  </option>
                ))}
              </select>
            </div>
            <input
              type="text"
              inputMode="numeric"
              value={displaySendAmount}
              onChange={handleAmountChange}
              placeholder="0.00"
              className="bg-transparent text-white text-2xl sm:text-[28px] font-black outline-none w-full placeholder:text-white/15 tracking-tight"
            />
          </div>

          {/* Arrow separator */}
          <div className="flex items-center justify-center sm:self-center shrink-0">
            <div className="w-10 h-10 rounded-full bg-[#7c22d5]/20 border border-[#7c22d5]/40 flex items-center justify-center rotate-90 sm:rotate-0">
              <ArrowRight size={16} className="text-[#7c22d5]" />
            </div>
          </div>

          {/* Receive panel */}
          <div className="flex-1 bg-[rgba(124,34,213,0.06)] border border-[rgba(124,34,213,0.15)] rounded-xl p-4">
            <span className="block text-[11px] font-bold tracking-[0.12em] uppercase text-white/40 mb-3">
              Destinatário recebe
            </span>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg leading-none">
                {CURRENCIES.find((c) => c.code === toCurrency)?.flag}
              </span>
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="bg-transparent text-white font-bold text-sm outline-none cursor-pointer appearance-none pr-4"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='none'%3E%3Cpath d='M1 1l4 4 4-4' stroke='rgba(255,255,255,0.4)' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right center",
                }}
              >
                {receiveOptions.map((c) => (
                  <option key={c.code} value={c.code} className="bg-[#0a1a14] text-white">
                    {c.code}
                  </option>
                ))}
              </select>
            </div>
            <span className="block text-2xl sm:text-[28px] font-black text-white tracking-tight">
              {receiveAmount > 0
                ? formatCurrency(receiveAmount, toCurrency)
                : "0,00"}
            </span>
          </div>
        </div>

        {/* Rate & fee info */}
        <div className="flex flex-wrap items-center justify-between gap-2 mt-4 px-1">
          <div className="flex items-center gap-1.5 text-white/45 text-xs font-medium">
            <TrendingUp size={13} className="text-[#7c22d5]" />
            <span>
              1 {fromCurrency} = {rate.toFixed(2)} {toCurrency}
            </span>
          </div>
          <span className="text-white/30 text-xs font-medium">
            Taxa: {formatCurrency(fee, fromCurrency)} ({FEE_PERCENT}%)
          </span>
        </div>

        {/* CTA */}
        <Link
          href="/register"
          className="mt-5 w-full py-4 bg-[#7c22d5] hover:bg-[#6a1cb8] rounded-xl text-white font-black text-[15px] tracking-wide transition-all duration-200 flex items-center justify-center gap-2 no-underline group"
        >
          Enviar agora
          <ArrowRight
            size={16}
            className="transition-transform duration-200 group-hover:translate-x-1"
          />
        </Link>
      </div>
    </div>
  );
}
