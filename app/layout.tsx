import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "@/components/Providers";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#050A08",
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
      <body className="min-h-screen overflow-x-hidden bg-[#050A08] text-white font-sans">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
