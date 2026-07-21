"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { fadeUp, VIEWPORT } from "@/lib/motion";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Seconds to wait after the element enters view. */
  delay?: number;
  variants?: Variants;
  /** Re-run the animation every time it re-enters the viewport. */
  repeat?: boolean;
};

/**
 * Scroll-triggered entrance wrapper.
 *
 * One component, used everywhere, so reveal timing stays identical across
 * sections instead of drifting per-usage.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  variants = fadeUp,
  repeat = false,
}: RevealProps) {
  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      whileInView="show"
      viewport={repeat ? { ...VIEWPORT, once: false } : VIEWPORT}
      variants={variants}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

type StaggerGroupProps = {
  children: ReactNode;
  className?: string;
  /** Seconds between consecutive children. */
  gap?: number;
  delayChildren?: number;
};

/** Parent that walks its <StaggerItem> children in sequence. */
export function StaggerGroup({
  children,
  className,
  gap = 0.08,
  delayChildren = 0,
}: StaggerGroupProps) {
  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: gap, delayChildren } },
      }}
    >
      {children}
    </motion.div>
  );
}

/** Child of <StaggerGroup>. Inherits the parent's hidden/show orchestration. */
export function StaggerItem({
  children,
  className,
  variants = fadeUp,
}: {
  children: ReactNode;
  className?: string;
  variants?: Variants;
}) {
  return (
    <motion.div className={cn(className)} variants={variants}>
      {children}
    </motion.div>
  );
}
