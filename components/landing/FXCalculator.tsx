"use client";

import React, { useState } from "react";
import { ArrowUpDown } from "lucide-react";
import { useFXRate } from "@/lib/landing/useFXRate";
import { t } from "@/lib/landing/translations";
import {
  parseBRLToNumber,
  parseUSDToNumber,
  formatBRLInput,
  formatUSDInput,
  formatUSD,
  formatBRL,
  formatRate,
} from "@/lib/landing/currency";

type ConversionDirection = "BRL_TO_USD" | "USD_TO_BRL";

export default function FXCalculator() {
  const { rateData, isLoading, secondsSince } = useFXRate();
  const [direction, setDirection] = useState<ConversionDirection>("BRL_TO_USD");
  const [brlInput, setBrlInput] = useState("10000");
  const [usdInput, setUsdInput] = useState("");

  const brlAmount = parseBRLToNumber(brlInput);
  const usdAmount = parseUSDToNumber(usdInput);

  const convertedUSD =
    direction === "BRL_TO_USD" && brlAmount > 0
      ? brlAmount / rateData.effective
      : 0;

  const convertedBRL =
    direction === "USD_TO_BRL" && usdAmount > 0
      ? usdAmount * rateData.effective
      : 0;

  const handleBRLChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBrlInput(e.target.value);
    if (direction === "USD_TO_BRL") setDirection("BRL_TO_USD");
  };

  const handleUSDChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsdInput(e.target.value);
    if (direction === "BRL_TO_USD") setDirection("USD_TO_BRL");
  };

  const toggleDirection = () =>
    setDirection((prev) =>
      prev === "BRL_TO_USD" ? "USD_TO_BRL" : "BRL_TO_USD"
    );

  const displayBRLValue =
    direction === "BRL_TO_USD"
      ? formatBRLInput(brlInput)
      : convertedBRL > 0
        ? formatBRL(convertedBRL).replace("R$", "").trim()
        : "";

  const displayUSDValue =
    direction === "USD_TO_BRL"
      ? formatUSDInput(usdInput)
      : convertedUSD > 0
        ? formatUSD(convertedUSD).replace("$", "").trim()
        : "";

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8 shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:border-white/20 max-w-lg mx-auto">
      <div className="relative space-y-5">
        {/* BRL */}
        <div className="lp-fade-in-scale" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-white/50">
              {direction === "BRL_TO_USD"
                ? t("calculator.youSend")
                : t("calculator.youReceive")}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs bg-white/[0.06] text-white/50 px-3 py-1.5 rounded-full font-medium">
              <span className="text-sm leading-none">🇧🇷</span> BRL
            </span>
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-3xl sm:text-4xl lg:text-5xl font-bold text-white pointer-events-none z-10">
              R$
            </span>
            <input
              type="text"
              value={displayBRLValue}
              onChange={handleBRLChange}
              className="w-full text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight border-0 bg-transparent pl-16 sm:pl-20 pr-4 py-6 text-white placeholder:text-white/20 focus:outline-none focus:ring-0"
              placeholder="0"
              readOnly={direction === "USD_TO_BRL"}
            />
          </div>
        </div>

        {/* Toggle */}
        <div
          className="flex justify-center lp-fade-in-scale"
          style={{ animationDelay: "0.2s" }}
        >
          <button
            onClick={toggleDirection}
            className="rounded-full p-3 border border-white/10 hover:scale-110 transition-all duration-200 hover:bg-[#7c22d5]/20 hover:border-[#7c22d5]/40 cursor-pointer"
            aria-label="Trocar direcao da conversao"
          >
            <ArrowUpDown size={20} className="text-white/60" />
          </button>
        </div>

        {/* USD */}
        <div className="lp-fade-in-scale" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-white/50">
              {direction === "USD_TO_BRL"
                ? t("calculator.youSend")
                : t("calculator.youReceive")}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs bg-white/[0.06] text-white/50 px-3 py-1.5 rounded-full font-medium">
              <span className="text-sm leading-none">🇺🇸</span> USD
            </span>
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-3xl sm:text-4xl lg:text-5xl font-bold text-emerald-400 pointer-events-none z-10">
              $
            </span>
            <input
              type="text"
              value={displayUSDValue}
              onChange={handleUSDChange}
              className="w-full text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight border-0 bg-transparent pl-12 sm:pl-16 pr-4 py-6 text-emerald-400 placeholder:text-white/20 focus:outline-none focus:ring-0"
              placeholder="0"
              readOnly={direction === "BRL_TO_USD"}
            />
          </div>
        </div>

        {/* Rate info */}
        <div
          className="bg-white/[0.03] rounded-2xl p-5 border border-white/[0.06] lp-fade-in-scale"
          style={{ animationDelay: "0.4s" }}
        >
          <div className="text-sm space-y-1">
            <p className="text-white/50">
              {t("calculator.exchangeRate")}:{" "}
              <span className="font-medium text-white">
                R$ {formatRate(rateData.effective)}
              </span>{" "}
              {t("calculator.per")} US$1
            </p>
            <p className="text-xs text-white/30">
              {isLoading
                ? t("calculator.updating")
                : `${t("calculator.updatedAgo")} ${secondsSince}${t("calculator.seconds")}`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
