export default function JsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "UnboundCash",
        url: "https://unboundcash.com",
        description:
          "Plataforma de pagamentos internacionais simples, segura e rápida para o Brasil.",
      },
      {
        "@type": "WebSite",
        name: "UnboundCash",
        url: "https://unboundcash.com",
        description:
          "Envie e receba dinheiro sem fronteiras, sem burocracia.",
        inLanguage: "pt-BR",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
