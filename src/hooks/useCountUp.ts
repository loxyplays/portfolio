"use client";

import { useEffect, useState } from "react";
import { animate } from "framer-motion";
import { EASE } from "@/lib/motion";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

/**
 * Counts from 0 to `target` once `active` becomes true.
 *
 * Keeps one decimal place when the target has one (so 3.2M+ doesn't render as
 * "3M+"), otherwise rounds to whole numbers.
 */
export function useCountUp(target: number, active: boolean, duration = 1.8) {
  const prefersReduced = usePrefersReducedMotion();
  const [value, setValue] = useState(0);

  const decimals = Number.isInteger(target) ? 0 : 1;

  useEffect(() => {
    if (!active) return;

    if (prefersReduced) {
      setValue(target);
      return;
    }

    const controls = animate(0, target, {
      duration,
      ease: EASE.out,
      onUpdate: (latest) => setValue(Number(latest.toFixed(decimals))),
    });

    return () => controls.stop();
  }, [active, target, duration, decimals, prefersReduced]);

  return value.toFixed(decimals);
}
