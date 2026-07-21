"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useUIStore } from "@/store/useUIStore";

/**
 * Inertia scrolling.
 *
 * Lenis drives the real document scroll position (rather than transforming a
 * wrapper), so native scroll events still fire — which means framer-motion's
 * `useScroll`, IntersectionObserver and `position: sticky` all keep working
 * untouched. Anchor clicks are intercepted so in-page jumps get eased too.
 */
export function SmoothScroll() {
  const prefersReduced = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.15,
      // Exponential ease-out: quick response, long glide.
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      // Trackpads already have inertia; only smooth genuine wheel input.
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
    });

    let raf = 0;
    const frame = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    // Ease in-page anchor navigation instead of letting the browser jump.
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || !href.startsWith("#") || href === "#") return;

      const el = document.querySelector(href);
      if (!el) return;

      event.preventDefault();

      // Offset clears the floating navbar.
      const go = () =>
        lenis.scrollTo(el as HTMLElement, { offset: -96, duration: 1.35 });

      // The mobile menu locks scrolling with `overflow: hidden` on <body>,
      // which also blocks programmatic scrolling. Its own onClick closes the
      // menu, but React hasn't committed that state — let alone run the
      // effect that releases the lock — by the time this document-level
      // listener fires. Two frames puts us safely after the commit and its
      // passive effects; scrolling any earlier is silently swallowed.
      if (useUIStore.getState().menuOpen) {
        useUIStore.getState().setMenuOpen(false);
        requestAnimationFrame(() => requestAnimationFrame(go));
      } else {
        go();
      }

      // Keep the URL in sync without triggering a native jump.
      window.history.pushState(null, "", href);
    };

    document.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("click", onClick);
      lenis.destroy();
    };
  }, [prefersReduced]);

  return null;
}
