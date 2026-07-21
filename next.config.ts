import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  /**
   * Static export: `next build` emits a plain `out/` folder of HTML, CSS, JS
   * and assets that any file server can host — no Node runtime required.
   *
   * The trade-offs, all of which this project accommodates:
   *   - No API routes. The contact form posts to a configurable third-party
   *     endpoint instead, falling back to mailto. See ContactForm.tsx.
   *   - No on-demand image optimisation, hence `unoptimized` below.
   *   - `headers()` is ignored, since there's no server to send them. Set
   *     security headers at the host instead (see README).
   *
   * To move to a Node host (Vercel, a VPS) later: delete `output` and
   * `images.unoptimized`, and restore the route in docs/contact-route.example.ts
   * to src/app/api/contact/route.ts.
   */
  output: "export",

  // Emits `about/index.html` rather than `about.html`, so bare paths resolve
  // correctly on hosts that don't rewrite extensions.
  trailingSlash: true,

  images: {
    // Required by `output: "export"` — there's no server to resize on demand.
    // The project covers are vector art, so nothing is lost here.
    unoptimized: true,
  },
};

export default nextConfig;
