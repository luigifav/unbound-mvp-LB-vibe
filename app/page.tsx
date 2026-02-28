import Link from "next/link";
import JsonLd from "@/components/JsonLd";

export default function Home() {
  return (
    <main className="bg-[#000904] min-h-[calc(100vh-64px)] relative overflow-x-hidden">
      <JsonLd />

      {/* Brilho roxo decorativo no topo */}
      <div className="absolute top-[-250px] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[radial-gradient(ellipse,rgba(124,34,213,0.22)_0%,transparent_70%)] pointer-events-none" />

      {/* ════════════════ HERO ════════════════ */}
      <section className="flex flex-col items-center text-center px-4 sm:px-6 pt-[100px] pb-24 relative animate-[fadeUp_0.5s_ease]">
        {/* Container centralizado */}
        <div className="w-full max-w-[800px] mx-auto flex flex-col items-center gap-8">
          {/* Chip de destaque */}
          <div className="inline-flex items-center gap-2 bg-[rgba(124,34,213,0.15)] border border-[rgba(124,34,213,0.35)] rounded-full px-3.5 py-1.5">
            <span className="text-sm">🇧🇷</span>
            <span className="font-bold text-xs text-[#7c22d5] tracking-wider uppercase">
              Pagamentos internacionais para o Brasil
            </span>
          </div>

          {/* Título principal */}
          <h1 className="font-black text-[clamp(36px,6vw,64px)] text-white leading-[1.1] tracking-tight">
            Envie e receba dinheiro{" "}
            <span className="text-[#7c22d5]">além-fronteiras</span>,
            sem burocracia
          </h1>

          {/* Subtítulo */}
          <p className="font-medium text-lg text-white/65 max-w-[520px] leading-relaxed">
            Crie sua conta em minutos, passe pela verificação de identidade e
            comece a movimentar seu dinheiro com segurança e agilidade.
          </p>

          {/* CTAs */}
          <div className="flex gap-3 flex-wrap justify-center">
            <Link
              href="/register"
              className="py-[15px] px-8 bg-[#7c22d5] rounded-[10px] text-white font-black text-[15px] tracking-wide no-underline hover:bg-[#6a1cb8] transition-colors"
            >
              Criar conta &rarr;
            </Link>
            <a
              href="#como-funciona"
              className="py-[15px] px-8 bg-transparent border border-white/10 rounded-[10px] text-white/65 font-bold text-[15px] no-underline hover:border-white/25 transition-colors"
            >
              Saiba mais
            </a>
          </div>

          {/* Garantia social */}
          <p className="font-bold text-[11px] text-white/45 tracking-wider uppercase">
            Criptografia de ponta a ponta &middot; Verificação KYC &middot; Sem taxas ocultas
          </p>
        </div>
      </section>

      {/* ════════════════ COMO FUNCIONA ════════════════ */}
      <section
        id="como-funciona"
        aria-labelledby="como-funciona-titulo"
        className="px-4 sm:px-6 pt-16 pb-24 max-w-[1000px] mx-auto animate-[fadeUp_0.5s_ease_0.15s_both]"
      >
        {/* Cabeçalho da seção */}
        <div className="text-center mb-12">
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

        {/* Cards dos passos */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <StepCard
            number="01"
            title="Crie sua conta"
            description="Preencha seus dados pessoais, CPF e endereço. O processo é 100% online e leva menos de 5 minutos."
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
            description="Faça transações internacionais de forma simples. Taxas transparentes e câmbio justo em tempo real."
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
            description="Veja o status de cada transação no seu dashboard em tempo real. Histórico completo sempre disponível."
            icon={
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#7c22d5" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            }
          />
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
    <div className="bg-white/[0.06] border border-white/10 rounded-2xl p-7 flex flex-col gap-5 h-full">
      {/* Ícone + número */}
      <div className="flex items-center justify-between">
        <div className="w-11 h-11 rounded-xl bg-[rgba(124,34,213,0.15)] border border-[rgba(124,34,213,0.35)] flex items-center justify-center">
          {icon}
        </div>
        <span className="font-black text-[28px] text-[rgba(124,34,213,0.2)] tracking-tight leading-none">
          {number}
        </span>
      </div>

      {/* Texto */}
      <div className="flex flex-col gap-2">
        <h3 className="font-black text-[17px] text-white">
          {title}
        </h3>
        <p className="font-medium text-sm text-white/65 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
