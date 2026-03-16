import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white" style={{ padding: "64px 0 32px" }}>
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Grid */}
        <div
          className="grid gap-12 pb-10 border-b border-white/10"
          style={{ gridTemplateColumns: "2fr 1fr 1fr" }}
        >
          {/* Brand */}
          <div>
            <span
              className="block text-[22px] font-[800] text-[#9523ef] mb-3"
              style={{ letterSpacing: "-0.03em" }}
            >
              unbound
            </span>
            <p className="text-sm text-white/60 max-w-[360px] leading-relaxed">
              Câmbio digital inteligente para brasileiros que querem pagar menos
              e receber mais.
            </p>
          </div>

          {/* Produto */}
          <div className="flex flex-col gap-2">
            <h5 className="text-sm font-bold uppercase tracking-wide mb-2">
              Produto
            </h5>
            <Link href="#como-funciona" className="text-sm text-white/60 hover:text-white transition-colors no-underline">
              Como funciona
            </Link>
            <Link href="#vantagens" className="text-sm text-white/60 hover:text-white transition-colors no-underline">
              Vantagens
            </Link>
            <Link href="#faq" className="text-sm text-white/60 hover:text-white transition-colors no-underline">
              FAQ
            </Link>
          </div>

          {/* Contato */}
          <div className="flex flex-col gap-2">
            <h5 className="text-sm font-bold uppercase tracking-wide mb-2">
              Contato
            </h5>
            <a href="mailto:oi@unboundcash.com" className="text-sm text-white/60 hover:text-white transition-colors no-underline">
              oi@unboundcash.com
            </a>
            <span className="text-sm text-white/60">@unbound.cash</span>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-6 text-[13px] text-white/40 gap-3">
          <span>&copy; 2026 Unbound. Todos os direitos reservados.</span>
          <div className="flex gap-6">
            <Link href="#" className="text-white/40 hover:text-white transition-colors no-underline">
              Termos
            </Link>
            <Link href="#" className="text-white/40 hover:text-white transition-colors no-underline">
              Privacidade
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
