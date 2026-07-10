const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://e-renty.com").replace(/\/$/, "");

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Transactional / auth-gated areas shouldn't be indexed.
      disallow: ["/*/checkout", "/*/profile"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
