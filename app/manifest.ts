import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "UnboundCash",
    short_name: "UnboundCash",
    description:
      "Plataforma de pagamentos internacionais simples, segura e rápida para o Brasil.",
    start_url: "/",
    display: "standalone",
    background_color: "#000904",
    theme_color: "#7c22d5",
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
