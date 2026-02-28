"use client";

import { useState, useEffect, useRef } from "react";
import {
  ArrowUpDown,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  AlertCircle,
  ShieldCheck,
  CheckCircle,
  Clock,
  Bell,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════
   TYPES & CONSTANTS
   ═══════════════════════════════════════════════════════ */

type Screen = "amount" | "receipt" | "tracking";

interface Currency {
  flag: string;
  code: string;
  name: string;
}

const SENDER_CURRENCIES: Currency[] = [
  { flag: "🇺🇸", code: "USD", name: "Dólar Americano" },
  { flag: "🇪🇺", code: "EUR", name: "Euro" },
  { flag: "🇬🇧", code: "GBP", name: "Libra Esterlina" },
  { flag: "🇨🇦", code: "CAD", name: "Dólar Canadense" },
];

const RECEIVER_CURRENCIES: Currency[] = [
  { flag: "🇧🇷", code: "BRL", name: "Real Brasileiro" },
  { flag: "🇲🇽", code: "MXN", name: "Peso Mexicano" },
  { flag: "🇨🇴", code: "COP", name: "Peso Colombiano" },
  { flag: "🇦🇷", code: "ARS", name: "Peso Argentino" },
  { flag: "🇵🇪", code: "PEN", name: "Sol Peruano" },
];

const RATES: Record<string, Record<string, number>> = {
  USD: { BRL: 5.42, MXN: 17.15, COP: 3920, ARS: 850, PEN: 3.72 },
  EUR: { BRL: 5.89, MXN: 18.63, COP: 4258, ARS: 923, PEN: 4.04 },
  GBP: { BRL: 6.71, MXN: 21.23, COP: 4852, ARS: 1051, PEN: 4.6 },
  CAD: { BRL: 3.98, MXN: 12.58, COP: 2876, ARS: 624, PEN: 2.73 },
};

const USER_BALANCE = 2450.0;
const FEE_RATE = 0.005;
const MIN_AMOUNT = 5.0;

const STEPS = [
  { id: 1, label: "Valor" },
  { id: 2, label: "Destinatário" },
  { id: 3, label: "Revisão" },
  { id: 4, label: "Confirmação" },
];

/* ═══════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════ */

function fmt(n: number, decimals = 2): string {
  return n.toLocaleString("pt-BR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function sym(code: string): string {
  const map: Record<string, string> = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    CAD: "C$",
    BRL: "R$",
    MXN: "MX$",
    COP: "COP ",
    ARS: "AR$",
    PEN: "S/.",
  };
  return map[code] || code;
}

function getRate(from: string, to: string): number {
  return RATES[from]?.[to] ?? 1;
}

function rateDecimals(rate: number): number {
  return rate >= 100 ? 0 : 2;
}

/* ═══════════════════════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════════════════════ */

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-between w-full mb-2">
      {STEPS.map((step, i) => {
        const active = step.id === current;
        const done = step.id < current;
        return (
          <div
            key={step.id}
            className="flex items-center"
            style={{ flex: i < STEPS.length - 1 ? 1 : undefined }}
          >
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  active
                    ? "bg-[#7C3AED] text-white shadow-[0_0_16px_rgba(124,58,237,0.4)]"
                    : done
                    ? "bg-purple-900 text-purple-300"
                    : "bg-gray-800 text-gray-500"
                }`}
              >
                {done ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  step.id
                )}
              </div>
              <span
                className={`text-[10px] mt-1.5 text-center whitespace-nowrap font-semibold tracking-wide uppercase ${
                  active
                    ? "text-purple-400"
                    : done
                    ? "text-purple-300/60"
                    : "text-gray-600"
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`flex-1 h-[2px] mx-2 mb-5 rounded-full transition-colors duration-300 ${
                  done ? "bg-[#7C3AED]" : "bg-gray-700/60"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function CurrencyDropdown({
  selected,
  options,
  open,
  onToggle,
  onSelect,
}: {
  selected: Currency;
  options: Currency[];
  open: boolean;
  onToggle: () => void;
  onSelect: (c: Currency) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onToggle();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onToggle]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={onToggle}
        className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-xl cursor-pointer transition-colors"
      >
        <span className="text-lg leading-none">{selected.flag}</span>
        <span className="text-sm font-semibold text-white">{selected.code}</span>
        <ChevronDown
          className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 bg-gray-800 border border-gray-700 rounded-xl overflow-hidden z-30 min-w-[220px] shadow-2xl animate-[fadeUp_0.15s_ease]">
          {options.map((c) => (
            <button
              key={c.code}
              onClick={() => {
                onSelect(c);
                onToggle();
              }}
              className={`flex items-center gap-3 w-full px-4 py-3 text-left transition-colors ${
                c.code === selected.code
                  ? "bg-purple-600/10 border-l-2 border-[#7C3AED]"
                  : "hover:bg-gray-700/70 border-l-2 border-transparent"
              }`}
            >
              <span className="text-lg leading-none">{c.flag}</span>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-white">{c.code}</span>
                <span className="text-[11px] text-gray-400">{c.name}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════ */

export default function SendFlow() {
  const [screen, setScreen] = useState<Screen>("amount");
  const [toast, setToast] = useState<string | null>(null);

  /* ── Amount screen state ── */
  const [senderAmount, setSenderAmount] = useState("");
  const [senderCurrency, setSenderCurrency] = useState(SENDER_CURRENCIES[0]);
  const [receiverCurrency, setReceiverCurrency] = useState(RECEIVER_CURRENCIES[0]);
  const [senderDropdownOpen, setSenderDropdownOpen] = useState(false);
  const [receiverDropdownOpen, setReceiverDropdownOpen] = useState(false);
  const [feeDetailsOpen, setFeeDetailsOpen] = useState(false);

  /* ── Tracking screen state ── */
  const [flightPhase, setFlightPhase] = useState(0);
  const [countdown, setCountdown] = useState({ h: 47, m: 59, s: 59 });

  /* ── Derived values ── */
  const amount = parseFloat(senderAmount) || 0;
  const rate = getRate(senderCurrency.code, receiverCurrency.code);
  const fee = amount * FEE_RATE;
  const totalDebited = amount + fee;
  const receivedAmount = amount * rate;
  const recDecimals = rate >= 100 ? 0 : 2;

  /* ── Validation ── */
  const belowMin = amount > 0 && amount < MIN_AMOUNT;
  const exceedsBalance = amount > USER_BALANCE;
  const isValid = amount >= MIN_AMOUNT && amount <= USER_BALANCE;

  /* ── Toast auto-dismiss ── */
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  /* ── Flight phase cycling ── */
  useEffect(() => {
    if (screen !== "tracking") return;
    const id = setInterval(() => setFlightPhase((p) => (p + 1) % 3), 1500);
    return () => clearInterval(id);
  }, [screen]);

  /* ── Countdown timer ── */
  useEffect(() => {
    if (screen !== "tracking") return;
    const id = setInterval(() => {
      setCountdown((prev) => {
        let { h, m, s } = prev;
        s--;
        if (s < 0) {
          s = 59;
          m--;
        }
        if (m < 0) {
          m = 59;
          h--;
        }
        if (h < 0) return { h: 0, m: 0, s: 0 };
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(id);
  }, [screen]);

  /* ── Handlers ── */
  const handleAmountChange = (value: string) => {
    const cleaned = value.replace(/[^0-9.]/g, "");
    const parts = cleaned.split(".");
    if (parts.length > 2) return;
    if (parts[1] && parts[1].length > 2) return;
    setSenderAmount(cleaned);
  };

  const handleSwapCurrencies = () => {
    const newS = SENDER_CURRENCIES.find((c) => c.code === receiverCurrency.code);
    const newR = RECEIVER_CURRENCIES.find((c) => c.code === senderCurrency.code);
    if (newS && newR) {
      setSenderCurrency(newS);
      setReceiverCurrency(newR);
    }
  };

  /* ═══════════════════════════════════════════════════════
     SCREEN 1 — AMOUNT
     ═══════════════════════════════════════════════════════ */

  const renderAmount = () => (
    <div className="w-full max-w-lg animate-[fadeUp_0.4s_ease]">
      <div className="bg-gray-900/90 backdrop-blur-xl border border-white/[0.06] rounded-3xl p-8 flex flex-col gap-6 shadow-[0_8px_60px_rgba(0,0,0,0.5)]">
        <StepIndicator current={1} />

        {/* ── Currency Converter Widget ── */}
        <div className="bg-gray-800 rounded-2xl p-5 flex flex-col gap-3">
          {/* Row 1 — Você envia */}
          <div>
            <span className="text-xs text-gray-400 mb-1 block">Você envia</span>
            <div className="flex items-center gap-3">
              <input
                type="text"
                inputMode="decimal"
                placeholder="0"
                value={senderAmount}
                onChange={(e) => handleAmountChange(e.target.value)}
                className="flex-1 bg-transparent text-3xl font-bold text-white outline-none placeholder:text-gray-600 min-w-0"
              />
              <CurrencyDropdown
                selected={senderCurrency}
                options={SENDER_CURRENCIES}
                open={senderDropdownOpen}
                onToggle={() => {
                  setSenderDropdownOpen((p) => !p);
                  setReceiverDropdownOpen(false);
                }}
                onSelect={setSenderCurrency}
              />
            </div>
          </div>

          {/* Swap button */}
          <div className="flex items-center justify-center">
            <button
              onClick={handleSwapCurrencies}
              className="w-9 h-9 rounded-full bg-gray-700 hover:bg-[#7C3AED] flex items-center justify-center transition-colors group"
            >
              <ArrowUpDown className="w-4 h-4 text-gray-300 group-hover:text-white transition-colors" />
            </button>
          </div>

          {/* Row 2 — Destinatário recebe */}
          <div>
            <span className="text-xs text-gray-400 mb-1 block">
              Destinatário recebe
            </span>
            <div className="flex items-center gap-3">
              <span className="flex-1 text-3xl font-bold text-purple-400 bg-transparent min-w-0 truncate">
                {amount > 0 ? fmt(receivedAmount, recDecimals) : "0"}
              </span>
              <CurrencyDropdown
                selected={receiverCurrency}
                options={RECEIVER_CURRENCIES}
                open={receiverDropdownOpen}
                onToggle={() => {
                  setReceiverDropdownOpen((p) => !p);
                  setSenderDropdownOpen(false);
                }}
                onSelect={setReceiverCurrency}
              />
            </div>
          </div>
        </div>

        {/* ── Exchange Rate Info Bar ── */}
        <div className="flex items-center justify-between bg-gray-800/50 rounded-xl px-4 py-3 flex-wrap gap-2">
          <span className="text-sm text-white font-medium">
            1 {senderCurrency.code} = {fmt(rate, rateDecimals(rate))}{" "}
            {receiverCurrency.code}
          </span>
          <span className="text-sm text-gray-400">· Taxa: 0,5% ·</span>
          <div className="flex items-center gap-1">
            <RefreshCw className="w-3 h-3 text-green-400" />
            <span className="text-xs text-green-400">Atualizado agora</span>
          </div>
        </div>

        {/* ── Fee Breakdown (collapsible) ── */}
        {amount > 0 && (
          <div>
            <button
              onClick={() => setFeeDetailsOpen((p) => !p)}
              className="flex items-center gap-2 w-full"
            >
              {feeDetailsOpen ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
              <span className="text-sm text-gray-400">Ver detalhes da taxa</span>
            </button>

            {feeDetailsOpen && (
              <div className="flex flex-col gap-2 mt-3 border-t border-gray-700 pt-3 animate-[fadeUp_0.2s_ease]">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">Valor enviado</span>
                  <span className="text-gray-300">
                    {sym(senderCurrency.code)}
                    {fmt(amount)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">Taxa de serviço (0,5%)</span>
                  <span className="text-red-400">
                    − {sym(senderCurrency.code)}
                    {fmt(fee)}
                  </span>
                </div>
                <div className="border-t border-gray-700 pt-2 mt-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white font-semibold">Total debitado</span>
                    <span className="text-white font-semibold">
                      {sym(senderCurrency.code)}
                      {fmt(totalDebited)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Validation States ── */}
        {belowMin && (
          <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-4 py-3 animate-[fadeUp_0.2s_ease]">
            <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0" />
            <span className="text-sm text-yellow-400">
              Valor mínimo de envio: {sym(senderCurrency.code)}5,00
            </span>
          </div>
        )}

        {exceedsBalance && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 animate-[fadeUp_0.2s_ease]">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span className="text-sm text-red-400">
              Saldo insuficiente. Seu saldo disponível é $2.450,00 USD.
            </span>
          </div>
        )}

        {/* ── CTA Button ── */}
        <button
          onClick={() => isValid && setScreen("receipt")}
          disabled={!isValid}
          className={`w-full py-4 rounded-2xl text-base font-semibold transition-all duration-200 ${
            isValid
              ? "bg-[#7C3AED] hover:bg-[#6D28D9] text-white cursor-pointer shadow-[0_4px_24px_rgba(124,58,237,0.3)] hover:shadow-[0_4px_32px_rgba(124,58,237,0.45)]"
              : "bg-gray-700 text-gray-500 cursor-not-allowed"
          }`}
        >
          Continuar →
        </button>

        {/* ── Guarantee note ── */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500">
          <ShieldCheck className="w-3 h-3" />
          <span>Câmbio garantido por 30 min após confirmação</span>
        </div>
      </div>
    </div>
  );

  /* ═══════════════════════════════════════════════════════
     SCREEN 2 — RECEIPT
     ═══════════════════════════════════════════════════════ */

  const renderReceipt = () => (
    <div className="w-full max-w-sm flex flex-col items-center animate-[fadeUp_0.45s_ease]">
      {/* Receipt card */}
      <div className="w-full bg-white text-gray-900 font-mono text-xs flex flex-col shadow-[0_20px_80px_rgba(0,0,0,0.6)] relative">
        {/* Zigzag top edge */}
        <div
          className="w-full h-4 shrink-0"
          style={{
            backgroundImage:
              "linear-gradient(135deg, #030712 33.33%, transparent 33.33%), linear-gradient(225deg, #030712 33.33%, transparent 33.33%)",
            backgroundSize: "14px 100%",
            backgroundRepeat: "repeat-x",
            backgroundColor: "#ffffff",
          }}
        />

        {/* ── Header ── */}
        <div className="px-6 pt-4 pb-3 text-center">
          <p className="font-bold text-lg tracking-[0.25em] text-gray-900">
            UNBOUNDCASH
          </p>
          <p className="text-[11px] text-gray-500 mt-1">
            Plataforma de Câmbio Internacional
          </p>
          <p className="text-[11px] text-gray-400">CNPJ: 00.000.000/0001-00</p>

          <div className="border-b border-dashed border-gray-300 my-3" />

          <p className="font-bold text-[13px] tracking-[0.15em] text-gray-800">
            COMPROVANTE DE TRANSFERÊNCIA
          </p>
          <p className="text-[11px] text-gray-500 mt-1">28/02/2026 — 14:32:07</p>
          <p className="text-[11px] text-gray-400">Nº TXN-2026-00142</p>
        </div>

        <div className="border-b border-dashed border-gray-300 mx-6" />

        {/* ── Transaction Details ── */}
        <div className="px-6 py-3">
          {(
            [
              ["REMETENTE", "Bruno Souza"],
              ["DESTINATÁRIO", "Maria Silva"],
              ["BANCO DEST.", "Bradesco S.A."],
              ["CONTA", "****-1234"],
              ["TIPO", "Transf. Internacional"],
            ] as const
          ).map(([label, value]) => (
            <div key={label} className="flex justify-between py-1">
              <span className="text-gray-500">{label}</span>
              <span className="text-gray-900 font-semibold text-right">
                {value}
              </span>
            </div>
          ))}
        </div>

        <div className="border-b border-dashed border-gray-300 mx-6" />

        {/* ── Currency Details ── */}
        <div className="px-6 py-3">
          {(
            [
              [
                "MOEDA ORIGEM",
                `${senderCurrency.code} (${senderCurrency.name.split(" ")[0]})`,
              ],
              [
                "MOEDA DESTINO",
                `${receiverCurrency.code} (${receiverCurrency.name.split(" ")[0]})`,
              ],
              [
                "CÂMBIO APLICADO",
                `1 ${senderCurrency.code} = ${sym(receiverCurrency.code)} ${fmt(rate, rateDecimals(rate))}`,
              ],
              [
                "VALOR ENVIADO",
                `${sym(senderCurrency.code)} ${fmt(amount)}`,
              ],
              ["TAXA (0,5%)", `− ${sym(senderCurrency.code)} ${fmt(fee)}`],
            ] as const
          ).map(([label, value]) => (
            <div key={label} className="flex justify-between py-1">
              <span className="text-gray-500">{label}</span>
              <span className="text-gray-900 font-semibold text-right">
                {value}
              </span>
            </div>
          ))}

          <div className="border-t border-dashed border-gray-400 my-2" />
          <div className="flex justify-between py-1">
            <span className="text-gray-800 font-bold text-[13px]">
              TOTAL DEBITADO
            </span>
            <span className="text-gray-900 font-bold text-[13px]">
              {sym(senderCurrency.code)} {fmt(totalDebited)}
            </span>
          </div>

          <div className="border-t border-dashed border-gray-400 my-2" />
          <div className="flex justify-between py-1">
            <span className="text-green-700 font-bold text-[13px]">
              DEST. RECEBE
            </span>
            <span className="text-green-700 font-bold text-[13px]">
              {sym(receiverCurrency.code)} {fmt(receivedAmount, recDecimals)}
            </span>
          </div>
        </div>

        <div className="border-b border-dashed border-gray-300 mx-6" />

        {/* ── Status Block ── */}
        <div className="px-6 py-4 text-center">
          <div className="inline-flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-full px-4 py-1.5 mb-2">
            <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
            <span className="text-yellow-700 font-bold text-[11px] tracking-wide">
              PROCESSANDO
            </span>
          </div>
          <p className="text-[11px] text-gray-500 mt-2">
            Previsão de chegada: até 2 dias úteis
          </p>
          <p className="text-[11px] text-gray-400">
            Acompanhe em tempo real abaixo
          </p>
        </div>

        <div className="border-b border-dashed border-gray-300 mx-6" />

        {/* ── Footer ── */}
        <div className="px-6 pb-5 pt-4 text-center text-gray-400">
          <p className="text-[11px]">Transferência processada por UnboundCash</p>
          <p className="text-[11px]">Regulamentada pelo Banco Central do Brasil</p>
          <p className="text-[11px] mt-1">www.unboundcash.com</p>

          {/* Barcode mockup */}
          <div className="mt-4 flex flex-col items-center gap-0.5">
            <div className="text-[11px] tracking-[-0.05em] text-gray-800 leading-none select-none">
              ▎▎▎▎▎▎▎▎ ▎▎▎▎ ▎▎▎▎▎▎▎▎▎▎▎ ▎▎▎▎ ▎▎▎▎▎▎▎▎▎
            </div>
            <div className="text-[11px] tracking-[-0.05em] text-gray-800 leading-none select-none">
              ▎▎▎▎▎▎ ▎▎▎▎▎▎ ▎▎▎▎▎▎▎▎ ▎▎▎▎▎▎ ▎▎▎▎▎▎▎▎▎▎
            </div>
            <div className="text-[11px] tracking-[-0.05em] text-gray-800 leading-none select-none">
              ▎▎▎▎▎▎▎▎ ▎▎▎▎ ▎▎▎▎▎▎▎▎▎▎▎ ▎▎▎▎ ▎▎▎▎▎▎▎▎▎
            </div>
            <p className="text-[11px] text-gray-500 mt-1.5 tracking-widest">
              2026 0002 8142 0100 5000
            </p>
          </div>
        </div>

        {/* Zigzag bottom edge */}
        <div
          className="w-full h-4 shrink-0"
          style={{
            backgroundImage:
              "linear-gradient(315deg, #030712 33.33%, transparent 33.33%), linear-gradient(45deg, #030712 33.33%, transparent 33.33%)",
            backgroundSize: "14px 100%",
            backgroundRepeat: "repeat-x",
            backgroundColor: "#ffffff",
          }}
        />
      </div>

      {/* ── Action Buttons ── */}
      <div className="flex flex-col gap-3 w-full mt-6">
        <button
          onClick={() => setToast("Função disponível em breve")}
          className="w-full py-3.5 rounded-2xl text-sm font-medium border border-white/20 text-white hover:bg-gray-800 transition-colors"
        >
          📄 Baixar comprovante (PDF)
        </button>
        <button
          onClick={() => setScreen("tracking")}
          className="w-full py-3.5 rounded-2xl text-sm font-semibold bg-[#7C3AED] hover:bg-[#6D28D9] text-white transition-colors shadow-[0_4px_24px_rgba(124,58,237,0.3)]"
        >
          ✈️ Acompanhar transferência →
        </button>
      </div>
    </div>
  );

  /* ═══════════════════════════════════════════════════════
     SCREEN 3 — TRACKING
     ═══════════════════════════════════════════════════════ */

  const flightLabels = [
    "🇧🇷 Saindo do Brasil...",
    "🏝️ Passando pelo Caribe...",
    "🇺🇸 Chegando nos EUA...",
  ];

  const timeline = [
    {
      title: "Transferência iniciada",
      time: "28/02/2026 — 14:32",
      status: "done" as const,
      desc: "Sua ordem de câmbio foi registrada com sucesso.",
    },
    {
      title: "Saiu do Brasil",
      time: "28/02/2026 — 16:00 (estimado)",
      status: "done" as const,
      desc: "Fundos transferidos do banco remetente para câmbio internacional.",
    },
    {
      title: "Em trânsito internacional",
      time: "01/03/2026 — Previsto",
      status: "active" as const,
      desc: "Processando via rede SWIFT. Rota: Brasil → Caribe → EUA.",
    },
    {
      title: "Chegada nos EUA",
      time: "03/03/2026 — Previsto (2 dias úteis)",
      status: "pending" as const,
      desc: "Crédito na conta do destinatário no banco americano.",
    },
  ];

  const renderTracking = () => (
    <div className="w-full max-w-xl animate-[fadeUp_0.4s_ease]">
      <div className="bg-gray-900/90 backdrop-blur-xl border border-white/[0.06] rounded-3xl p-8 shadow-[0_8px_60px_rgba(0,0,0,0.5)]">
        {/* ── Back button ── */}
        <button
          onClick={() => setScreen("receipt")}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <span>←</span> Voltar ao comprovante
        </button>

        {/* ── Header ── */}
        <h2 className="text-xl font-bold text-white">
          Acompanhando sua transferência
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          TXN-2026-00142 · {sym(senderCurrency.code)}
          {fmt(amount)} {senderCurrency.code} → {sym(receiverCurrency.code)}{" "}
          {fmt(receivedAmount, recDecimals)} {receiverCurrency.code}
        </p>

        {/* ── Animated Flight Map ── */}
        <div
          className="relative w-full h-48 rounded-2xl overflow-hidden my-6"
          style={{
            background:
              "linear-gradient(135deg, #0c1929 0%, #111827 40%, #0f172a 100%)",
          }}
        >
          {/* Stars / dots */}
          <div className="absolute inset-0 opacity-30">
            {[
              [10, 15],
              [25, 70],
              [40, 20],
              [55, 80],
              [70, 35],
              [85, 60],
              [15, 45],
              [60, 55],
              [90, 25],
              [35, 90],
            ].map(([l, t], i) => (
              <div
                key={i}
                className="absolute w-0.5 h-0.5 bg-white rounded-full"
                style={{ left: `${l}%`, top: `${t}%` }}
              />
            ))}
          </div>

          {/* Dashed flight path (SVG) */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 600 200"
            preserveAspectRatio="none"
          >
            <path
              d="M110,140 Q200,140 300,70 Q400,0 490,130"
              fill="none"
              stroke="#4B5563"
              strokeWidth="2"
              strokeDasharray="8 5"
            />
          </svg>

          {/* Location markers */}
          <div className="absolute left-[14%] bottom-4 flex flex-col items-center">
            <span className="text-2xl drop-shadow-lg">🇧🇷</span>
            <span className="text-[10px] text-white/80 font-medium mt-0.5">
              Brasil
            </span>
          </div>
          <div className="absolute left-[46%] top-3 flex flex-col items-center">
            <span className="text-2xl drop-shadow-lg">🏝️</span>
            <span className="text-[10px] text-white/80 font-medium mt-0.5">
              Caribe
            </span>
          </div>
          <div className="absolute right-[12%] bottom-4 flex flex-col items-center">
            <span className="text-2xl drop-shadow-lg">🇺🇸</span>
            <span className="text-[10px] text-white/80 font-medium mt-0.5">
              EUA
            </span>
          </div>

          {/* Animated plane */}
          <div
            className="absolute top-1/2 text-xl z-10 drop-shadow-[0_0_8px_rgba(124,58,237,0.6)]"
            style={{ animation: "fly 4s ease-in-out infinite alternate" }}
          >
            ✈️
          </div>
        </div>

        {/* ── Flight phase label ── */}
        <p className="text-sm text-purple-400 text-center mb-6 font-medium">
          {flightLabels[flightPhase]}
        </p>

        {/* ── Status Timeline ── */}
        <div className="relative ml-3">
          {/* Vertical line */}
          <div className="absolute left-0 top-3 bottom-3 w-[2px] bg-gray-700" />

          {timeline.map((step, i) => (
            <div key={i} className="flex items-start gap-4 pb-8 relative last:pb-0">
              {/* Icon */}
              <div className="w-6 h-6 flex-shrink-0 -ml-[12px] mt-0.5 bg-gray-900 rounded-full flex items-center justify-center z-10">
                {step.status === "done" ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : step.status === "active" ? (
                  <span className="w-3.5 h-3.5 rounded-full bg-yellow-400 animate-pulse shadow-[0_0_8px_rgba(250,204,21,0.4)]" />
                ) : (
                  <Clock className="w-5 h-5 text-gray-500" />
                )}
              </div>
              {/* Content */}
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white">{step.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{step.time}</p>
                <p className="text-xs text-gray-500 mt-1">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Countdown Timer ── */}
        <div className="bg-gray-800 rounded-2xl p-5 text-center mt-6">
          <p className="text-[10px] text-gray-400 uppercase tracking-[0.15em] font-semibold mb-3">
            Tempo estimado para chegada
          </p>
          <p className="text-4xl font-bold font-mono text-white tracking-widest">
            {String(countdown.h).padStart(2, "0")}:
            {String(countdown.m).padStart(2, "0")}:
            {String(countdown.s).padStart(2, "0")}
          </p>
          <p className="text-xs text-gray-500 mt-3">
            2 dias úteis · Seg a Sex, horário bancário
          </p>
        </div>

        {/* ── Bottom Actions ── */}
        <div className="flex flex-col gap-3 mt-6">
          <button
            onClick={() => setToast("Você será notificado por email e push!")}
            className="w-full py-3 rounded-2xl border border-gray-700 text-gray-300 hover:border-purple-500 hover:text-purple-400 text-sm transition-colors flex items-center justify-center gap-2"
          >
            <Bell className="w-4 h-4" />
            Notificar quando chegar
          </button>
          <button
            onClick={() => {
              setScreen("amount");
              setSenderAmount("");
              setFeeDetailsOpen(false);
              setCountdown({ h: 47, m: 59, s: 59 });
            }}
            className="w-full py-3 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-sm font-semibold transition-colors shadow-[0_4px_24px_rgba(124,58,237,0.3)]"
          >
            Ir para o Dashboard
          </button>
        </div>
      </div>
    </div>
  );

  /* ═══════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════ */

  return (
    <>
      {/* Inline style for plane keyframe animation */}
      <style>{`
        @keyframes fly {
          0%   { left: 12%; transform: translateY(-50%); }
          50%  { left: 45%; transform: translateY(-75%); }
          100% { left: 73%; transform: translateY(-50%); }
        }
      `}</style>

      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-start py-12 px-4 relative overflow-hidden">
        {/* Purple glow — matching onboarding form pattern */}
        <div className="fixed top-[-200px] left-1/2 -translate-x-1/2 w-[700px] h-[500px] pointer-events-none bg-[radial-gradient(ellipse,rgba(124,58,237,0.14)_0%,transparent_70%)]" />

        {/* Active screen */}
        {screen === "amount" && renderAmount()}
        {screen === "receipt" && renderReceipt()}
        {screen === "tracking" && renderTracking()}

        {/* Footer — matching onboarding form */}
        <p className="mt-8 font-bold text-[10px] text-white/[0.12] tracking-[0.12em] uppercase">
          Protegido por UnboundCash
        </p>

        {/* Toast notification */}
        {toast && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-green-500/15 border border-green-500/25 backdrop-blur-xl text-green-300 px-6 py-3 rounded-2xl text-sm font-medium shadow-[0_8px_32px_rgba(0,0,0,0.4)] animate-[fadeUp_0.25s_ease]">
            {toast}
          </div>
        )}
      </div>
    </>
  );
}
