import Link from "next/link";

const footerLinks = {
  Produto: [
    { label: "Como funciona", href: "#como-funciona" },
    { label: "Câmbio", href: "#cambio" },
    { label: "Vantagens", href: "#vantagens" },
    { label: "FAQ", href: "#faq" },
  ],
  Conta: [
    { label: "Criar conta", href: "/register" },
    { label: "Entrar", href: "/login" },
    { label: "Dashboard", href: "/dashboard" },
  ],
  Legal: [
    { label: "Termos de uso", href: "#" },
    { label: "Privacidade", href: "#" },
    { label: "Compliance", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#000904] pt-16 pb-8 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Top row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Link
              href="/"
              className="flex items-center gap-2.5 no-underline w-fit"
              aria-label="Unbound - Página inicial"
            >
              <div className="w-[30px] h-[30px] rounded-lg bg-[#7c22d5] flex items-center justify-center shrink-0">
                <span className="text-white font-black text-sm">U</span>
              </div>
              <span className="text-white font-black text-lg tracking-tight">
                Unbound
              </span>
            </Link>
            <p className="text-white/25 text-sm font-medium leading-relaxed max-w-[280px]">
              Plataforma de câmbio internacional. Envie e receba dinheiro sem
              fronteiras, com câmbio justo e transparência total.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="flex flex-col gap-3">
              <span className="font-bold text-[10px] tracking-[0.14em] uppercase text-white/30">
                {title}
              </span>
              {links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-white/20 text-sm font-medium no-underline hover:text-white/45 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-white/[0.05] mb-6" />

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/15 text-xs font-medium">
            &copy; {new Date().getFullYear()} Unbound &middot; Protegido com
            criptografia de ponta a ponta
          </p>
          <div className="flex items-center gap-1 text-white/15 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/60 animate-pulse" />
            Todos os sistemas operacionais
          </div>
        </div>
      </div>
    </footer>
  );
}
