import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Enviar Dinheiro",
  robots: { index: false, follow: false },
};

export default function SendLayout({ children }: { children: React.ReactNode }) {
  return children;
}
