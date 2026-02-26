// Dashboard — Server Component
// Busca a sessão no servidor e exibe os dados do usuário logado
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth";
import LogoutButton from "@/components/LogoutButton";

// ─── Design tokens — mesma paleta do resto do projeto ─────────────
const C = {
  purple: "#7c22d5",
  purpleDim: "rgba(124,34,213,0.15)",
  purpleBorder: "rgba(124,34,213,0.35)",
  white: "#ffffff",
  black: "#000904",
  grayLight: "rgba(255,255,255,0.06)",
  grayBorder: "rgba(255,255,255,0.1)",
  textMuted: "rgba(255,255,255,0.45)",
  textSub: "rgba(255,255,255,0.65)",
};

const font = "'Red Hat Display', sans-serif";

export default async function DashboardPage() {
  // Busca a sessão atual no servidor — retorna null se não autenticado
  const session = await getServerSession();

  // Redireciona para login se não há sessão ativa
  // O middleware já protege essa rota, mas a verificação aqui é uma camada extra
  if (!session) {
    redirect("/login");
  }

  // TODO: futuramente, buscar dados completos do usuário no banco de dados
  // usando session.user.email ou session.user.id como chave de busca
  const nomeExibicao = session.user?.name || session.user?.email || "Usuário";

  return (
    <main
      style={{
        minHeight: "100vh",
        background: C.black,
        fontFamily: font,
        padding: "32px 24px",
      }}
    >
      <div style={{ maxWidth: "960px", margin: "0 auto" }}>

        {/* Cabeçalho do dashboard com saudação e botão de logout */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
            marginBottom: "40px",
            paddingBottom: "24px",
            borderBottom: `1px solid ${C.grayBorder}`,
          }}
        >
          <div>
            <p style={{ color: C.textMuted, fontSize: "13px", fontWeight: 500, margin: "0 0 4px" }}>
              Bem-vindo de volta
            </p>
            {/* Nome ou email do usuário logado — virá do banco de dados futuramente */}
            <h1
              style={{
                color: C.white,
                fontWeight: 900,
                fontSize: "24px",
                letterSpacing: "-0.02em",
                margin: 0,
              }}
            >
              {nomeExibicao}
            </h1>
          </div>

          {/* Botão de logout — client component separado pois usa next-auth/react */}
          <LogoutButton />
        </div>

        {/* Grid de cards do dashboard */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "16px",
          }}
        >
          {/* Card: Saldo — placeholder até integração com a API */}
          <DashCard titulo="Saldo disponível" valor="—" descricao="Dados em breve" />
          {/* Card: Envios — placeholder */}
          <DashCard titulo="Remessas enviadas" valor="—" descricao="Dados em breve" />
          {/* Card: Recebimentos — placeholder */}
          <DashCard titulo="Valores recebidos" valor="—" descricao="Dados em breve" />
        </div>

      </div>
    </main>
  );
}

// ─── Sub-componente: card de estatística ───────────────────────────
function DashCard({ titulo, valor, descricao }: { titulo: string; valor: string; descricao: string }) {
  return (
    <div
      style={{
        background: C.grayLight,
        border: `1px solid ${C.grayBorder}`,
        borderRadius: "12px",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      <span
        style={{
          fontWeight: 700,
          fontSize: "11px",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: C.textMuted,
        }}
      >
        {titulo}
      </span>
      <span style={{ color: "#ffffff", fontWeight: 900, fontSize: "28px", letterSpacing: "-0.02em" }}>
        {valor}
      </span>
      <span style={{ color: C.textMuted, fontSize: "12px", fontWeight: 500 }}>
        {descricao}
      </span>
    </div>
  );
}
