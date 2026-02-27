"use client";

import Link from "next/link";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-[calc(100vh-64px)] bg-[#000904] flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
      <div className="fixed top-[-200px] left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[radial-gradient(ellipse,rgba(124,34,213,0.15)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative animate-[fadeUp_0.5s_ease_both]">
        <div className="w-16 h-16 rounded-full bg-[rgba(240,96,96,0.1)] border border-[rgba(240,96,96,0.3)] flex items-center justify-center mx-auto mb-6">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f06060" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h1 className="text-white font-black text-2xl mb-3">
          Algo deu errado
        </h1>
        <p className="text-white/45 font-medium text-sm max-w-sm mb-8">
          Ocorreu um erro inesperado. Tente novamente ou volte ao início.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <button
            onClick={reset}
            className="py-3 px-8 rounded-xl bg-[#7c22d5] text-white font-bold text-sm hover:bg-[#6a1cb8] transition-colors cursor-pointer"
          >
            Tentar novamente
          </button>
          <Link
            href="/"
            className="py-3 px-8 rounded-xl bg-transparent border border-white/10 text-white/65 font-bold text-sm hover:border-white/25 transition-colors"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    </main>
  );
}
