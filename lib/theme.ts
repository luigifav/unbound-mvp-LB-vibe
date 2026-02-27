// Design tokens centralizados — fonte única de verdade para cores do projeto
// Usados pelos componentes que ainda utilizam inline styles (register, etc.)
// As CSS variables em globals.css devem espelhar estes valores.

export const colors = {
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
  success: "#4caf82",
} as const;

export const font = "'Red Hat Display', sans-serif";
