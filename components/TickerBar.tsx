"use client";

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
    <div className="flex items-center border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-[100] h-10">
      {/* Logo */}
      <div className="shrink-0 flex items-center px-5 h-full border-r border-gray-800">
        <span className="font-[800] text-base text-purple-500 tracking-tight">
          unbound
        </span>
      </div>

      {/* Ticker */}
      <div className="flex-1 overflow-hidden relative h-full">
        <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-gray-900/80 to-transparent z-[2] pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-gray-900/80 to-transparent z-[2] pointer-events-none" />
        <div
          className="flex items-center h-full w-max hover:[animation-play-state:paused]"
          style={{ animation: "tickerScroll 30s linear infinite" }}
        >
          {items.map((item, i) => (
            <div
              key={i}
              className="inline-flex items-center gap-2 px-5 whitespace-nowrap font-mono text-[12px] font-medium text-gray-400 border-r border-gray-800 h-full cursor-default hover:text-gray-200 transition-colors"
            >
              <span className="font-semibold text-gray-300 text-xs tracking-wide">
                {item.pair}
              </span>
              <span>{item.price}</span>
              <span
                className={`text-xs font-semibold ${
                  item.up ? "text-green-400" : "text-red-400"
                }`}
              >
                {item.change}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
