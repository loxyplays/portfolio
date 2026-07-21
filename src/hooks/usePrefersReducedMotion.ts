"use client";

import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Reports the user's motion preference.
 *
 * Starts `false` on both server and first client render so hydration matches,
 * then corrects itself in an effect. Consumers should treat the initial frame
 * as "motion allowed" and tear down if this flips true.
 */
export function usePrefersReducedMotion() {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(QUERY);
    setPrefersReduced(mql.matches);

    const onChange = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return prefersReduced;
}

/** True only on devices with a precise pointer — gates the custom cursor. */
export function useHasFinePointer() {
  const [fine, setFine] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(pointer: fine)");
    setFine(mql.matches);

    const onChange = (e: MediaQueryListEvent) => setFine(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return fine;
}
