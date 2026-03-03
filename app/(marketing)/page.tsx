import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import CurrencyConverter from "@/components/CurrencyConverter";
import FaqAccordion from "@/components/FaqAccordion";
import {
  TrendingUp,
  Zap,
  ShieldCheck,
  Eye,
  UserPlus,
  ArrowRightLeft,
  BarChart3,
  ArrowRight,
  Clock,
  Globe,
} from "lucide-react";

/* ──────────────────── Partner logos marquee ──────────────────── */

function PartnerLogos() {
  const partners = [
    "PIX",
    "SWIFT",
    "Visa",
    "Mastercard",
    "USDC",
    "Solana",
    "Circle",
    "Apple Pay",
  ];

  const logos = partners.map((name) => (
    <span
      key={name}
      className="inline-flex items-center gap-2 px-6 text-white/20 font-black text-sm tracking-widest uppercase whitespace-nowrap select-none"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-[#7c22d5]/40" />
      {name}
    </span>
  ));

  return (
    <div className="w-full overflow-hidden py-8 border-y border-white/[0.04]">
      <div className="marquee-track flex">
        <div className="marquee-content flex shrink-0">{logos}</div>
        <div className="marquee-content flex shrink-0" aria-hidden="true">
          {logos}
        </div>
      </div>
    </div>
  );
}

/* ──────────────────── Section chip label ──────────────────── */

function SectionChip({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 bg-[rgba(124,34,213,0.12)] border border-[rgba(124,34,213,0.3)] rounded-full px-3.5 py-1.5">
      <span className="font-bold text-[10px] sm:text-[11px] text-[#7c22d5] tracking-[0.14em] uppercase">
        {children}
      </span>
    </div>
  );
}

/* ──────────────────── Advantage card ──────────────────── */

function AdvantageCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-[rgba(124,34,213,0.25)] transition-all duration-300 flex flex-col gap-4 h-full hover:bg-white/[0.05]">
      <div className="w-12 h-12 rounded-xl bg-[rgba(124,34,213,0.12)] border border-[rgba(124,34,213,0.25)] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="font-black text-lg text-white">{title}</h3>
      <p className="text-white/45 text-sm leading-relaxed font-medium">
        {description}
      </p>
    </div>
  );
}

/* ──────────────────── Step card ──────────────────── */

