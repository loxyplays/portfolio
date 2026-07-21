import type { MetadataRoute } from "next";
import { site } from "@/lib/data";

// `site.url` is read from an env var, so Next can't prove this route is
// static on its own. Under `output: "export"` it has to be told.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
