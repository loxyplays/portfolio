"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";
import { Preloader } from "@/components/effects/Preloader";
import { SmoothScroll } from "@/components/effects/SmoothScroll";
import { CustomCursor } from "@/components/effects/CustomCursor";
import { ScrollProgress } from "@/components/effects/ScrollProgress";
import { Backdrop } from "@/components/effects/Backdrop";

/**
 * Client boundary for everything global.
 *
 * `reducedMotion="user"` makes framer-motion respect the OS setting across the
 * whole tree automatically — transforms and layout animations are dropped
 * while opacity changes are kept, so the site stays legible rather than going
 * completely static.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <Preloader />
      <SmoothScroll />
      <CustomCursor />
      <ScrollProgress />
      <Backdrop />
      {children}
    </MotionConfig>
  );
}
