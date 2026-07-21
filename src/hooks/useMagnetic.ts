"use client";

import { useCallback, useRef } from "react";
import { useMotionValue, useSpring, type MotionValue } from "framer-motion";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

type MagneticOptions = {
  /** How far the element travels toward the pointer, as a fraction of offset. */
  strength?: number;
  /** Max travel in px on each axis. */
  max?: number;
};

type MagneticResult = {
  /**
   * Callback ref. Typed against HTMLElement, which makes it assignable to a
   * `Ref<HTMLAnchorElement>` / `Ref<HTMLButtonElement>` slot by ordinary
   * parameter contravariance — no casting needed at the call site.
   */
  setRef: (el: HTMLElement | null) => void;
  x: MotionValue<number>;
  y: MotionValue<number>;
  handlers: {
    onMouseMove: (event: React.MouseEvent) => void;
    onMouseLeave: () => void;
  };
};

/**
 * Pulls an element toward the cursor while it's hovered.
 *
 * Returns spring-backed motion values plus the handlers to spread onto the
 * element. Deliberately a hook rather than a component so it can wrap buttons,
 * links or anything else without introducing a wrapper node.
 */
export function useMagnetic({
  strength = 0.35,
  max = 14,
}: MagneticOptions = {}): MagneticResult {
  const elementRef = useRef<HTMLElement | null>(null);
  const prefersReduced = usePrefersReducedMotion();

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const x = useSpring(rawX, { stiffness: 320, damping: 26, mass: 0.5 });
  const y = useSpring(rawY, { stiffness: 320, damping: 26, mass: 0.5 });

  const setRef = useCallback((el: HTMLElement | null) => {
    elementRef.current = el;
  }, []);

  const onMouseMove = useCallback(
    (event: React.MouseEvent) => {
      const el = elementRef.current;
      if (prefersReduced || !el) return;

      const rect = el.getBoundingClientRect();
      const offsetX = event.clientX - (rect.left + rect.width / 2);
      const offsetY = event.clientY - (rect.top + rect.height / 2);

      rawX.set(Math.max(-max, Math.min(max, offsetX * strength)));
      rawY.set(Math.max(-max, Math.min(max, offsetY * strength)));
    },
    [prefersReduced, max, strength, rawX, rawY],
  );

  const onMouseLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  return { setRef, x, y, handlers: { onMouseMove, onMouseLeave } };
}
