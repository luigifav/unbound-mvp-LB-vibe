import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#000904] pt-16 pb-8 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Top row: logo + nav links */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 no-underline" aria-label="UnboundCash - Página inicial">
            <div className="w-[30px] h-[30px] rounded-lg bg-[#7c22d5] flex items-center justify-center shrink-0">
              <span className="text-white font-black text-sm">U</span>
            </div>
            <span className="text-white font-black text-lg tracking-tight">
              UnboundCash
            </span>
          </Link>

          {/* Nav links */}
          <nav className="flex gap-6 flex-wrap justify-center sm:justify-end" aria-label="Links do rodapé">
            <Link href="#como-funciona" className="text-white/25 text-xs font-bold no-underline hover:text-white/50 transition-colors">
              Como funciona
            </Link>
            <Link href="#cambio" className="text-white/25 text-xs font-bold no-underline hover:text-white/50 transition-colors">
              Câmbio
            </Link>
            <Link href="/register" className="text-white/25 text-xs font-bold no-underline hover:text-white/50 transition-colors">
              Criar conta
            </Link>
            <Link href="/login" className="text-white/25 text-xs font-bold no-underline hover:text-white/50 transition-colors">
              Entrar
            </Link>
          </nav>
        </div>

        {/* Bottom row: copyright */}
        <p className="text-center text-gray-500 text-sm mt-8">
          &copy; {new Date().getFullYear()} UnboundCash &middot; Protegido com criptografia de ponta a ponta
        </p>
      </div>
    </footer>
  );
}
