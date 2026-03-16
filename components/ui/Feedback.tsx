"use client";

const font = "'Red Hat Display', -apple-system, BlinkMacSystemFont, sans-serif";

interface FeedbackProps {
  type: "success" | "error";
  message: string;
  onClose?: () => void;
}

export default function Feedback({ type, message, onClose }: FeedbackProps) {
  const isSuccess = type === "success";

  const colors = isSuccess
    ? {
        bg:     "rgba(34,197,94,0.10)",
        border: "rgba(34,197,94,0.30)",
        text:   "#166534",
        icon:   "#22c55e",
      }
    : {
        bg:     "rgba(240,96,96,0.08)",
        border: "rgba(240,96,96,0.25)",
        text:   "#991b1b",
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
      <div style={{ flexShrink: 0, marginTop: "1px" }}>
        {isSuccess ? <IconCheck color={colors.icon} /> : <IconAlert color={colors.icon} />}
      </div>

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
