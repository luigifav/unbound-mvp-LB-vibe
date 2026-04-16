import type { Metadata } from "next";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata: Metadata = {
  title: "Sobre nós",
  description: "Conheça a Unbound: quem somos, nossa missão e por que queremos transformar o câmbio no Brasil.",
};

export default function SobrePage() {
  return (
    <main className="bg-white min-h-screen">
      {/* ========== PAGE HERO ========== */}
      <section className="relative overflow-hidden bg-[#1a0a2e]" style={{ padding: "160px 0 100px" }}>
        <div className="absolute inset-0 z-0">
          <div className="absolute rounded-full blur-[100px] opacity-45 w-[500px] h-[500px] -top-[100px] -left-[80px]" style={{ background: "radial-gradient(circle, rgba(149,35,239,0.3), transparent 70%)" }} />
          <div className="absolute rounded-full blur-[100px] opacity-45 w-[400px] h-[400px] -bottom-[60px] -right-[60px]" style={{ background: "radial-gradient(circle, rgba(178,0,199,0.25), transparent 70%)" }} />
          <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(149,35,239,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(149,35,239,0.04) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        </div>
        <div className="relative z-[1] max-w-[760px] mx-auto text-center px-6">
          <span className="inline-block text-[13px] font-semibold tracking-[0.06em] uppercase text-[rgba(149,35,239,0.9)] bg-[rgba(149,35,239,0.12)] border border-[rgba(149,35,239,0.25)] px-4.5 py-1.5 rounded-full mb-6">
            Quem somos
          </span>
          <h1 className="text-[clamp(40px,5.5vw,68px)] font-[800] leading-[1.1] text-white mb-6" style={{ letterSpacing: "-0.03em" }}>
            Nascemos para{" "}
            <span className="bg-gradient-to-r from-[#9523ef] to-[#b200c7] bg-clip-text text-transparent">
              libertar
            </span>{" "}
            o seu dinheiro
          </h1>
          <p className="text-[19px] leading-[1.7] text-white/70 max-w-[600px] mx-auto">
            A Unbound foi criada por brasileiros que cansaram de pagar taxas abusivas no câmbio. Nossa missão é simples: tornar o câmbio justo, rápido e acessível para todos.
          </p>
        </div>
      </section>

      {/* ========== MISSÃO ========== */}
      <section className="py-[100px]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal>
              <div>
                <span className="block text-[13px] font-semibold tracking-[0.06em] uppercase text-[#9523ef] mb-3">Nossa missão</span>
                <h2 className="text-[clamp(28px,3vw,42px)] font-[800] leading-[1.15] mb-5" style={{ letterSpacing: "-0.025em" }}>
                  Câmbio justo não deveria ser privilégio
                </h2>
                <div className="space-y-4 text-[17px] leading-[1.75] text-[#52525b]">
                  <p>Por décadas, bancos e corretoras tradicionais cobraram spreads abusivos, IOF embutido e taxas escondidas no câmbio internacional. O brasileiro pagava sem perceber.</p>
                  <p>A Unbound surgiu para acabar com isso. Somos uma plataforma de câmbio digital que usa tecnologia para eliminar intermediários e entregar a cotação mais próxima possível do mercado — direto no seu bolso.</p>
                  <p>Nossa visão é um mundo onde qualquer pessoa pode movimentar dinheiro internacionalmente com a mesma facilidade de uma transferência entre amigos.</p>
                </div>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-2 gap-5">
              {[
                { num: "0,4%", label: "Spread médio — até 10x menor que bancos" },
                { num: "400+", label: "Clientes satisfeitos em todo o Brasil" },
                { num: "0%", label: "IOF para o cliente final" },
                { num: "24/7", label: "Disponível a qualquer hora, todo dia" },
              ].map((stat, i) => (
                <ScrollReveal key={i} delay={i * 80}>
                  <div className="bg-white border border-[#e8e0f0] rounded-3xl p-7 transition-all duration-300 hover:border-[rgba(149,35,239,0.3)] hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(149,35,239,0.1)]">
                    <div className="text-4xl font-[800] text-[#9523ef] leading-none mb-1.5" style={{ letterSpacing: "-0.03em" }}>{stat.num}</div>
                    <div className="text-sm text-[#52525b] leading-snug">{stat.label}</div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========== VALORES ========== */}
      <section className="py-[100px] bg-[#f5f0fc]">
        <div className="max-w-[1200px] mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="inline-block text-[13px] font-semibold tracking-[0.06em] uppercase text-[#9523ef] mb-3">O que nos guia</span>
              <h2 className="text-[clamp(30px,3.5vw,44px)] font-[800] leading-[1.15] mb-4" style={{ letterSpacing: "-0.025em" }}>Nossos valores</h2>
              <p className="text-lg text-[#52525b] max-w-[560px] mx-auto">Princípios que estão em cada decisão que tomamos.</p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <><circle cx="12" cy="12" r="10" /><path d="M8 12h4l2 4M12 6v6" /></>, title: "Transparência total", desc: "Sem taxas escondidas. Você vê exatamente o que paga antes de confirmar qualquer operação." },
              { icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />, title: "Segurança primeiro", desc: "Operamos com parceiros regulados, criptografia de ponta e processos rigorosos de compliance." },
              { icon: <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />, title: "Velocidade", desc: "Transferências em minutos, não dias. Porque o seu dinheiro não tem tempo a perder." },
              { icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>, title: "Foco no cliente", desc: "Cada funcionalidade é construída pensando em quem usa. Simplicidade é inegociável." },
              { icon: <><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></>, title: "Acesso global", desc: "Democratizamos o acesso ao mercado de câmbio para qualquer brasileiro, em qualquer lugar." },
              { icon: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />, title: "Inovação contínua", desc: "Nunca paramos de melhorar. Tecnologia, produto e experiência evoluem a cada dia." },
            ].map((card, i) => (
              <ScrollReveal key={i} delay={i * 80}>
                <div className="bg-white border border-[#e8e0f0] rounded-3xl p-9 transition-all duration-300 hover:border-[rgba(149,35,239,0.3)] hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(149,35,239,0.1)]">
                  <div className="w-[52px] h-[52px] flex items-center justify-center bg-[rgba(149,35,239,0.1)] rounded-xl mb-5 text-[#9523ef]">
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">{card.icon}</svg>
                  </div>
                  <h4 className="text-lg font-bold mb-2.5" style={{ letterSpacing: "-0.01em" }}>{card.title}</h4>
                  <p className="text-[15px] text-[#52525b] leading-[1.65]">{card.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ========== HISTÓRIA ========== */}
      <section className="py-[100px]">
        <div className="max-w-[1200px] mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="inline-block text-[13px] font-semibold tracking-[0.06em] uppercase text-[#9523ef] mb-3">Nossa história</span>
              <h2 className="text-[clamp(30px,3.5vw,44px)] font-[800] leading-[1.15] mb-4" style={{ letterSpacing: "-0.025em" }}>De uma frustração a uma solução</h2>
              <p className="text-lg text-[#52525b] max-w-[560px] mx-auto">Como a Unbound saiu do papel e chegou até você.</p>
            </div>
          </ScrollReveal>
          <div className="max-w-[720px] mx-auto relative">
            <div className="absolute left-[20px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-[#9523ef] to-[#b200c7] opacity-20" />
            {[
              { year: "2023", title: "A ideia nasce", desc: "Após pagar mais de 8% em taxas numa transferência internacional, os fundadores decidiram que precisava existir uma alternativa melhor para o brasileiro." },
              { year: "2024", title: "Primeiros clientes", desc: "Com a plataforma em beta, os primeiros 100 clientes testaram o produto e deram o feedback que moldou a Unbound que existe hoje." },
              { year: "2025", title: "Crescimento acelerado", desc: "Ultrapassamos 400 clientes satisfeitos e expandimos as operações. O produto amadureceu e as taxas ficaram ainda mais competitivas." },
              { year: "2026 →", title: "O futuro", desc: "Novas moedas, novos mercados e mais recursos. Estamos só no começo de transformar o câmbio para todos os brasileiros." },
            ].map((item, i) => (
              <ScrollReveal key={i} delay={i * 80}>
                <div className="flex gap-7 mb-10 last:mb-0 relative">
                  <div className="w-[42px] h-[42px] rounded-full bg-[rgba(149,35,239,0.1)] border-2 border-[#9523ef] flex items-center justify-center shrink-0 text-[#9523ef] font-[800] text-[13px] relative z-[1]">
                    {i + 1}
                  </div>
                  <div className="pt-1.5">
                    <div className="text-xs font-bold tracking-[0.06em] uppercase text-[#9523ef] mb-1">{item.year}</div>
                    <h4 className="text-[17px] font-bold mb-1.5" style={{ letterSpacing: "-0.01em" }}>{item.title}</h4>
                    <p className="text-[15px] text-[#52525b] leading-[1.65]">{item.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ========== TIME ========== */}
      <section className="py-[100px] bg-[#f5f0fc]">
        <div className="max-w-[1200px] mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="inline-block text-[13px] font-semibold tracking-[0.06em] uppercase text-[#9523ef] mb-3">As pessoas por trás</span>
              <h2 className="text-[clamp(30px,3.5vw,44px)] font-[800] leading-[1.15] mb-4" style={{ letterSpacing: "-0.025em" }}>Nosso time</h2>
              <p className="text-lg text-[#52525b] max-w-[560px] mx-auto">Apaixonados por tecnologia e por tornar o câmbio mais justo.</p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {[
              { initials: "GS", name: "Gabriel Santos", role: "Co-fundador & CEO", desc: "Ex-fintech com 8 anos de experiência em mercados financeiros internacionais. Acredita que tecnologia pode equalizar o acesso ao câmbio." },
              { initials: "LC", name: "Luiza Costa", role: "Co-fundadora & CTO", desc: "Engenheira de software com passagem por empresas de pagamentos em São Paulo e Londres. Obcecada por segurança e performance." },
              { initials: "RM", name: "Rafael Melo", role: "Head de Produto", desc: "Designer e estrategista de produto com foco em experiências financeiras simples. Acredita que o melhor produto é o mais invisível." },
            ].map((person, i) => (
              <ScrollReveal key={i} delay={i * 80}>
                <div className="bg-white border border-[#e8e0f0] rounded-3xl p-9 text-center transition-all duration-300 hover:border-[rgba(149,35,239,0.3)] hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(149,35,239,0.1)]">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#9523ef] to-[#b200c7] flex items-center justify-center text-[28px] font-[800] text-white mx-auto mb-4" style={{ letterSpacing: "-0.02em" }}>
                    {person.initials}
                  </div>
                  <h4 className="text-[17px] font-bold mb-1">{person.name}</h4>
                  <p className="text-[13px] font-semibold text-[#9523ef] mb-3 tracking-wide">{person.role}</p>
                  <p className="text-sm text-[#52525b] leading-relaxed">{person.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA STRIP ========== */}
      <section className="py-[100px] bg-[#1a0a2e] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute rounded-full blur-[80px] opacity-40 w-[400px] h-[400px] -top-[100px] right-[10%]" style={{ background: "radial-gradient(circle, rgba(149,35,239,0.35), transparent 70%)" }} />
          <div className="absolute rounded-full blur-[80px] opacity-40 w-[300px] h-[300px] -bottom-[80px] left-[5%]" style={{ background: "radial-gradient(circle, rgba(178,0,199,0.25), transparent 70%)" }} />
        </div>
        <div className="relative z-[1] max-w-[1200px] mx-auto px-6">
          <ScrollReveal>
            <div className="text-center">
              <h2 className="text-[clamp(28px,3.5vw,44px)] font-[800] text-white mb-4" style={{ letterSpacing: "-0.025em" }}>
                Pronto para fazer parte?
              </h2>
              <p className="text-lg text-white/65 max-w-[500px] mx-auto mb-9">
                Junte-se às centenas de pessoas que já economizam no câmbio com a Unbound.
              </p>
              <Link
                href="/register"
                className="relative overflow-hidden inline-flex items-center py-3.5 px-8 text-base font-semibold bg-[#9523ef] text-white rounded-full no-underline hover:bg-[#7a1bc9] hover:-translate-y-0.5 transition-all shadow-[0_0_40px_rgba(149,35,239,0.35)] hover:shadow-[0_0_60px_rgba(149,35,239,0.5)]"
              >
                <span className="relative z-10">Use a Unbound</span>
                <span className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)", animation: "shimmerSlide 2.5s linear infinite" }} />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
