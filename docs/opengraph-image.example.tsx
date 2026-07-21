import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { site } from "@/lib/data";

export const alt = site.siteName;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";

/**
 * Social card, rendered once at build time.
 *
 * Satori (what powers ImageResponse) supports only a flexbox subset of CSS —
 * no grid, no multi-layer background shorthand, and any element with more
 * than one child needs an explicit `display: flex`.
 *
 * The logo is inlined as a data URI because Satori resolves `<img src>` at
 * render time with no dev server to fetch from, and a relative path would
 * simply come back empty.
 */
export default function OpenGraphImage() {
  const logo = readFileSync(join(process.cwd(), "public", "logo.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#050505",
          backgroundImage:
            "radial-gradient(circle at 20% 15%, rgba(167,139,250,0.16), transparent 45%), radial-gradient(circle at 85% 90%, rgba(255,255,255,0.07), transparent 45%)",
          padding: 72,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} width={72} height={56} alt="" />
          <div
            style={{
              display: "flex",
              fontSize: 26,
              color: "#a1a1aa",
              letterSpacing: "-0.01em",
            }}
          >
            {site.siteName}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 74,
              lineHeight: 1.05,
              letterSpacing: "-0.045em",
              color: "#fafafa",
              fontWeight: 600,
              maxWidth: 950,
            }}
          >
            {site.heroHeadline}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: 26,
              color: "#71717a",
              letterSpacing: "-0.01em",
            }}
          >
            {site.role} · {site.location}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              width: 120,
              height: 3,
              borderRadius: 2,
              backgroundColor: "#a78bfa",
            }}
          />
          <div style={{ display: "flex", fontSize: 22, color: "#52525b" }}>
            {site.url.replace(/^https?:\/\//, "")}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
