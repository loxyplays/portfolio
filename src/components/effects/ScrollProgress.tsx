"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** Hairline progress bar pinned to the top of the viewport. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[9998] h-px origin-left bg-gradient-to-r from-white/0 via-white/70 to-white/0"
    />
  );
}
