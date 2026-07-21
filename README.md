# Portfolio

A premium, dark-by-default personal portfolio — Next.js 15 App Router, TypeScript, Tailwind CSS v4, Framer Motion and Zustand.

Builds to **static files**. No Node runtime needed to host it.

---

## Deploying

The site is hosted on GitHub Pages at **loxy.lol**, from the `L0XYY/port` repo.

There are two paths, because GitHub Actions is currently unavailable on this
account (see below).

### Now: manual deploy to `gh-pages`

```bash
npm run deploy
```

Builds, then force-pushes `out/` to the `gh-pages` branch. Requires Pages to be
set to **Settings → Pages → Source → Deploy from a branch → `gh-pages` / `(root)`**.

`scripts/deploy.mjs` refuses to publish if `index.html`, `CNAME` or `.nojekyll`
are missing from the build, since each of those failing silently breaks
something different (the site, the domain, and every stylesheet respectively).

### Later: automatic deploy via Actions

`.github/workflows/deploy.yml` builds and publishes on every push to `main`.
It is committed and ready, but **every run so far has failed before starting**
with:

> The job was not started because your account is locked due to a billing issue.

That's an account-level lock, unrelated to this repo or the workflow — it
affects free accounts that have never purchased anything, usually as leftover
state from an expired trial or a failed card authorisation. GitHub Support can
clear it. Until then the workflow is untested.

Once Actions works, switch **Settings → Pages → Source** to **GitHub Actions**
and pushes to `main` deploy on their own. `npm run deploy` still works as a
manual fallback.

### Other hosts

`npm run build` writes a plain `out/` folder that any file server can host —
Cloudflare Pages, Netlify, S3, nginx. Upload the *contents*, so
`out/index.html` lands at the web root.

### Before the first deploy

`NEXT_PUBLIC_SITE_URL` is baked into canonical tags, `og:url`, `sitemap.xml` and `robots.txt` **at build time**. It currently defaults to `https://loxy.lol` (see `site.url` in `src/lib/data.ts`). If that's wrong, change it there or set the env var — and rebuild, because changing it afterwards does nothing to files already built.

### Security headers

Static hosting means no server of ours to send headers, so `next.config.ts` can't set them. Configure these at the host (Cloudflare rules, `_headers`, nginx, etc.):

```
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
X-Frame-Options: SAMEORIGIN
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

---

## Local development

Needs **Node.js 18.18+**. Installed here via `winget install OpenJS.NodeJS.LTS`.

```bash
npm run dev        # http://localhost:3000
npm run build      # static export to out/
npm run typecheck  # tsc --noEmit
npm run lint       # eslint
```

There's no `npm start` — a static export has nothing to serve. To preview the built output, point any static file server at `out/`.

---

## Making it yours

**Everything you need to edit lives in [`src/lib/data.ts`](src/lib/data.ts).** Name, role, bio, socials, stats, projects, skills, experience and contact copy are all defined there — no component hardcodes content. Change that one file and the whole site updates.

> The content ships as a **placeholder persona** — "Zac Delaney", invented projects, invented metrics. Replace it before showing this to anyone.

| What | Where |
| --- | --- |
| Colours, radii, glass recipes, fonts | [`src/app/globals.css`](src/app/globals.css) (`@theme` block at the top) |
| Project cover art | `public/projects/*.svg` — replace with real screenshots, update `cover` paths in `data.ts` |
| Animation timing and easing | [`src/lib/motion.ts`](src/lib/motion.ts) |
| SEO, Open Graph, JSON-LD | [`src/app/layout.tsx`](src/app/layout.tsx) |
| Favicon | [`src/app/icon.svg`](src/app/icon.svg) |
| Social card image | `public/og.png` — regenerate with `docs/opengraph-image.example.tsx` |

### Contact form

The form validates inline, then submits to whatever `NEXT_PUBLIC_FORM_ENDPOINT` points at — any service accepting a JSON POST and returning 2xx (Formspree, Web3Forms, Basin).

**Leave it unset and the form falls back to opening a pre-filled email** in the visitor's mail client, so the section is never a dead button. The success message adapts to say which happened.

A full server-side handler — validation, per-IP rate limiting, honeypot, Resend delivery — is kept in [`docs/contact-route.example.ts`](docs/contact-route.example.ts). Move it back to `src/app/api/contact/route.ts` if you ever host on a Node runtime.

### Moving to a Node host later

1. Delete `output: "export"` and `images.unoptimized` from `next.config.ts`
2. Restore `docs/contact-route.example.ts` → `src/app/api/contact/route.ts`
3. Point the form back at `/api/contact`
4. Re-add the `headers()` block to `next.config.ts`

---

## Structure

```
src/
├── app/
│   ├── globals.css            design tokens + glass/gradient recipes
│   ├── icon.svg               favicon (ZD monogram, drawn as paths)
│   ├── layout.tsx             fonts, metadata, JSON-LD, skip link
│   ├── page.tsx               composes the six sections
│   ├── providers.tsx          client boundary for global effects
│   ├── robots.ts / sitemap.ts
│
├── components/
│   ├── effects/    Preloader, CustomCursor, SmoothScroll, ParticleField,
│   │               Backdrop, ScrollProgress, PageTransition
│   ├── hero/       HeroVisual — the CSS-3D scene
│   ├── layout/     Navbar, MobileMenu, Footer
│   ├── sections/   Hero, About, Projects, Skills, Experience, Contact
│   └── ui/         MagneticButton, TiltCard, Reveal, AnimatedText,
│                   SectionShell, GlassField, Badge, Icons
│
├── hooks/          useActiveSection, useMagnetic, usePointerParallax,
│                   useCountUp, usePrefersReducedMotion
├── lib/            data.ts (all content), motion.ts, utils.ts
└── store/          useUIStore — Zustand: intro, menu, active section, cursor

docs/               reference code not part of the build
```

---

## Notes on a few decisions

**No React Three Fiber.** The hero visual — floating glass cards, orbital rings, gradient orb, depth parallax — is built from CSS 3D transforms on a shared `perspective`, with a 2D canvas for the particle field. A WebGL runtime would have added roughly 600 KB and a second paint path to draw what the compositor already does for free. `HeroVisual.tsx` is a self-contained swap if you later want real 3D geometry.

**Icons are hand-written**, not a package — 20 SVGs at a consistent 1.5 stroke weight, no dependency to drift.

**The preloader can't trap you.** Its progress counter runs on `requestAnimationFrame`, which browsers suspend in background tabs. Left naive, anyone opening the site in a background tab would arrive at a black curtain with scrolling locked. It now detects a hidden tab, carries a wall-clock failsafe, and tears itself down without an exit animation when either fires — because Framer Motion's exit is rAF-driven too, and would stall under exactly those conditions.

**Performance.** The particle canvas stops rendering when scrolled out of view or when the tab is hidden. All motion runs on transform and opacity. Fonts are self-hosted through `next/font`. First Load JS is ~191 kB.

**Accessibility.** Full keyboard navigation; the mobile menu traps focus, closes on Escape and restores focus to its trigger. Skip link, `aria-current` on the active nav item, labelled progress bars, `role="alert"` on form errors. `prefers-reduced-motion` is honoured throughout — `MotionConfig reducedMotion="user"` covers the Framer tree, and the preloader, custom cursor, smooth scrolling and particle field each disable themselves.
