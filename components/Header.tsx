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
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4">
      <div className="w-full max-w-5xl bg-white/80 backdrop-blur-[20px] border border-black/[0.06] rounded-2xl px-5 py-3 flex items-center justify-between shadow-sm">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 no-underline group"
          aria-label="Unbound - Página inicial"
        >
          <div className="w-[30px] h-[30px] rounded-lg bg-[#7c22d5] flex items-center justify-center shrink-0 group-hover:bg-[#6a1cb8] transition-colors">
            <span className="text-white font-black text-xs">U</span>
          </div>
          <span className="text-gray-900 font-black text-base tracking-tight">
            Unbound
          </span>
        </Link>

        {/* Nav desktop */}
        <nav
          className="hidden md:flex items-center gap-6"
          aria-label="Menu de navegação"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={isHome ? link.href : `/${link.href}`}
              className="py-1.5 px-1 font-bold text-[13px] no-underline text-gray-500 hover:text-gray-900 transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA buttons desktop */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="py-2 px-4 text-gray-500 hover:text-gray-900 font-bold text-[13px] no-underline transition-colors"
          >
            Entrar
          </Link>
          <Link
            href="/register"
            className="py-2 px-[18px] bg-[#7c22d5] rounded-xl text-white font-bold text-[13px] no-underline tracking-wide hover:bg-[#6a1cb8] transition-colors"
          >
            Usar Unbound
          </Link>
        </div>

        {/* Hamburger button mobile */}
        <button
          className="flex md:hidden text-gray-900"
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
        <div className="absolute top-full left-4 right-4 mt-2 max-w-5xl mx-auto">
          <nav
            className="bg-white/95 backdrop-blur-[20px] border border-black/[0.06] rounded-2xl px-5 py-4 flex flex-col gap-1 shadow-lg"
            aria-label="Menu de navegação mobile"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={isHome ? link.href : `/${link.href}`}
                onClick={() => setMenuAberto(false)}
                className={`block py-3 px-3.5 rounded-xl font-bold text-sm no-underline ${
                  pathname === link.href
                    ? "text-gray-900 bg-gray-100"
                    : "text-gray-500"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 mt-2">
              <Link
                href="/login"
                onClick={() => setMenuAberto(false)}
                className="block py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-600 font-bold text-sm no-underline text-center"
              >
                Entrar
              </Link>
              <Link
                href="/register"
                onClick={() => setMenuAberto(false)}
                className="block py-3.5 bg-[#7c22d5] rounded-xl text-white font-black text-sm no-underline text-center"
              >
                Usar Unbound
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
