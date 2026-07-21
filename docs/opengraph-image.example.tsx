import { ImageResponse } from "next/og";
import { site } from "@/lib/data";

export const alt = `${site.name} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Rendered once at build time into a real PNG. See the note in robots.ts —
// `output: "export"` needs this stated explicitly.
export const dynamic = "force-static";

/**
 * Social card, rendered at build time.
 *
 * Satori (what powers ImageResponse) supports only a flexbox subset of CSS —
 * no grid, no shorthand `background` with multiple layers, and every element
 * with more than one child needs an explicit `display: flex`.
 */
export default function OpenGraphImage() {
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
            "radial-gradient(circle at 22% 18%, rgba(255,255,255,0.14), transparent 45%), radial-gradient(circle at 82% 88%, rgba(255,255,255,0.08), transparent 45%)",
          padding: 72,
        }}
      >
        {/* Wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 52,
              height: 52,
              borderRadius: 14,
              backgroundColor: "#fafafa",
              color: "#050505",
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            {site.initials}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 24,
              color: "#a1a1aa",
              letterSpacing: "-0.01em",
            }}
          >
            {site.name}
          </div>
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 76,
              lineHeight: 1.05,
              letterSpacing: "-0.045em",
              color: "#fafafa",
              fontWeight: 600,
              maxWidth: 940,
            }}
          >
            Building digital experiences that feel futuristic.
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

        {/* Footer rule */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              width: 120,
              height: 3,
              borderRadius: 2,
              backgroundColor: "#fafafa",
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
