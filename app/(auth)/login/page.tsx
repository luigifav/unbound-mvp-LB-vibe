"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    const resultado = await signIn("credentials", {
      email,
      password: senha,
      callbackUrl: "/dashboard",
      redirect: false,
    });

    setCarregando(false);

    if (resultado?.error) {
      setErro("Email ou senha incorretos. Tente novamente.");
    } else if (resultado?.url) {
      window.location.href = resultado.url;
    }
  }

  return (
    <main className="min-h-screen bg-[#000904] flex items-center justify-center p-6">
      {/* Glow decorativo */}
      <div className="fixed top-[30%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(124,34,213,0.12)_0%,transparent_70%)] pointer-events-none z-0" />

      {/* Card do formulário */}
      <div className="relative z-[1] w-full max-w-[420px] bg-white/[0.06] border border-white/10 rounded-2xl px-9 py-10 animate-[fadeUp_0.4s_ease_both]">
        {/* Logo e título */}
        <div className="text-center mb-8">
          <div className="w-11 h-11 rounded-xl bg-[#7c22d5] flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-black text-xl">U</span>
          </div>
          <h1 className="text-white font-black text-[22px] tracking-tight mb-2">
            Entrar na sua conta
          </h1>
          <p className="text-white/45 text-sm font-medium">
            Acesse sua plataforma de remessas
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="font-bold text-[11px] tracking-widest uppercase text-white/45">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="bg-white/[0.04] border border-[rgba(124,34,213,0.35)] rounded-lg px-3.5 py-3 text-white text-sm font-medium outline-none w-full focus:border-[#7c22d5] focus:bg-[rgba(124,34,213,0.08)] transition-colors placeholder:text-white/20"
            />
          </div>

          {/* Senha */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="senha" className="font-bold text-[11px] tracking-widest uppercase text-white/45">
              Senha
            </label>
            <input
              id="senha"
              type="password"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              className="bg-white/[0.04] border border-[rgba(124,34,213,0.35)] rounded-lg px-3.5 py-3 text-white text-sm font-medium outline-none w-full focus:border-[#7c22d5] focus:bg-[rgba(124,34,213,0.08)] transition-colors placeholder:text-white/20"
            />
          </div>

          {/* Mensagem de erro */}
          {erro && (
            <div className="bg-[rgba(240,96,96,0.1)] border border-[rgba(240,96,96,0.3)] rounded-lg px-3.5 py-3 text-[#f06060] text-[13px] font-medium" role="alert">
              {erro}
            </div>
          )}

          {/* Botão entrar */}
          <button
            type="submit"
            disabled={carregando}
            className="w-full py-3.5 bg-[#7c22d5] rounded-lg text-white font-black text-[15px] tracking-wide transition-colors hover:bg-[#6a1cb8] disabled:bg-[rgba(124,34,213,0.5)] disabled:cursor-not-allowed cursor-pointer"
          >
            {carregando ? "Entrando…" : "Entrar"}
          </button>
        </form>

        {/* Link criar conta */}
        <p className="text-center mt-6 text-white/45 text-[13px] font-medium">
          Não tem conta?{" "}
          <Link href="/register" className="text-[#9b4de0] no-underline font-bold">
            Criar conta
          </Link>
        </p>
      </div>
    </main>
  );
}
