"use client";

// Componente de mensagem de erro e sucesso — mesmo visual dos banners do formulário
const font = "'Red Hat Display', sans-serif";

interface FeedbackProps {
  /** "success" exibe banner verde, "error" exibe banner vermelho */
  type: "success" | "error";
  /** Mensagem exibida ao usuário */
  message: string;
  /** Callback opcional para fechar o banner */
  onClose?: () => void;
}

// Componente Feedback: banner de sucesso ou erro com ícone e botão de fechar opcional
export default function Feedback({ type, message, onClose }: FeedbackProps) {
  const isSuccess = type === "success";

  // Cores específicas para cada tipo de feedback
  const colors = isSuccess
    ? {
        bg:     "rgba(76,175,130,0.1)",
        border: "rgba(76,175,130,0.3)",
        text:   "rgba(100,220,170,0.9)",
        icon:   "#4caf82",
      }
    : {
        bg:     "rgba(240,96,96,0.08)",
        border: "rgba(240,96,96,0.25)",
        text:   "rgba(240,150,150,0.9)",
        icon:   "#f06060",
      };

  return (
    <div
      role="alert"
      style={{
        display:      "flex",
        gap:          "10px",
        alignItems:   "flex-start",
        background:   colors.bg,
        border:       `1px solid ${colors.border}`,
        borderRadius: "10px",
        padding:      "12px 14px",
        animation:    "fadeUp 0.3s ease",
        fontFamily:   font,
      }}
    >
      {/* Ícone: check para sucesso, exclamação para erro */}
      <div style={{ flexShrink: 0, marginTop: "1px" }}>
        {isSuccess ? <IconCheck color={colors.icon} /> : <IconAlert color={colors.icon} />}
      </div>

      {/* Texto da mensagem */}
      <p style={{
        fontWeight:  500,
        fontSize:    "13px",
        color:       colors.text,
        margin:      0,
        lineHeight:  "1.6",
        flex:        1,
      }}>
        {message}
      </p>

      {/* Botão de fechar — só exibido se onClose for fornecido */}
      {onClose && (
        <button
          onClick={onClose}
          aria-label="Fechar"
          style={{
            background:   "transparent",
            border:       "none",
            cursor:       "pointer",
            padding:      "2px",
            color:        colors.icon,
            flexShrink:   0,
            lineHeight:   1,
          }}
        >
          <svg width="14" height="14" fill="none" viewBox="0 0 14 14">
            <path d="M2 2l10 10M12 2L2 12" stroke={colors.icon} strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  );
}

// ─── Ícones internos ──────────────────────────────────────────────

function IconCheck({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke={color} strokeWidth="1.4" />
      <path d="M4.5 8l2.5 2.5L11.5 5" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconAlert({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke={color} strokeWidth="1.4" />
      <path d="M8 5v3.5M8 10.5v.5" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
