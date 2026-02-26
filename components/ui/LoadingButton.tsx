"use client";

// Botão com estado de loading — mesma aparência do botão "Enviar Cadastro" do formulário
import { useState } from "react";

// ─── Design tokens — mesma paleta do formulário de cadastro ───────
const C = {
  purple:      "#7c22d5",
  purpleLight: "#9b4de0",
  white:       "#ffffff",
};

const font = "'Red Hat Display', sans-serif";

interface LoadingButtonProps {
  /** Texto exibido quando o botão está disponível */
  label: string;
  /** Texto exibido durante o carregamento */
  loadingLabel: string;
  /** Controla o estado de carregamento externamente */
  isLoading: boolean;
  /** Função chamada ao clicar (quando não está carregando) */
  onClick: () => void;
  /** Largura total do contêiner pai quando true */
  fullWidth?: boolean;
}

// Componente LoadingButton: botão roxo com spinner de loading
export default function LoadingButton({
  label,
  loadingLabel,
  isLoading,
  onClick,
  fullWidth = false,
}: LoadingButtonProps) {
  const [hovered, setHovered] = useState(false);

  // Cor de fundo: desbotada quando carregando, hover mais claro quando disponível
  const bgColor = isLoading
    ? "rgba(124,34,213,0.5)"
    : hovered
    ? C.purpleLight
    : C.purple;

  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width:          fullWidth ? "100%" : "auto",
        padding:        "14px 28px",
        background:     bgColor,
        border:         "none",
        borderRadius:   "10px",
        color:          C.white,
        fontFamily:     font,
        fontWeight:     900,
        fontSize:       "14px",
        letterSpacing:  "0.02em",
        cursor:         isLoading ? "not-allowed" : "pointer",
        display:        "inline-flex",
        alignItems:     "center",
        justifyContent: "center",
        gap:            "8px",
        transition:     "background 0.2s",
      }}
    >
      {isLoading ? (
        <>
          {/* Spinner animado — mesma implementação do formulário */}
          <div style={{
            width:        "14px",
            height:       "14px",
            border:       "2px solid rgba(255,255,255,0.3)",
            borderTopColor: "#fff",
            borderRadius: "50%",
            animation:    "spin 0.7s linear infinite",
            flexShrink:   0,
          }} />
          {loadingLabel}
        </>
      ) : (
        label
      )}
    </button>
  );
}
