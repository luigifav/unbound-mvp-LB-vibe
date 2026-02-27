import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#000904]">
      <div className="max-w-[960px] mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="font-bold text-[10px] text-white/15 tracking-[0.12em] uppercase">
          &copy; {new Date().getFullYear()} UnboundCash &middot; Protegido com criptografia de ponta a ponta
        </p>
        <nav className="flex gap-6" aria-label="Links do rodapé">
          <Link href="/register" className="text-white/25 text-xs font-bold no-underline hover:text-white/50 transition-colors">
            Criar conta
          </Link>
          <Link href="/login" className="text-white/25 text-xs font-bold no-underline hover:text-white/50 transition-colors">
            Entrar
          </Link>
        </nav>
      </div>
    </footer>
  );
}
