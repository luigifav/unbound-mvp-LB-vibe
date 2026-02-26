"use client";

// Componente client-side para o botão de logout
// Precisa ser separado para que o Dashboard possa ser um Server Component
import { useState } from "react";
import { signOut } from "next-auth/react";

const C = {
  purple: "#7c22d5",
  purpleLight: "#9b4de0",
  white: "#ffffff",
  grayBorder: "rgba(255,255,255,0.1)",
  textSub: "rgba(255,255,255,0.65)",
};

const font = "'Red Hat Display', sans-serif";

export default function LogoutButton() {
  const [hovered, setHovered] = useState(false);

  // Chama signOut e redireciona para a página de login após deslogar
  function handleLogout() {
    signOut({ callbackUrl: "/login" });
  }

  return (
    <button
      onClick={handleLogout}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "9px 20px",
        background: "transparent",
        border: `1px solid ${hovered ? C.purple : C.grayBorder}`,
        borderRadius: "8px",
        color: hovered ? C.white : C.textSub,
        fontFamily: font,
        fontWeight: 700,
        fontSize: "13px",
        cursor: "pointer",
        transition: "all 0.2s",
        letterSpacing: "0.02em",
      }}
    >
      Sair
    </button>
  );
}
