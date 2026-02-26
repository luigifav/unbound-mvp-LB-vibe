"use client";

// Importações necessárias: useState para o menu mobile, Link para navegação interna
import { useState } from "react";
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

// Links de navegação — fácil de adicionar ou remover itens aqui
const navLinks = [
  { label: "Início",     href: "/" },
  { label: "Enviar",     href: "/send" },
  { label: "Receber",    href: "/receive" },
  { label: "Dashboard",  href: "/dashboard" },
];

// Componente Header: exibido no topo de todas as páginas
export default function Header() {
  // Estado que controla se o menu mobile está aberto ou fechado
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    // Barra de navegação: fundo escuro semitransparente, blur, fica fixo no topo
    <header style={{
      position:      "sticky",
      top:           0,
      zIndex:        50,
      width:         "100%",
      background:    "rgba(0,9,4,0.85)",
      backdropFilter: "blur(14px)",
      borderBottom:  `1px solid ${C.grayBorder}`,
      fontFamily:    font,
    }}>
      <div style={{
        maxWidth:       "960px",
        margin:         "0 auto",
        padding:        "0 24px",
        height:         "64px",
        display:        "flex",
        alignItems:     "center",
        justifyContent: "space-between",
      }}>

        {/* Logo / Nome da plataforma — canto esquerdo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
          {/* Ícone decorativo roxo */}
          <div style={{
            width:           "30px",
            height:          "30px",
            borderRadius:    "8px",
            background:      C.purple,
            display:         "flex",
            alignItems:      "center",
            justifyContent:  "center",
            flexShrink:      0,
          }}>
            <span style={{ color: C.white, fontWeight: 900, fontSize: "14px" }}>U</span>
          </div>
          <span style={{ color: C.white, fontWeight: 900, fontSize: "18px", letterSpacing: "-0.01em" }}>
            UnboundCash
          </span>
        </Link>

        {/* Menu de navegação — visível em telas médias e maiores */}
        <nav className="nav-desktop" style={{ alignItems: "center", gap: "4px" }}>
          {navLinks.map((link) => (
            <NavLink key={link.href} href={link.href} label={link.label} />
          ))}

          {/* Botão de criar conta */}
          <CriarContaBtn />
        </nav>

        {/* Botão hamburguer — só aparece em mobile (controlado por globals.css) */}
        <button
          className="nav-mobile-btn"
          onClick={() => setMenuAberto(!menuAberto)}
          style={{
            background:  "transparent",
            border:      "none",
            cursor:      "pointer",
            padding:     "8px",
            color:       C.textSub,
            alignItems:  "center",
            justifyContent: "center",
          }}
          aria-label="Abrir menu"
        >
          {/* Ícone X quando aberto, hamburguer quando fechado */}
          <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuAberto
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {/* Menu mobile — aparece abaixo do header quando o hamburguer é clicado */}
      {menuAberto && (
        <div style={{
          background:     "rgba(0,9,4,0.97)",
          borderTop:      `1px solid ${C.grayBorder}`,
          padding:        "12px 24px 16px",
          display:        "flex",
          flexDirection:  "column",
          gap:            "4px",
        }}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuAberto(false)}
              style={{
                padding:        "12px 14px",
                borderRadius:   "8px",
                color:          C.textSub,
                fontFamily:     font,
                fontWeight:     700,
                fontSize:       "14px",
                textDecoration: "none",
                display:        "block",
              }}
            >
              {link.label}
            </Link>
          ))}
          {/* Botão criar conta no menu mobile */}
          <Link
            href="/register"
            onClick={() => setMenuAberto(false)}
            style={{
              marginTop:      "8px",
              padding:        "13px",
              background:     C.purple,
              borderRadius:   "8px",
              color:          C.white,
              fontFamily:     font,
              fontWeight:     900,
              fontSize:       "14px",
              textDecoration: "none",
              textAlign:      "center",
              display:        "block",
            }}
          >
            Criar conta
          </Link>
        </div>
      )}
    </header>
  );
}

// ─── Sub-componente: link individual de navegação com hover ────────
function NavLink({ href, label }: { href: string; label: string }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding:        "8px 14px",
        borderRadius:   "8px",
        color:          hovered ? C.white : C.textSub,
        fontFamily:     font,
        fontWeight:     700,
        fontSize:       "13px",
        textDecoration: "none",
        background:     hovered ? C.grayLight : "transparent",
        transition:     "all 0.2s",
      }}
    >
      {label}
    </Link>
  );
}

// ─── Sub-componente: botão "Criar conta" com hover ─────────────────
function CriarContaBtn() {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href="/register"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        marginLeft:     "12px",
        padding:        "9px 18px",
        background:     hovered ? C.purpleLight : C.purple,
        borderRadius:   "8px",
        color:          C.white,
        fontFamily:     font,
        fontWeight:     700,
        fontSize:       "13px",
        textDecoration: "none",
        letterSpacing:  "0.02em",
        transition:     "background 0.2s",
      }}
    >
      Criar conta
    </Link>
  );
}
