"use client";

import { MotionConfig } from "framer-motion";
import { usePathname } from "next/navigation";
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
 *
 * The decorative layer is deliberately scoped to the public site. On /admin
 * every one of these actively gets in the way: the custom cursor hides the
 * real pointer while you're trying to hit form fields, the preloader curtain
 * delays a tool you opened to do a job, and inertial scrolling fights long
 * forms. Admin is a workbench, not a showpiece.
 */
export function Providers({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  return (
    <MotionConfig reducedMotion="user">
      {!isAdmin && (
        <>
          <Preloader />
          <SmoothScroll />
          <CustomCursor />
          <ScrollProgress />
          <Backdrop />
        </>
      )}
      {children}
    </MotionConfig>
  );
}
