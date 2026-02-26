import type { Metadata } from "next";
import { Red_Hat_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

// Fonte Red Hat Display — mesma usada no formulário de cadastro
const redHat = Red_Hat_Display({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-red-hat",
});

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
      <body className={`${redHat.variable} antialiased`}>
        {/* Header fixo em todas as páginas */}
        <Header />
        {children}
      </body>
    </html>
  );
}
