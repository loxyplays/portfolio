import type { Variants } from "framer-motion";

/**
 * Shared easing curves. Declared as explicit 4-tuples because framer-motion's
 * `ease` prop won't accept a widened `number[]`.
 */
export const EASE = {
  /** expo-out — the "settles into place" curve used for nearly all entrances */
  out: [0.16, 1, 0.3, 1] as [number, number, number, number],
  /** expo-in-out — for things that travel both ways, like the mobile menu */
  inOut: [0.83, 0, 0.17, 1] as [number, number, number, number],
};

/**
 * Fade + rise. The default entrance for almost everything.
 *
 * Deliberately no `filter: blur()`. Animating blur is a bad trade here on
 * three counts: it's a per-frame GPU blur on every revealing element; a
 * lingering `filter` (even `blur(0px)`) forces its own composited layer and
 * drops subpixel text antialiasing, so type renders soft; and if the
 * animation is ever interrupted the element is left legibly blurred. Opacity
 * and transform are compositor-only and fail safe.
 */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: EASE.out },
  },
};

/** Entrance for cards and other large surfaces. */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94, y: 18 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE.out },
  },
};

/** Shared viewport config so every reveal triggers at the same point. */
export const VIEWPORT = { once: true, margin: "-12% 0px -12% 0px" } as const;
