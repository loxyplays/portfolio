"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * The fixed atmosphere behind every section: grid, drifting light, noise and
 * a vignette. Fixed rather than per-section so scrolling reveals it like a
 * window moving across a room instead of repeating a texture.
 */
export function Backdrop() {
  const prefersReduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll();

  // The grid recedes slightly as you scroll — a very cheap depth cue.
  const gridY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const gridOpacity = useTransform(scrollYProgress, [0, 0.35, 1], [1, 0.55, 0.3]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Grid plane */}
      <motion.div
        className="grid-bg absolute inset-[-15%] mask-fade-b"
        style={prefersReduced ? undefined : { y: gridY, opacity: gridOpacity }}
      />

      {/* Two slow-moving light sources. Monochrome, heavily blurred, so they
          read as illumination rather than as coloured blobs. */}
      <div className="absolute left-[8%] top-[-10%] h-[42rem] w-[42rem] animate-drift rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.075),transparent_65%)] blur-3xl" />
      <div
        className="absolute right-[-6%] top-[38%] h-[38rem] w-[38rem] animate-drift rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.05),transparent_65%)] blur-3xl"
        style={{ animationDelay: "-9s", animationDuration: "31s" }}
      />
      <div
        className="absolute bottom-[-12%] left-[34%] h-[34rem] w-[34rem] animate-drift rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.04),transparent_68%)] blur-3xl"
        style={{ animationDelay: "-17s", animationDuration: "27s" }}
      />

      {/* Vignette — pulls focus to the centre column. */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.55)_100%)]" />

      <NoiseOverlay />
    </div>
  );
}

/**
 * Film grain.
 *
 * The noise is an inline SVG feTurbulence encoded as a data URI — no network
 * request, no image asset, and it tiles seamlessly at any viewport size.
 */
export function NoiseOverlay() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: "220px 220px",
      }}
    />
  );
}
