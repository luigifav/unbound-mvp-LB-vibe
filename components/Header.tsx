"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Vantagens", href: "#vantagens" },
  { label: "Como funciona", href: "#como-funciona" },
  { label: "FAQ", href: "#faq" },
  { label: "Sobre nós", href: "/sobre" },
];

export default function Header() {
  const [menuAberto, setMenuAberto] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-[1000] flex items-center gap-8 py-3 px-7 bg-white/[0.92] backdrop-blur-[20px] rounded-full transition-shadow duration-300 ${
        scrolled
          ? "shadow-[0_4px_24px_rgba(0,0,0,0.12),0_1px_3px_rgba(0,0,0,0.06)]"
          : "shadow-[0_4px_24px_rgba(0,0,0,0.08),0_1px_3px_rgba(0,0,0,0.04)]"
      }`}
    >
      {/* Logo */}
      <Link
        href="/"
        className="font-[800] text-xl tracking-tight text-[#9523ef] no-underline"
        style={{ letterSpacing: "-0.03em" }}
      >
        unbound
      </Link>

      {/* Desktop nav */}
      <div className="hidden md:flex items-center gap-6">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href.startsWith("#") && isHome ? link.href : link.href.startsWith("#") ? `/${link.href}` : link.href}
            className={`text-sm font-medium no-underline transition-colors duration-200 ${
              pathname === link.href
                ? "text-[#9523ef] font-semibold"
                : "text-[#52525b] hover:text-[#0a0a0a]"
            }`}
          >
            {link.label}
          </Link>
        ))}
        <Link
          href="/register"
          className="relative overflow-hidden inline-flex items-center py-2 px-5 text-sm font-semibold bg-[#9523ef] text-white rounded-full no-underline hover:bg-[#7a1bc9] transition-all duration-300 hover:-translate-y-px"
        >
          <span className="relative z-10">Use a Unbound</span>
          <span
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
              animation: "shimmerSlide 2.5s linear infinite",
            }}
          />
        </Link>
      </div>

      {/* Mobile hamburger */}
      <button
        className="flex md:hidden flex-col gap-1 bg-transparent border-none cursor-pointer p-1.5"
        onClick={() => setMenuAberto(!menuAberto)}
        aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
        aria-expanded={menuAberto}
      >
        <span
          className="block w-5 h-0.5 bg-[#0a0a0a] rounded-sm transition-all duration-300"
          style={menuAberto ? { transform: "rotate(45deg) translate(4px, 4px)" } : {}}
        />
        <span
          className="block w-5 h-0.5 bg-[#0a0a0a] rounded-sm transition-all duration-300"
          style={menuAberto ? { opacity: 0 } : {}}
        />
        <span
          className="block w-5 h-0.5 bg-[#0a0a0a] rounded-sm transition-all duration-300"
          style={menuAberto ? { transform: "rotate(-45deg) translate(4px, -4px)" } : {}}
        />
      </button>

      {/* Mobile menu */}
      {menuAberto && (
        <div className="absolute top-full left-0 right-0 mt-2 flex flex-col bg-white/[0.96] backdrop-blur-[20px] rounded-b-3xl shadow-[0_8px_24px_rgba(0,0,0,0.1)] p-4 gap-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href.startsWith("#") && isHome ? link.href : link.href.startsWith("#") ? `/${link.href}` : link.href}
              onClick={() => setMenuAberto(false)}
              className="block py-3 px-4 rounded-xl text-sm font-medium no-underline text-[#52525b] hover:bg-[#f5f0fc]"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/register"
            onClick={() => setMenuAberto(false)}
            className="block py-3.5 bg-[#9523ef] rounded-xl text-white font-[800] text-sm no-underline text-center"
          >
            Use a Unbound
          </Link>
        </div>
      )}
    </nav>
  );
}
