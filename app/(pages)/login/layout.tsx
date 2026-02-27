import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Entrar",
  description: "Acesse sua conta UnboundCash para enviar e receber dinheiro internacionalmente.",
  robots: { index: true, follow: true },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