function StepCard({
  number,
  icon,
  title,
  description,
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex flex-col gap-4 h-full relative overflow-hidden group hover:border-[rgba(124,34,213,0.2)] transition-all duration-300">
      {/* Large background number */}
      <span className="absolute -right-2 -top-4 text-[100px] font-black text-white/[0.02] leading-none pointer-events-none select-none group-hover:text-white/[0.04] transition-colors duration-500">
        {number}
      </span>

      <span className="font-mono text-xs font-bold text-[#7c22d5] tracking-widest relative z-10">
        {number}
      </span>
      <div className="w-11 h-11 rounded-xl bg-[rgba(124,34,213,0.12)] border border-[rgba(124,34,213,0.3)] flex items-center justify-center relative z-10">
        {icon}
      </div>
      <div className="flex flex-col gap-2 relative z-10">
        <h3 className="font-bold text-lg text-white">{title}</h3>
        <p className="text-white/45 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   HOME PAGE
   ══════════════════════════════════════════════════════════════════════ */

export default function Home() {
  return (
    <main className="bg-[#000904] min-h-[calc(100vh-64px)] relative overflow-x-hidden">
      <JsonLd />

      {/* Decorative purple glow — top */}
      <div className="absolute top-[-250px] left-1/2 -translate-x-1/2 w-[900px] h-[650px] bg-[radial-gradient(ellipse,rgba(124,34,213,0.18)_0%,transparent_70%)] pointer-events-none z-0" />

      {/* ═══════════════════ HERO ═══════════════════ */}
      <section className="flex flex-col items-center text-center pt-20 sm:pt-28 pb-12 px-6 relative animate-[fadeUp_0.5s_ease]">
        <div className="max-w-3xl mx-auto flex flex-col gap-5 items-center">
          <SectionChip>Plataforma de câmbio internacional</SectionChip>

          <h1 className="font-black text-[clamp(32px,6vw,58px)] text-white leading-[1.08] tracking-tight">
            Envie dinheiro para o{" "}
            <span className="text-[#7c22d5]">Brasil</span> com as{" "}
            <span className="relative inline-block">
              melhores taxas
              <span className="absolute bottom-1 left-0 w-full h-[3px] bg-[#7c22d5]/40 rounded-full" />
            </span>
          </h1>

          <p className="font-medium text-base sm:text-lg text-white/55 leading-relaxed max-w-xl">
            Transferências internacionais com câmbio justo, entrega em minutos
            via PIX e total transparência. Sem surpresas, sem letras miúdas.
          </p>
        </div>

        {/* Currency converter widget */}
        <div className="w-full mt-10 animate-[fadeUp_0.6s_ease_0.15s_both]">
          <CurrencyConverter />
        </div>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-x-4 gap-y-2 flex-wrap mt-8 animate-[fadeUp_0.5s_ease_0.25s_both]">
          {[
            { icon: <TrendingUp size={13} />, text: "Câmbio em tempo real" },
            { icon: <Clock size={13} />, text: "Entrega em minutos" },
            { icon: <Eye size={13} />, text: "Sem taxas ocultas" },
            { icon: <Globe size={13} />, text: "Conta gratuita" },
          ].map((badge) => (
            <span
              key={badge.text}
              className="flex items-center gap-1.5 text-xs text-white/35 font-medium"
            >
              <span className="text-[#7c22d5]/70">{badge.icon}</span>
              {badge.text}
            </span>
          ))}
        </div>
      </section>

      {/* ═══════════════════ PARTNERS MARQUEE ═══════════════════ */}
      <section className="animate-[fadeUp_0.5s_ease_0.3s_both]">
        <PartnerLogos />
      </section>

      {/* ═══════════════════ VANTAGENS ═══════════════════ */}
      <section
        id="vantagens"
        aria-labelledby="vantagens-titulo"
        className="py-20 sm:py-28 px-6"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-4 flex flex-col items-center gap-3">
            <SectionChip>Por que escolher a Unbound</SectionChip>
            <h2
              id="vantagens-titulo"
              className="font-black text-[clamp(26px,4vw,40px)] text-white leading-tight"
            >
              Vantagens
            </h2>
          </div>
          <p className="text-center text-white/40 mb-12 max-w-xl mx-auto text-sm sm:text-base font-medium">
            Tudo o que você precisa para enviar e receber dinheiro
            internacionalmente, sem complicação.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <AdvantageCard
              icon={<TrendingUp size={22} className="text-[#7c22d5]" />}
              title="Melhores taxas"
              description="Câmbio comercial em tempo real. Até 80% mais barato que bancos tradicionais e sem spreads ocultos."
            />
            <AdvantageCard
              icon={<Zap size={22} className="text-[#7c22d5]" />}
              title="Transferência rápida"
              description="Envios processados em minutos via PIX. Sem esperar dias úteis ou horários bancários."
            />
            <AdvantageCard
              icon={<ShieldCheck size={22} className="text-[#7c22d5]" />}
              title="100% Seguro"
              description="Criptografia de ponta a ponta, verificação KYC completa e infraestrutura regulamentada."
            />
            <AdvantageCard
              icon={<Eye size={22} className="text-[#7c22d5]" />}
              title="Sem taxas ocultas"
              description="Você vê exatamente quanto paga e quanto o destinatário recebe. Transparência total."
            />
          </div>
        </div>
      </section>

      {/* ═══════════════════ COMO FUNCIONA ═══════════════════ */}
      <section
        id="como-funciona"
        aria-labelledby="como-funciona-titulo"
        className="py-20 sm:py-28 px-6 relative"
      >
        {/* Subtle purple glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[radial-gradient(ellipse,rgba(124,34,213,0.08)_0%,transparent_70%)] pointer-events-none" />

        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-4 flex flex-col items-center gap-3">
            <SectionChip>Simples e rápido</SectionChip>
            <h2
              id="como-funciona-titulo"
              className="font-black text-[clamp(26px,4vw,40px)] text-white leading-tight"
            >
              Como funciona
            </h2>
          </div>
          <p className="text-center text-white/40 mb-12 max-w-xl mx-auto text-sm sm:text-base font-medium">
            Comece a enviar dinheiro internacionalmente em poucos minutos, sem
            burocracia.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <StepCard
              number="01"
              icon={<UserPlus size={20} className="text-[#7c22d5]" />}
              title="Crie sua conta"
              description="Cadastro 100% online. Preencha seus dados básicos e comece a usar em menos de 5 minutos, sem burocracia."
            />
            <StepCard
              number="02"
              icon={<ArrowRightLeft size={20} className="text-[#7c22d5]" />}
              title="Envie ou receba"
              description="Converta moedas com câmbio justo e envie para qualquer banco no Brasil. Taxa única e transparente."
            />
            <StepCard
              number="03"
              icon={<BarChart3 size={20} className="text-[#7c22d5]" />}
              title="Acompanhe tudo"
              description="Histórico completo de transações e status atualizado em tempo real no seu dashboard."
            />
          </div>
        </div>
      </section>

      {/* ═══════════════════ FAQ ═══════════════════ */}
      <section id="faq" aria-labelledby="faq-titulo" className="py-20 sm:py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-4 flex flex-col items-center gap-3">
            <SectionChip>Dúvidas frequentes</SectionChip>
            <h2
              id="faq-titulo"
              className="font-black text-[clamp(26px,4vw,40px)] text-white leading-tight"
            >
              FAQ
            </h2>
          </div>
          <p className="text-center text-white/40 mb-10 max-w-xl mx-auto text-sm sm:text-base font-medium">
            Respostas para as perguntas mais comuns sobre a plataforma.
          </p>

          <FaqAccordion />
        </div>
      </section>

      {/* ═══════════════════ CTA SECTION ═══════════════════ */}
      <section className="py-20 sm:py-28 px-6 relative overflow-hidden">
        {/* Purple gradient background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(124,34,213,0.15)_0%,transparent_60%)] pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(124,34,213,0.3)] to-transparent" />

        <div className="max-w-2xl mx-auto text-center relative flex flex-col items-center gap-6">
          <SectionChip>Comece agora</SectionChip>

          <h2 className="font-black text-[clamp(26px,4.5vw,42px)] text-white leading-[1.1] tracking-tight">
            Pronto para enviar dinheiro{" "}
            <span className="text-[#7c22d5]">sem fronteiras</span>?
          </h2>

          <p className="text-white/45 text-sm sm:text-base font-medium max-w-lg leading-relaxed">
            Crie sua conta gratuita em menos de 5 minutos e comece a enviar com
            as melhores taxas do mercado.
          </p>

          <div className="flex gap-4 flex-col sm:flex-row items-center">
            <Link
              href="/register"
              className="py-4 px-8 bg-[#7c22d5] hover:bg-[#6a1cb8] rounded-xl text-white font-black text-[15px] tracking-wide no-underline transition-all duration-200 flex items-center gap-2 group"
            >
              Abrir conta grátis
              <ArrowRight
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
            <Link
              href="/login"
              className="py-4 px-8 bg-transparent border border-white/15 hover:border-white/30 rounded-xl text-white/70 hover:text-white font-bold text-[15px] no-underline transition-all duration-200"
            >
              Já tenho conta
            </Link>
          </div>

          <p className="text-white/20 text-xs font-bold tracking-wider uppercase mt-4">
            Cadastro gratuito &middot; Sem compromisso &middot; Cancele quando
            quiser
          </p>
        </div>
      </section>
    </main>
  );
}
