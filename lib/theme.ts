// Design tokens centralizados — fonte única de verdade para cores do projeto
// Usados pelos componentes que ainda utilizam inline styles (register, etc.)
// As CSS variables em globals.css devem espelhar estes valores.

export const colors = {
  purple: "#9523ef",
  purpleLight: "#7a1bc9",
  purpleDim: "rgba(149,35,239,0.12)",
  purpleBorder: "rgba(149,35,239,0.25)",
  white: "#ffffff",
  black: "#0a0a0a",
  bgSubtle: "#f5f0fc",
  inputBg: "#f9f7fd",
  inputBorder: "#e0d8ee",
  cardBg: "#ffffff",
  cardBorder: "#e8e0f0",
  grayLight: "#f5f0fc",
  grayBorder: "#e8e0f0",
  textPrimary: "#0a0a0a",
  textSecondary: "#52525b",
  textMuted: "#a1a1aa",
  textSub: "#52525b",
  error: "#f06060",
  success: "#22c55e",
  heroBg: "#1a0a2e",
  footerBg: "#000000",
} as const;

export const font = "'Red Hat Display', -apple-system, BlinkMacSystemFont, sans-serif";
export const fontMono = "'Geist Mono', monospace";
