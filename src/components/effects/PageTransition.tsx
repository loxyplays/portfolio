"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { EASE } from "@/lib/motion";

/**
 * Route-level enter transition: fade and settle.
 *
 * Keyed on the pathname so adding routes later (a /work/[slug] page, say)
 * gets the transition for free. Deliberately enter-only — an exit animation
 * would require holding the App Router's navigation open, which costs more in
 * perceived latency than the effect is worth.
 *
 * This element wraps the entire page, which on this site is ~8,800px tall.
 * That rules out `filter: blur()` on it, however good the effect looks in
 * isolation:
 *
 *   - Stuck at its initial value — an interrupted animation, a suspended
 *     rAF in a background tab, slow hydration — it leaves the whole document
 *     rendering through an 8px Gaussian blur. That is precisely the failure
 *     that shipped, and it is indistinguishable from a broken site.
 *   - Even completed, the residual `filter` pins the page in its own
 *     composited layer and disables subpixel antialiasing, so all text reads
 *     soft.
 *   - Blurring a surface that size costs real frame time on every tick.
 *
 * Opacity and transform are compositor-only and degrade to "visible, in the
 * right place" rather than "unreadable".
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE.out }}
    >
      {children}
    </motion.div>
  );
}
