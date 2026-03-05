"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Vantagens", href: "#seguranca" },
  { label: "Como funciona", href: "#como-funciona" },
  { label: "FAQ", href: "#faq" },
];

export default function Header() {
  const [menuAberto, setMenuAberto] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header className="sticky top-0 z-50 w-full bg-[rgba(0,9,4,0.85)] backdrop-blur-[14px] border-b border-white/[0.06]">
      <div className="max-w-6xl mx-auto flex items-center justify-between w-full px-6 py-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 no-underline group"
          aria-label="Unbound - Página inicial"
        >
          <div className="w-[32px] h-[32px] rounded-lg bg-[#7c22d5] flex items-center justify-center shrink-0 group-hover:bg-[#6a1cb8] transition-colors">
            <span className="text-white font-black text-sm">U</span>
          </div>
          <span className="text-white font-black text-lg tracking-tight">
            Unbound
          </span>
        </Link>

        {/* Nav desktop */}
        <nav
          className="hidden md:flex items-center gap-7"
          aria-label="Menu de navegação"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={isHome ? link.href : `/${link.href}`}
              className="py-2 px-1 font-bold text-[13px] no-underline text-white/50 hover:text-white transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA buttons desktop */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="py-2.5 px-4 text-white/60 hover:text-white font-bold text-[13px] no-underline transition-colors"
          >
            Entrar
          </Link>
          <Link
            href="/register"
            className="py-2.5 px-[18px] bg-[#7c22d5] rounded-lg text-white font-bold text-[13px] no-underline tracking-wide hover:bg-[#6a1cb8] transition-colors"
          >
            Usar Unbound
          </Link>
        </div>

        {/* Hamburger button mobile */}
        <button
          className="flex md:hidden"
          onClick={() => setMenuAberto(!menuAberto)}
          aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuAberto}
        >
          <svg
            width="22"
            height="22"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            {menuAberto ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuAberto && (
        <nav
          className="bg-[rgba(0,9,4,0.97)] border-t border-white/[0.06] px-6 py-3 flex flex-col gap-1"
          aria-label="Menu de navegação mobile"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={isHome ? link.href : `/${link.href}`}
              onClick={() => setMenuAberto(false)}
              className={`block py-3 px-3.5 rounded-lg font-bold text-sm no-underline ${
                pathname === link.href
                  ? "text-white bg-white/[0.06]"
                  : "text-white/55"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex flex-col gap-2 mt-2">
            <Link
              href="/login"
              onClick={() => setMenuAberto(false)}
              className="block py-3.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white/70 font-bold text-sm no-underline text-center"
            >
              Entrar
            </Link>
            <Link
              href="/register"
              onClick={() => setMenuAberto(false)}
              className="block py-3.5 bg-[#7c22d5] rounded-lg text-white font-black text-sm no-underline text-center"
            >
              Usar Unbound
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
