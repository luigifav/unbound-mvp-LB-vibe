"use client";

import Link from "next/link";

const TICKER_PAIRS = [
  { pair: "BRL/USD", price: "5.23", change: "+0.12%", up: true },
  { pair: "EUR/USD", price: "1.08", change: "+0.05%", up: true },
  { pair: "GBP/USD", price: "1.27", change: "-0.03%", up: false },
  { pair: "BRL/EUR", price: "5.65", change: "+0.08%", up: true },
  { pair: "CAD/USD", price: "0.74", change: "-0.02%", up: false },
  { pair: "BRL/GBP", price: "6.64", change: "+0.15%", up: true },
];

export default function TickerBar() {
  const items = [...TICKER_PAIRS, ...TICKER_PAIRS];

  return (
    <div className="flex items-center border-b border-[#e8e0f0] bg-[#fafafa] sticky top-0 z-[100]">
      {/* Logo */}
      <Link
        href="/dashboard"
        className="shrink-0 flex items-center px-5 h-12 border-r border-[#e8e0f0] no-underline"
      >
        <span className="font-[800] text-lg text-[#0a0a0a] tracking-tight">
          unbound
        </span>
      </Link>

      {/* Ticker */}
      <div className="flex-1 overflow-hidden relative h-12">
        <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[#fafafa] to-transparent z-[2] pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#fafafa] to-transparent z-[2] pointer-events-none" />
        <div
          className="flex items-center h-full w-max hover:[animation-play-state:paused]"
          style={{ animation: "tickerScroll 30s linear infinite" }}
        >
          {items.map((item, i) => (
            <div
              key={i}
              className="inline-flex items-center gap-2 px-6 whitespace-nowrap font-mono text-[13px] font-medium text-[#52525b] border-r border-[#e8e0f0] h-full cursor-default hover:text-[#0a0a0a] transition-colors"
            >
              <span className="font-semibold text-[#0a0a0a] text-xs tracking-wide">
                {item.pair}
              </span>
              <span>{item.price}</span>
              <span
                className={`text-xs font-semibold ${
                  item.up ? "text-[#1a8f00]" : "text-[#e02424]"
                }`}
              >
                {item.change}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Account button */}
      <Link
        href="/dashboard"
        className="shrink-0 flex items-center gap-2 px-5 mx-4 py-2 text-[13px] font-semibold text-[#52525b] border border-[#e8e0f0] rounded-full hover:text-[#0a0a0a] hover:border-[#d4c8e2] transition-all no-underline"
      >
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24" className="opacity-60">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        Minha Conta
      </Link>
    </div>
  );
}
