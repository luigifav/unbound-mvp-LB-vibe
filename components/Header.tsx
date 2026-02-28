"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Câmbio", href: "#cambio" },
  { label: "Sobre", href: "#sobre" },
  { label: "FAQ", href: "#faq" },
];

export default function Header() {
  const [menuAberto, setMenuAberto] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full bg-[rgba(0,9,4,0.85)] backdrop-blur-[14px] border-b border-white/10">
      <div className="max-w-6xl mx-auto flex items-center justify-between w-full px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 no-underline" aria-label="UnboundCash - Página inicial">
          <div className="w-[30px] h-[30px] rounded-lg bg-[#7c22d5] flex items-center justify-center shrink-0">
            <span className="text-white font-black text-sm">U</span>
          </div>
          <span className="text-white font-black text-lg tracking-tight">
            UnboundCash
          </span>
        </Link>

        {/* Nav desktop */}
        <nav className="nav-desktop items-center gap-8" aria-label="Menu de navegação">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="py-2 px-1 font-bold text-[13px] no-underline text-white/65 hover:text-white transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA button desktop */}
        <div className="nav-desktop">
          <Link
            href="/register"
            className="py-2.5 px-[18px] bg-[#7c22d5] rounded-lg text-white font-bold text-[13px] no-underline tracking-wide hover:bg-[#9b4de0] transition-colors"
          >
            Criar conta
          </Link>
        </div>

        {/* Botão hamburger mobile */}
        <button
          className="nav-mobile-btn"
          onClick={() => setMenuAberto(!menuAberto)}
          aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuAberto}
        >
          <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            {menuAberto
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {/* Menu mobile */}
      {menuAberto && (
        <nav className="bg-[rgba(0,9,4,0.97)] border-t border-white/10 px-6 py-3 flex flex-col gap-1" aria-label="Menu de navegação mobile">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuAberto(false)}
              className={`block py-3 px-3.5 rounded-lg font-bold text-sm no-underline ${
                pathname === link.href
                  ? "text-white bg-white/[0.06]"
                  : "text-white/65"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/register"
            onClick={() => setMenuAberto(false)}
            className="block mt-2 py-3.5 bg-[#7c22d5] rounded-lg text-white font-black text-sm no-underline text-center"
          >
            Criar conta
          </Link>
        </nav>
      )}
    </header>
  );
}
