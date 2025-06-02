import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/chat"],
    },
    sitemap: "https://chatlyz.xyz/sitemap.xml",
  };
}
