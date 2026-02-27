import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000904",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://unboundcash.com"),
  title: {
    default: "UnboundCash — Envie e receba dinheiro sem fronteiras",
    template: "%s — UnboundCash",
  },
  description:
    "Plataforma de pagamentos internacionais simples, segura e rápida para o Brasil. Envie e receba dinheiro com câmbio justo e sem taxas ocultas.",
  keywords: [
    "pagamentos internacionais",
    "enviar dinheiro",
    "receber dinheiro",
    "remessas internacionais",
    "câmbio",
    "Brasil",
    "USDC",
    "transferência internacional",
    "UnboundCash",
  ],
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "UnboundCash",
    title: "UnboundCash — Envie e receba dinheiro sem fronteiras",
    description:
      "Plataforma de pagamentos internacionais simples, segura e rápida para o Brasil.",
    url: "https://unboundcash.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "UnboundCash — Envie e receba dinheiro sem fronteiras",
    description:
      "Plataforma de pagamentos internacionais simples, segura e rápida para o Brasil.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
