import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#000904] flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
      <div className="fixed top-[-200px] left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[radial-gradient(ellipse,rgba(124,34,213,0.15)_0%,transparent_70%)] pointer-events-none z-0" />

      <div className="relative animate-[fadeUp_0.5s_ease_both]">
        <p className="text-[#7c22d5] font-black text-[80px] leading-none tracking-tight mb-4">
          404
        </p>
        <h1 className="text-white font-black text-2xl mb-3">
          Página não encontrada
        </h1>
        <p className="text-white/45 font-medium text-sm max-w-sm mb-8">
          A página que você procura não existe ou foi movida.
        </p>
        <Link
          href="/"
          className="inline-block py-3 px-8 rounded-xl bg-[#7c22d5] text-white font-bold text-sm hover:bg-[#6a1cb8] transition-colors"
        >
          Voltar ao início
        </Link>
      </div>
    </main>
  );
}
