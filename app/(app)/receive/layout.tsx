import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Receber Dinheiro",
  robots: { index: false, follow: false },
};

export default function ReceiveLayout({ children }: { children: React.ReactNode }) {
  return children;
}
