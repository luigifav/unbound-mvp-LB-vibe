import Link from "next/link";

// ─── Design tokens — mesma paleta do formulário de cadastro ───────
const C = {
  purple:       "#7c22d5",
  purpleLight:  "#9b4de0",
  purpleDim:    "rgba(124,34,213,0.15)",
  purpleBorder: "rgba(124,34,213,0.35)",
  white:        "#ffffff",
  black:        "#000904",
  grayLight:    "rgba(255,255,255,0.06)",
  grayBorder:   "rgba(255,255,255,0.1)",
  textMuted:    "rgba(255,255,255,0.45)",
  textSub:      "rgba(255,255,255,0.65)",
};

const font = "'Red Hat Display', sans-serif";

// Página inicial — hero + seção "Como funciona"
export default function Home() {
  return (
    <main style={{ background: C.black, minHeight: "calc(100vh - 64px)", fontFamily: font, position: "relative", overflow: "hidden" }}>

      {/* ── Brilho roxo decorativo no topo ── */}
      <div style={{
        position:   "absolute",
        top:        "-250px",
        left:       "50%",
        transform:  "translateX(-50%)",
        width:      "800px",
        height:     "600px",
        background: "radial-gradient(ellipse, rgba(124,34,213,0.22) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* ════════════════ HERO ════════════════ */}
      <section style={{
        display:        "flex",
        flexDirection:  "column",
        alignItems:     "center",
        textAlign:      "center",
        padding:        "100px 24px 80px",
        position:       "relative",
        animation:      "fadeUp 0.5s ease",
      }}>

        {/* Chip de destaque */}
        <div style={{
          display:       "inline-flex",
          alignItems:    "center",
          gap:           "8px",
          background:    C.purpleDim,
          border:        `1px solid ${C.purpleBorder}`,
          borderRadius:  "100px",
          padding:       "6px 14px",
          marginBottom:  "32px",
        }}>
          <span style={{ fontSize: "14px" }}>🇧🇷</span>
          <span style={{
            fontFamily:    font,
            fontWeight:    700,
            fontSize:      "12px",
            color:         C.purple,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}>
            Pagamentos internacionais para o Brasil
          </span>
        </div>

        {/* Título principal */}
        <h1 style={{
          fontFamily:   font,
          fontWeight:   900,
          fontSize:     "clamp(36px, 6vw, 64px)",
          color:        C.white,
          lineHeight:   1.1,
          maxWidth:     "760px",
          marginBottom: "24px",
          letterSpacing: "-0.02em",
        }}>
          Envie e receba dinheiro{" "}
          <span style={{ color: C.purple }}>além-fronteiras</span>,
          sem burocracia
        </h1>

        {/* Subtítulo */}
        <p style={{
          fontFamily:   font,
          fontWeight:   500,
          fontSize:     "18px",
          color:        C.textSub,
          maxWidth:     "520px",
          lineHeight:   1.7,
          marginBottom: "44px",
        }}>
          Crie sua conta em minutos, passe pela verificação de identidade e
          comece a movimentar seu dinheiro com segurança e agilidade.
        </p>

        {/* CTAs */}
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
          {/* Primário: ir para cadastro */}
          <Link
            href="/register"
            style={{
              padding:        "15px 32px",
              background:     C.purple,
              border:         "none",
              borderRadius:   "10px",
              color:          C.white,
              fontFamily:     font,
              fontWeight:     900,
              fontSize:       "15px",
              textDecoration: "none",
              letterSpacing:  "0.02em",
            }}
          >
            Criar conta →
          </Link>

          {/* Secundário: rola até a seção "Como funciona" */}
          <a
            href="#como-funciona"
            style={{
              padding:        "15px 32px",
              background:     "transparent",
              border:         `1px solid ${C.grayBorder}`,
              borderRadius:   "10px",
              color:          C.textSub,
              fontFamily:     font,
              fontWeight:     700,
              fontSize:       "15px",
              textDecoration: "none",
            }}
          >
            Saiba mais
          </a>
        </div>

        {/* Garantia social */}
        <p style={{
          marginTop:     "28px",
          fontFamily:    font,
          fontWeight:    700,
          fontSize:      "11px",
          color:         C.textMuted,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}>
          Criptografia de ponta a ponta · Verificação KYC · Sem taxas ocultas
        </p>
      </section>

      {/* ════════════════ COMO FUNCIONA ════════════════ */}
      <section
        id="como-funciona"
        style={{
          padding:    "80px 24px 100px",
          maxWidth:   "900px",
          margin:     "0 auto",
          animation:  "fadeUp 0.5s ease 0.15s both",
        }}
      >
        {/* Cabeçalho da seção */}
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <span style={{
            fontFamily:    font,
            fontWeight:    700,
            fontSize:      "11px",
            color:         C.purple,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}>
            Como funciona
          </span>
          <h2 style={{
            fontFamily:   font,
            fontWeight:   900,
            fontSize:     "clamp(26px, 4vw, 38px)",
            color:        C.white,
            marginTop:    "12px",
            lineHeight:   1.2,
          }}>
            Três passos para começar
          </h2>
        </div>

        {/* Cards dos passos */}
        <div style={{
          display:             "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap:                 "20px",
        }}>
          <StepCard
            number="01"
            title="Crie sua conta"
            description="Preencha seus dados pessoais, CPF e endereço. O processo é 100% online e leva menos de 5 minutos."
            icon={
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke={C.purple} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
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
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke={C.purple} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
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
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke={C.purple} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            }
          />
        </div>
      </section>

      {/* ── Rodapé mínimo ── */}
      <footer style={{
        textAlign:     "center",
        padding:       "24px",
        fontFamily:    font,
        fontWeight:    700,
        fontSize:      "10px",
        color:         "rgba(255,255,255,0.15)",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        borderTop:     `1px solid ${C.grayBorder}`,
      }}>
        © {new Date().getFullYear()} UnboundCash · Protegido com criptografia de ponta a ponta
      </footer>
    </main>
  );
}

// ─── Sub-componente: card de passo ────────────────────────────────
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
    <div style={{
      background:    C.grayLight,
      border:        `1px solid ${C.grayBorder}`,
      borderRadius:  "16px",
      padding:       "28px 24px",
      display:       "flex",
      flexDirection: "column",
      gap:           "16px",
    }}>
      {/* Ícone + número */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{
          width:          "44px",
          height:         "44px",
          borderRadius:   "12px",
          background:     C.purpleDim,
          border:         `1px solid ${C.purpleBorder}`,
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
        }}>
          {icon}
        </div>
        <span style={{
          fontFamily:    font,
          fontWeight:    900,
          fontSize:      "28px",
          color:         "rgba(124,34,213,0.2)",
          letterSpacing: "-0.04em",
          lineHeight:    1,
        }}>
          {number}
        </span>
      </div>

      {/* Texto */}
      <div>
        <h3 style={{
          fontFamily:   font,
          fontWeight:   900,
          fontSize:     "17px",
          color:        C.white,
          marginBottom: "8px",
        }}>
          {title}
        </h3>
        <p style={{
          fontFamily:  font,
          fontWeight:  500,
          fontSize:    "14px",
          color:       C.textSub,
          lineHeight:  1.6,
          margin:      0,
        }}>
          {description}
        </p>
      </div>
    </div>
  );
}
