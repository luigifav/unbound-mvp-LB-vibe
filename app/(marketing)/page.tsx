"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import CurrencyConverter from "@/components/CurrencyConverter";
import FaqAccordion from "@/components/FaqAccordion";

const IridescenceCanvas = dynamic(() => import("@/components/IridescenceCanvas"), { ssr: false });
const RotatingWord = dynamic(() => import("@/components/RotatingWord"), { ssr: false });

export default function Home() {
  return (
    <main className="bg-white min-h-screen relative overflow-x-hidden">
      {/* ========== HERO ========== */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-[#1a0a2e]" style={{ padding: "120px 0 80px" }}>
        <IridescenceCanvas />

        {/* Orbs */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute rounded-full blur-[100px] opacity-50 w-[500px] h-[500px] -top-[10%] -left-[5%]" style={{ background: "radial-gradient(circle, rgba(149,35,239,0.25), transparent 70%)", animation: "orbFloat 12s ease-in-out infinite" }} />
          <div className="absolute rounded-full blur-[100px] opacity-50 w-[600px] h-[600px] top-[20%] -right-[10%]" style={{ background: "radial-gradient(circle, rgba(178,0,199,0.2), transparent 70%)", animation: "orbFloat 12s ease-in-out infinite", animationDelay: "-4s" }} />
          <div className="absolute rounded-full blur-[100px] opacity-50 w-[400px] h-[400px] bottom-0 left-[30%]" style={{ background: "radial-gradient(circle, rgba(149,35,239,0.15), transparent 70%)", animation: "orbFloat 12s ease-in-out infinite", animationDelay: "-8s" }} />
        </div>

        {/* Grid overlay */}
        <div className="absolute inset-0 z-[1]" style={{ backgroundImage: "linear-gradient(rgba(149,35,239,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(149,35,239,0.03) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

        <div className="relative z-[2] max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12 items-center">
          {/* Left: Text */}
          <div className="lg:text-left text-center lp-fade-in-up" style={{ animationDelay: "0.2s" }}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-white/10 border border-white/20 rounded-full text-[13px] font-medium text-white/85 mb-6 backdrop-blur-[10px]">
              <div className="flex">
                <span className="w-2.5 h-2.5 rounded-full bg-[#9523ef] border-[1.5px] border-white inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#b200c7] border-[1.5px] border-white inline-block -ml-1" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#7a1bc9] border-[1.5px] border-white inline-block -ml-1" />
              </div>
              400+ clientes satisfeitos
            </div>

            <h1 className="text-[clamp(48px,6vw,76px)] font-[800] leading-[1.08] text-white mb-6" style={{ letterSpacing: "-0.03em" }}>
              Mais liberdade,<br />menos taxas.<br />Câmbio <RotatingWord />
            </h1>

            <p className="text-[19px] leading-[1.7] text-white/70 max-w-[520px] mb-9 lg:mx-0 mx-auto">
              Envie e receba dólares com as menores taxas do mercado. Sem IOF, sem burocracia, sem surpresas.
            </p>

            <div className="flex gap-4 flex-wrap lg:justify-start justify-center">
              <Link
                href="/register"
                className="relative overflow-hidden inline-flex items-center py-3.5 px-8 text-base font-semibold bg-[#9523ef] text-white rounded-full no-underline hover:bg-[#7a1bc9] hover:-translate-y-0.5 transition-all shadow-[0_0_40px_rgba(149,35,239,0.35)] hover:shadow-[0_0_60px_rgba(149,35,239,0.5)]"
              >
                <span className="relative z-10">Use a Unbound</span>
                <span className="absolute top-0 left-[-100%] w-full h-full pointer-events-none" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)", animation: "shimmerSlide 2.5s ease-in-out infinite" }} />
              </Link>
              <Link
                href="#como-funciona"
                className="inline-flex items-center py-3.5 px-8 text-base font-semibold text-white rounded-full no-underline border-[1.5px] border-white/25 bg-white/[0.08] backdrop-blur-[10px] hover:border-white/50 hover:bg-white/15 hover:-translate-y-0.5 transition-all"
              >
                Como funciona
              </Link>
            </div>
          </div>

          {/* Right: Calculator */}
          <div className="lp-slide-in-right" style={{ animationDelay: "0.5s" }}>
            <CurrencyConverter />
          </div>
        </div>
      </section>

      {/* ========== VANTAGENS ========== */}
      <section className="py-[100px]" id="vantagens">
        <div className="max-w-[1200px] mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="inline-block text-[13px] font-semibold tracking-[0.06em] uppercase text-[#9523ef] mb-3">Por que a Unbound?</span>
              <h2 className="text-[clamp(32px,4vw,48px)] font-[800] leading-[1.15] mb-4" style={{ letterSpacing: "-0.025em" }}>Vantagens que fazem diferença</h2>
              <p className="text-lg text-[#52525b] max-w-[560px] mx-auto">Câmbio inteligente, transparente e sem pegadinhas.</p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <><circle cx="12" cy="12" r="10" /><path d="M8 12h4l2 4" /><path d="M12 6v6" /></>, title: "Spread de 0.4%", desc: "Taxas até 10x menores que bancos tradicionais. Sem IOF, sem custos escondidos." },
              { icon: <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />, title: "Em minutos", desc: "Processamento rápido, sem esperar dias úteis. Sua transferência cai em minutos." },
              { icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />, title: "Seguro e regulado", desc: "Operações via parceiros regulados, com criptografia de ponta e compliance rigoroso." },
              { icon: <><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></>, title: "Disponível 24/7", desc: "Sem horário comercial. Faça sua operação quando quiser, de qualquer lugar." },
            ].map((card, i) => (
              <ScrollReveal key={i} delay={i * 80}>
                <div className="bg-white border border-[#e8e0f0] rounded-3xl p-8 transition-all duration-300 hover:border-[rgba(149,35,239,0.3)] hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(149,35,239,0.1)]">
                  <div className="w-12 h-12 flex items-center justify-center bg-[rgba(149,35,239,0.1)] rounded-xl mb-5 text-[#9523ef]">
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">{card.icon}</svg>
                  </div>
                  <h4 className="text-lg font-bold mb-2" style={{ letterSpacing: "-0.01em" }}>{card.title}</h4>
                  <p className="text-sm text-[#52525b] leading-relaxed">{card.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ========== COMO FUNCIONA ========== */}
      <section className="py-[100px] bg-[#f5f0fc]" id="como-funciona">
        <div className="max-w-[1200px] mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="inline-block text-[13px] font-semibold tracking-[0.06em] uppercase text-[#9523ef] mb-3">Simples e direto</span>
              <h2 className="text-[clamp(32px,4vw,48px)] font-[800] leading-[1.15] mb-4" style={{ letterSpacing: "-0.025em" }}>Como funciona</h2>
              <p className="text-lg text-[#52525b] max-w-[560px] mx-auto">Três passos para enviar ou receber dólares.</p>
            </div>
          </ScrollReveal>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            {[
              { num: "1", title: "Crie sua conta", desc: "Cadastro rápido, sem papelada. Valide sua identidade em minutos." },
              { num: "2", title: "Defina o valor", desc: "Escolha quanto quer enviar ou receber. Veja a cotação ao vivo." },
              { num: "3", title: "Receba em minutos", desc: "Confirme e pronto. O dinheiro chega rápido na conta de destino." },
            ].map((step, i) => (
              <ScrollReveal key={i} delay={i * 60} className="flex items-center gap-6">
                <div className="flex-1 max-w-[300px] bg-white border border-[#e8e0f0] rounded-3xl p-10 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(149,35,239,0.1)] hover:border-[rgba(149,35,239,0.3)]">
                  <div className="w-12 h-12 flex items-center justify-center bg-[#9523ef] text-white font-[800] text-xl rounded-full mx-auto mb-5">
                    {step.num}
                  </div>
                  <h4 className="text-lg font-bold mb-2">{step.title}</h4>
                  <p className="text-sm text-[#52525b] leading-relaxed">{step.desc}</p>
                </div>
                {i < 2 && (
                  <span className="hidden md:block text-[28px] text-[#9523ef] font-bold">→</span>
                )}
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ========== COMPARAÇÃO ========== */}
      <section className="py-[100px]" id="comparacao">
        <div className="max-w-[1200px] mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="inline-block text-[13px] font-semibold tracking-[0.06em] uppercase text-[#9523ef] mb-3">Comparação de custos</span>
              <h2 className="text-[clamp(32px,4vw,48px)] font-[800] leading-[1.15] mb-4" style={{ letterSpacing: "-0.025em" }}>Economia que faz a diferença</h2>
              <p className="text-lg text-[#52525b] max-w-[560px] mx-auto">Veja como a Unbound se compara aos bancos tradicionais.</p>
            </div>
          </ScrollReveal>
          <ScrollReveal>
            <div className="max-w-[800px] mx-auto border border-[#e8e0f0] rounded-3xl overflow-hidden bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="p-4 px-6 text-left text-sm font-bold bg-[#f3eef9] border-b border-[#e8e0f0]">Recurso</th>
                    <th className="p-4 px-6 text-center text-sm font-bold bg-[rgba(149,35,239,0.04)] text-[#9523ef] border-b border-[#e8e0f0]">Unbound</th>
                    <th className="p-4 px-6 text-center text-sm font-bold bg-[#f3eef9] border-b border-[#e8e0f0]">Bancos</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Taxa de câmbio", "✓ Spread de 0.4%", "✕ Spread de 3-4%"],
                    ["IOF", "✓ 0%", "✕ 6.38% padrão"],
                    ["Tempo", "✓ Minutos", "✕ 1-3 dias úteis"],
                    ["Horário", "✓ 24/7", "✕ Horário comercial"],
                    ["Rastreamento", "✓ Tempo real", "✕ Limitado"],
                  ].map(([feature, unbound, banks], i) => (
                    <tr key={i} className="hover:bg-[rgba(149,35,239,0.02)]">
                      <td className="p-4 px-6 text-sm border-b border-[#e8e0f0]">{feature}</td>
                      <td className="p-4 px-6 text-center text-sm font-semibold bg-[rgba(149,35,239,0.04)] text-[#9523ef] border-b border-[#e8e0f0]">
                        <span className={unbound.startsWith("✓") ? "text-[#22c55e] font-bold mr-1" : ""}>{unbound.charAt(0)}</span>{unbound.slice(2)}
                      </td>
                      <td className="p-4 px-6 text-center text-sm border-b border-[#e8e0f0]">
                        <span className={banks.startsWith("✕") ? "text-[#ef4444] font-bold mr-1" : ""}>{banks.charAt(0)}</span>{banks.slice(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ========== FAQ ========== */}
      <section className="py-[100px] bg-[#f5f0fc]" id="faq">
        <div className="max-w-[1200px] mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="inline-block text-[13px] font-semibold tracking-[0.06em] uppercase text-[#9523ef] mb-3">Dúvidas frequentes</span>
              <h2 className="text-[clamp(32px,4vw,48px)] font-[800] leading-[1.15] mb-4" style={{ letterSpacing: "-0.025em" }}>FAQ</h2>
              <p className="text-lg text-[#52525b] max-w-[560px] mx-auto">Tire suas dúvidas sobre a Unbound.</p>
            </div>
          </ScrollReveal>
          <FaqAccordion />
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section className="py-[100px] bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <ScrollReveal>
            <div className="max-w-[640px] mx-auto text-center p-14 border border-[#e8e0f0] rounded-3xl bg-white shadow-[0_0_80px_rgba(149,35,239,0.08)] relative overflow-hidden">
              <h2 className="text-[clamp(24px,3vw,36px)] font-[800] mb-3" style={{ letterSpacing: "-0.02em" }}>
                Pronto para economizar no câmbio?
              </h2>
              <p className="text-base text-[#52525b] mb-8">
                Cadastre-se agora e faça parte da nova geração de câmbio inteligente.
              </p>
              <form className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Seu nome"
                    className="w-full py-3.5 px-4.5 border border-[#e8e0f0] rounded-xl bg-white text-[#0a0a0a] text-[15px] outline-none focus:border-[#9523ef] focus:shadow-[0_0_0_3px_rgba(149,35,239,0.1)] transition-all"
                  />
                  <input
                    type="tel"
                    placeholder="Seu telefone"
                    className="w-full py-3.5 px-4.5 border border-[#e8e0f0] rounded-xl bg-white text-[#0a0a0a] text-[15px] outline-none focus:border-[#9523ef] focus:shadow-[0_0_0_3px_rgba(149,35,239,0.1)] transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="relative overflow-hidden w-full py-3.5 px-8 text-base font-semibold bg-[#9523ef] text-white rounded-full hover:bg-[#7a1bc9] hover:-translate-y-0.5 transition-all shadow-[0_0_40px_rgba(149,35,239,0.35)]"
                >
                  <span className="relative z-10">Entrar na lista de espera</span>
                  <span className="absolute top-0 left-[-100%] w-full h-full pointer-events-none" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)", animation: "shimmerSlide 2.5s ease-in-out infinite" }} />
                </button>
                <p className="text-xs text-[#a1a1aa] mt-1">
                  Ao se cadastrar, você concorda com nossos <a href="#" className="text-[#9523ef] underline">Termos</a> e <a href="#" className="text-[#9523ef] underline">Política de Privacidade</a>.
                </p>
              </form>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
