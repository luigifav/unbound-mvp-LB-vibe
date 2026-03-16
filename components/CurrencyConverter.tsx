"use client";

import { useState, useCallback } from "react";

const BR_FLAG = (
  <svg viewBox="0 0 24 24" width="22" height="22" className="rounded-full shrink-0">
    <rect width="24" height="24" rx="12" fill="#009c3b" />
    <polygon points="12,3 22,12 12,21 2,12" fill="#ffdf00" />
    <circle cx="12" cy="12" r="5" fill="#002776" />
    <path d="M7 12.5 Q12 10 17 12.5" stroke="#fff" strokeWidth="0.8" fill="none" />
  </svg>
);

const US_FLAG = (
  <svg viewBox="0 0 24 24" width="22" height="22" className="rounded-full shrink-0">
    <rect width="24" height="24" rx="12" fill="#b22234" />
    <rect y="3.7" width="24" height="1.85" fill="#fff" />
    <rect y="7.4" width="24" height="1.85" fill="#b22234" />
    <rect y="11.1" width="24" height="1.85" fill="#fff" />
    <rect y="14.8" width="24" height="1.85" fill="#b22234" />
    <rect y="18.5" width="24" height="1.85" fill="#fff" />
    <rect width="10" height="12" fill="#3c3b6e" />
  </svg>
);

const RATE = 5.23;

export default function CurrencyConverter() {
  const [brlValue, setBrlValue] = useState("10.000");

  const formatBRL = (raw: string) => {
    const cleaned = raw.replace(/\./g, "").replace(",", ".");
    return parseFloat(cleaned);
  };

  const getUsdValue = useCallback(() => {
    const val = formatBRL(brlValue);
    if (isNaN(val) || val <= 0) return "";
    return (val / RATE).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }, [brlValue]);

  return (
    <div className="bg-white rounded-3xl border border-[#e8e0f0] p-12 shadow-[0_20px_60px_rgba(0,0,0,0.1),0_0_80px_rgba(149,35,239,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.1),0_0_100px_rgba(149,35,239,0.15)]">
      {/* BRL input */}
      <div className="flex justify-between items-center mb-2.5">
        <span className="text-base font-medium text-[#52525b]">Você envia</span>
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#f3eef9] rounded-full text-sm font-semibold text-[#a1a1aa]">
          {BR_FLAG} BRL
        </span>
      </div>
      <div className="flex items-baseline mb-6">
        <span className="text-[clamp(36px,5vw,52px)] font-[800] text-[#0a0a0a] mr-1.5" style={{ letterSpacing: "-0.02em" }}>
          R$
        </span>
        <input
          type="text"
          value={brlValue}
          onChange={(e) => setBrlValue(e.target.value)}
          className="text-[clamp(36px,5vw,52px)] font-[800] text-[#0a0a0a] bg-transparent border-none outline-none w-full"
          style={{ letterSpacing: "-0.02em", fontFamily: "inherit" }}
        />
      </div>

      {/* Toggle */}
      <div className="flex justify-center py-2.5">
        <button className="w-[52px] h-[52px] rounded-full border border-[#e8e0f0] bg-white flex items-center justify-center cursor-pointer text-[#52525b] hover:border-[#9523ef] hover:text-[#9523ef] hover:scale-110 transition-all duration-200">
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M10 3v14M6 7l4-4 4 4M6 13l4 4 4-4" />
          </svg>
        </button>
      </div>

      {/* USD output */}
      <div className="flex justify-between items-center mb-2.5">
        <span className="text-base font-medium text-[#52525b]">Você recebe</span>
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#f3eef9] rounded-full text-sm font-semibold text-[#a1a1aa]">
          {US_FLAG} USD
        </span>
      </div>
      <div className="flex items-baseline mb-6">
        <span className="text-[clamp(36px,5vw,52px)] font-[800] text-[#22c55e] mr-1.5" style={{ letterSpacing: "-0.02em" }}>
          $
        </span>
        <input
          type="text"
          value={getUsdValue()}
          readOnly
          className="text-[clamp(36px,5vw,52px)] font-[800] text-[#22c55e] bg-transparent border-none outline-none w-full"
          style={{ letterSpacing: "-0.02em", fontFamily: "inherit" }}
        />
      </div>

      {/* Rate box */}
      <div className="bg-[#f3eef9] rounded-2xl p-5 mt-6 border border-[rgba(149,35,239,0.06)]">
        <p className="text-base text-[#52525b]">
          Cotação: <strong className="text-[#0a0a0a]">R$ 5,23</strong> por US$1
        </p>
        <p className="text-xs text-[#a1a1aa] mt-1">Atualizada há 0s</p>
      </div>
    </div>
  );
}
