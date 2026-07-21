import type { MetadataRoute } from "next";
import { site } from "@/lib/data";

// `site.url` is read from an env var, so Next can't prove this route is
// static on its own. Under `output: "export"` it has to be told.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    // /admin is a static file like any other and can't be hidden, but it has
    // no business in search results. It's inert without a valid token.
    rules: { userAgent: "*", allow: "/", disallow: "/admin/" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
