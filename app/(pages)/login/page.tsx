"use client";

// Página de login com formulário de email e senha
// Usa next-auth/react no cliente para autenticar o usuário
import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

// ─── Design tokens — mesma paleta do resto do projeto ─────────────
const C = {
  purple: "#7c22d5",
  purpleLight: "#9b4de0",
  purpleDim: "rgba(124,34,213,0.15)",
  purpleBorder: "rgba(124,34,213,0.35)",
  white: "#ffffff",
  black: "#000904",
  grayLight: "rgba(255,255,255,0.06)",
  grayBorder: "rgba(255,255,255,0.1)",
  textMuted: "rgba(255,255,255,0.45)",
  textSub: "rgba(255,255,255,0.65)",
  error: "#f06060",
};

const font = "'Red Hat Display', sans-serif";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  // Envia as credenciais para o NextAuth e trata o resultado
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    // redirect: false permite capturar o erro sem redirecionamento automático
    const resultado = await signIn("credentials", {
      email,
      password: senha,
      callbackUrl: "/dashboard",
      redirect: false,
    });

    setCarregando(false);

    if (resultado?.error) {
      // Exibe mensagem amigável ao usuário em caso de falha
      setErro("Email ou senha incorretos. Tente novamente.");
    } else if (resultado?.url) {
      // Redireciona manualmente para o dashboard após login bem-sucedido
      window.location.href = resultado.url;
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: C.black,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        fontFamily: font,
      }}
    >
      {/* Glow decorativo roxo ao fundo */}
      <div
        style={{
          position: "fixed",
          top: "30%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "600px",
          height: "400px",
          background: "radial-gradient(ellipse at center, rgba(124,34,213,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Card do formulário */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: "420px",
          background: C.grayLight,
          border: `1px solid ${C.grayBorder}`,
          borderRadius: "16px",
          padding: "40px 36px",
          animation: "fadeUp 0.4s ease both",
        }}
      >
        {/* Logo e título */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              background: C.purple,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <span style={{ color: C.white, fontWeight: 900, fontSize: "20px" }}>U</span>
          </div>
          <h1
            style={{
              color: C.white,
              fontWeight: 900,
              fontSize: "22px",
              letterSpacing: "-0.02em",
              margin: "0 0 8px",
            }}
          >
            Entrar na sua conta
          </h1>
          <p style={{ color: C.textMuted, fontSize: "14px", margin: 0, fontWeight: 500 }}>
            Acesse sua plataforma de remessas
          </p>
        </div>

        {/* Formulário de login */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Campo de email */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label
              htmlFor="email"
              style={{
                fontWeight: 700,
                fontSize: "11px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: C.textMuted,
              }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${C.purpleBorder}`,
                borderRadius: "8px",
                padding: "12px 14px",
                color: C.white,
                fontSize: "14px",
                fontFamily: font,
                fontWeight: 500,
                outline: "none",
                width: "100%",
              }}
            />
          </div>

          {/* Campo de senha */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label
              htmlFor="senha"
              style={{
                fontWeight: 700,
                fontSize: "11px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: C.textMuted,
              }}
            >
              Senha
            </label>
            <input
              id="senha"
              type="password"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${C.purpleBorder}`,
                borderRadius: "8px",
                padding: "12px 14px",
                color: C.white,
                fontSize: "14px",
                fontFamily: font,
                fontWeight: 500,
                outline: "none",
                width: "100%",
              }}
            />
          </div>

          {/* Mensagem de erro — exibida apenas quando há falha no login */}
          {erro && (
            <div
              style={{
                background: "rgba(240,96,96,0.1)",
                border: "1px solid rgba(240,96,96,0.3)",
                borderRadius: "8px",
                padding: "12px 14px",
                color: C.error,
                fontSize: "13px",
                fontWeight: 500,
              }}
            >
              {erro}
            </div>
          )}

          {/* Botão de entrar */}
          <button
            type="submit"
            disabled={carregando}
            style={{
              background: carregando ? "rgba(124,34,213,0.5)" : C.purple,
              border: "none",
              borderRadius: "8px",
              padding: "13px",
              color: C.white,
              fontFamily: font,
              fontWeight: 900,
              fontSize: "15px",
              cursor: carregando ? "not-allowed" : "pointer",
              letterSpacing: "0.02em",
              transition: "background 0.2s",
              width: "100%",
            }}
          >
            {carregando ? "Entrando…" : "Entrar"}
          </button>
        </form>

        {/* Link para criar conta */}
        <p
          style={{
            textAlign: "center",
            marginTop: "24px",
            color: C.textMuted,
            fontSize: "13px",
            fontWeight: 500,
          }}
        >
          Não tem conta?{" "}
          <Link
            href="/register"
            style={{
              color: C.purpleLight,
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            Criar conta
          </Link>
        </p>
      </div>
    </main>
  );
}
