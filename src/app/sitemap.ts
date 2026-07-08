import { MetadataRoute } from "next";

const BASE_URL = "https://iyora.or.id";
const LOCALES = ["id", "en"];
const PAGES = [
  { path: "",              priority: 1.0,  changeFreq: "weekly"  as const },
  { path: "/competitions", priority: 0.9,  changeFreq: "weekly"  as const },
  { path: "/about",        priority: 0.8,  changeFreq: "monthly" as const },
  { path: "/contact",      priority: 0.7,  changeFreq: "monthly" as const },
  { path: "/news",         priority: 0.7,  changeFreq: "weekly"  as const },
  { path: "/partners",     priority: 0.6,  changeFreq: "monthly" as const },
];

const EVENT_SLUGS = [
  "iygo", "nygo", "iyeo", "nyeo",
  "iybo", "nybo", "iyco", "nyco",
  "iymo", "nymo", "iypo", "nypo",
  "wso",  "os2mn",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [];
  const now = new Date();

  // Main website pages
  for (const locale of LOCALES) {
    for (const { path, priority, changeFreq } of PAGES) {
      routes.push({
        url: `${BASE_URL}/${locale}${path}`,
        lastModified: now,
        changeFrequency: changeFreq,
        priority,
        alternates: {
          languages: Object.fromEntries(
            LOCALES.map((l) => [l === "id" ? "id-ID" : "en-US", `${BASE_URL}/${l}${path}`])
          ),
        },
      });
    }
  }

  // Event subdomains
  for (const slug of EVENT_SLUGS) {
    routes.push({
      url: `https://${slug}.iyora.or.id`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    });
    routes.push({
      url: `https://${slug}.iyora.or.id/register`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    });
  }

  return routes;
}
