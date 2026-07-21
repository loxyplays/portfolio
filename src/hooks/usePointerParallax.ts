"use client";

import { useEffect } from "react";
import { useMotionValue, useSpring } from "framer-motion";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

/**
 * Normalised pointer position over the whole window, as two springs in the
 * range -1..1 (centre = 0).
 *
 * Everything in the hero scene reads from this one listener rather than
 * registering its own, so parallax across a dozen layers costs a single
 * passive mousemove handler.
 */
export function usePointerParallax() {
  const prefersReduced = usePrefersReducedMotion();

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const x = useSpring(rawX, { stiffness: 90, damping: 22, mass: 1.1 });
  const y = useSpring(rawY, { stiffness: 90, damping: 22, mass: 1.1 });

  useEffect(() => {
    if (prefersReduced) {
      rawX.set(0);
      rawY.set(0);
      return;
    }

    // Coarse pointers (touch) have no hover state to parallax against.
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const onMove = (event: MouseEvent) => {
      rawX.set((event.clientX / window.innerWidth) * 2 - 1);
      rawY.set((event.clientY / window.innerHeight) * 2 - 1);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [prefersReduced, rawX, rawY]);

  return { x, y };
}
