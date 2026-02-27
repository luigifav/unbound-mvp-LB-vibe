import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard/", "/send/", "/receive/", "/api/"],
    },
    sitemap: "https://unboundcash.com/sitemap.xml",
  };
}
