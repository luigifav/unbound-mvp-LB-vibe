import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Criar conta",
  description: "Crie sua conta UnboundCash em minutos. Processo 100% online com verificação KYC.",
  robots: { index: true, follow: true },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
