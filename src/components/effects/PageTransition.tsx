"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { EASE } from "@/lib/motion";

/**
 * Route-level enter transition: fade, de-blur and slide.
 *
 * Keyed on the pathname so adding routes later (a /work/[slug] page, say)
 * gets the transition for free. Deliberately enter-only — an exit animation
 * would require holding the App Router's navigation open, which costs more in
 * perceived latency than the effect is worth.
 *
 * The blur is dropped from the style entirely once the animation lands. A
 * lingering `filter` — even `blur(0px)` — makes this element a containing
 * block for fixed-position descendants and pins the whole page into its own
 * composited layer, which is an expensive souvenir of a 0.75s animation.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [settled, setSettled] = useState(false);

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
      animate={
        settled
          ? { opacity: 1, y: 0 }
          : { opacity: 1, y: 0, filter: "blur(0px)" }
      }
      transition={{ duration: 0.75, ease: EASE.out }}
      onAnimationComplete={() => setSettled(true)}
    >
      {children}
    </motion.div>
  );
}
