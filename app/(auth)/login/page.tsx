"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
    <main
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: "linear-gradient(160deg, #fdf8ff, #f0e8ff, #e8f4ff)" }}
    >
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 flex items-center justify-between px-6 py-4 z-10">
        <Link href="/" className="font-[800] text-xl text-[#9523ef] no-underline" style={{ letterSpacing: "-0.03em" }}>
          unbound
        </Link>
        <Link href="/" className="text-sm font-medium text-[#52525b] hover:text-[#0a0a0a] no-underline transition-colors">
          ← Voltar ao site
        </Link>
      </div>

      {/* Card */}
      <div
        className="relative w-full max-w-[420px] bg-white border border-[#e8e0f0] rounded-[20px] px-9 py-10 animate-[fadeUp_0.4s_ease_both]"
        style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.06), 0 0 40px rgba(149,35,239,0.08)" }}
      >
        {/* Logo and title */}
        <div className="text-center mb-8">
          <div className="w-11 h-11 rounded-xl bg-[rgba(149,35,239,0.12)] flex items-center justify-center mx-auto mb-4">
            <span className="text-[#9523ef] font-black text-xl">U</span>
          </div>
          <h1 className="text-[#0a0a0a] font-black text-[22px] tracking-tight mb-2">
            Entrar na sua conta
          </h1>
          <p className="text-[#a1a1aa] text-sm font-medium">
            Acesse sua plataforma de remessas
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="font-bold text-[11px] tracking-widest uppercase text-[#a1a1aa]">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="bg-[#f9f7fd] border border-[#e0d8ee] rounded-lg px-3.5 py-3 text-[#0a0a0a] text-sm font-medium outline-none w-full focus:border-[#9523ef] focus:shadow-[0_0_0_3px_rgba(149,35,239,0.1)] transition-all placeholder:text-[#a1a1aa]"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="senha" className="font-bold text-[11px] tracking-widest uppercase text-[#a1a1aa]">
              Senha
            </label>
            <div className="relative">
              <input
                id="senha"
                type={showPassword ? "text" : "password"}
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                className="bg-[#f9f7fd] border border-[#e0d8ee] rounded-lg px-3.5 py-3 pr-12 text-[#0a0a0a] text-sm font-medium outline-none w-full focus:border-[#9523ef] focus:shadow-[0_0_0_3px_rgba(149,35,239,0.1)] transition-all placeholder:text-[#a1a1aa]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-[#a1a1aa] hover:text-[#9523ef] transition-colors p-1"
                aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  {showPassword ? (
                    <>
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </>
                  ) : (
                    <>
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </>
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Error */}
          {erro && (
            <div className="bg-[rgba(240,96,96,0.08)] border border-[rgba(240,96,96,0.25)] rounded-lg px-3.5 py-3 text-[#991b1b] text-[13px] font-medium" role="alert">
              {erro}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={carregando}
            className="w-full py-3.5 bg-[#9523ef] rounded-lg text-white font-[900] text-[15px] tracking-wide transition-colors hover:bg-[#7a1bc9] disabled:bg-[rgba(149,35,239,0.5)] disabled:cursor-not-allowed cursor-pointer"
          >
            {carregando ? "Entrando…" : "Entrar"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-[#e8e0f0]" />
          <span className="text-xs text-[#a1a1aa] font-medium">ou</span>
          <div className="flex-1 h-px bg-[#e8e0f0]" />
        </div>

        {/* Register link */}
        <p className="text-center text-[#52525b] text-[13px] font-medium">
          Não tem conta?{" "}
          <Link href="/register" className="text-[#9523ef] no-underline font-bold hover:underline">
            Criar conta grátis
          </Link>
        </p>
      </div>
    </main>
  );
}
