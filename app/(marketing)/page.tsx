import Link from "next/link";
import JsonLd from "@/components/JsonLd";

export default function Home() {
  return (
    <main className="bg-[#000904] min-h-[calc(100vh-64px)] relative overflow-x-hidden">
      <JsonLd />

      {/* Brilho roxo decorativo no topo */}
      <div className="absolute top-[-250px] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[radial-gradient(ellipse,rgba(124,34,213,0.22)_0%,transparent_70%)] pointer-events-none z-0" />

      {/* ════════════════ HERO ════════════════ */}
      <section className="flex flex-col items-center justify-center text-center py-32 px-6 relative animate-[fadeUp_0.5s_ease]">
        {/* Container centralizado */}
        <div className="max-w-3xl mx-auto flex flex-col gap-6">
          {/* Chip de destaque */}
          <div className="inline-flex items-center justify-center gap-2 bg-[rgba(124,34,213,0.15)] border border-[rgba(124,34,213,0.35)] rounded-full px-3.5 py-1.5 self-center">
            <span className="font-bold text-xs text-[#7c22d5] tracking-wider uppercase">
              Plataforma de câmbio internacional
            </span>
          </div>

          {/* Título principal */}
          <h1 className="font-black text-[clamp(36px,6vw,64px)] text-white leading-[1.1] tracking-tight">
            Envie e receba dinheiro{" "}
            <span className="text-[#7c22d5]">além-fronteiras</span>,
            sem burocracia
          </h1>

          {/* Subtítulo */}
          <p className="font-medium text-lg text-white/65 leading-relaxed">
            Transações internacionais com câmbio justo, transferência rápida e total transparência de taxas. Sem surpresas, sem letras miúdas.
          </p>

          {/* CTAs */}
          <div className="flex justify-center gap-4 flex-col sm:flex-row flex-wrap">
            <Link
              href="/register"
              className="py-[15px] px-8 bg-[#7c22d5] rounded-[10px] text-white font-black text-[15px] tracking-wide no-underline hover:bg-[#6a1cb8] transition-colors w-full sm:w-auto"
            >
              Criar conta &rarr;
            </Link>
            <a
              href="#como-funciona"
              className="py-[15px] px-8 bg-transparent border border-white/25 rounded-[10px] text-white font-bold text-[15px] no-underline hover:border-white/50 transition-colors w-full sm:w-auto"
            >
              Saiba mais
            </a>
          </div>

          {/* Garantia social */}
          <div className="flex items-center justify-center gap-2 flex-wrap py-8">
            <span className="text-sm text-gray-400">Câmbio em tempo real</span>
            <span className="text-gray-400 text-sm">&middot;</span>
            <span className="text-sm text-gray-400">Transferência internacional</span>
            <span className="text-gray-400 text-sm">&middot;</span>
            <span className="text-sm text-gray-400">Sem taxas ocultas</span>
            <span className="text-gray-400 text-sm">&middot;</span>
            <span className="text-sm text-gray-400">Conta gratuita</span>
          </div>
        </div>
      </section>

      {/* ════════════════ COMO FUNCIONA ════════════════ */}
      <section
        id="como-funciona"
        aria-labelledby="como-funciona-titulo"
        className="py-24 px-6 animate-[fadeUp_0.5s_ease_0.15s_both]"
      >
        <div className="max-w-6xl mx-auto">
          {/* Cabeçalho da seção */}
          <div className="text-center mb-4">
            <span className="font-bold text-[11px] text-[#7c22d5] tracking-[0.14em] uppercase">
              Como funciona
            </span>
            <h2
              id="como-funciona-titulo"
              className="font-black text-[clamp(26px,4vw,38px)] text-white mt-3 leading-tight"
            >
              Três passos para começar
            </h2>
          </div>
          <p className="text-center text-gray-400 mb-12 max-w-xl mx-auto">
            Comece a enviar e receber dinheiro internacionalmente em poucos minutos, sem complicação.
          </p>

          {/* Cards dos passos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StepCard
              number="01"
              title="Crie sua conta"
              description="Cadastro 100% online. Preencha seus dados básicos e comece a usar em menos de 5 minutos, sem burocracia."
              icon={
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#7c22d5" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              }
            />
            <StepCard
              number="02"
              title="Envie ou receba"
              description="Converta moedas com câmbio justo e envie para qualquer banco no mundo. Taxa única e transparente, sem surpresas."
              icon={
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#7c22d5" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              }
            />
            <StepCard
              number="03"
              title="Acompanhe tudo"
              description="Histórico completo de transações e status atualizado em tempo real no seu dashboard. Notificações a cada etapa."
              icon={
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#7c22d5" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
              }
            />
          </div>
        </div>
      </section>
    </main>
  );
}

function StepCard({
  number,
  title,
  description,
  icon,
}: {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="p-6 rounded-2xl bg-gray-900 flex flex-col gap-4 h-full">
      {/* Número do passo */}
      <span className="font-mono text-xs font-bold text-[#7c22d5] tracking-widest">
        {number}
      </span>

      {/* Ícone */}
      <div className="w-11 h-11 rounded-xl bg-[rgba(124,34,213,0.15)] border border-[rgba(124,34,213,0.35)] flex items-center justify-center">
        {icon}
      </div>

      {/* Texto */}
      <div className="flex flex-col gap-2">
        <h3 className="font-bold text-lg text-white">
          {title}
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
