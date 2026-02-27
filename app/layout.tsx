import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "UnboundCash — Envie e receba dinheiro sem fronteiras",
  description:
    "Plataforma de pagamentos internacionais simples, segura e rápida para o Brasil.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        {/* Providers envolve tudo para disponibilizar SessionProvider do NextAuth */}
        <Providers>
          {/* Header fixo em todas as páginas */}
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
