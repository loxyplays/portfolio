"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  /** Max rotation in degrees on each axis. */
  intensity?: number;
  /** Render the cursor-tracking specular highlight. */
  glare?: boolean;
  /** Lift distance in px on hover. */
  lift?: number;
};

/**
 * 3D tilt-on-hover surface with a cursor-tracked glare.
 *
 * The rotation is applied on a spring so the card settles rather than snapping,
 * and the glare is a radial gradient positioned from the same pointer values —
 * one listener drives both, and both run on the compositor.
 */
export function TiltCard({
  children,
  className,
  intensity = 7,
  glare = true,
  lift = 6,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = usePrefersReducedMotion();

  // -0.5..0.5 relative to card centre.
  const px = useMotionValue(0);
  const py = useMotionValue(0);

  const spring = { stiffness: 220, damping: 24, mass: 0.7 };
  const rotateX = useSpring(
    useTransform(py, [-0.5, 0.5], [intensity, -intensity]),
    spring,
  );
  const rotateY = useSpring(
    useTransform(px, [-0.5, 0.5], [-intensity, intensity]),
    spring,
  );

  // Glare follows the pointer across the surface. Built unconditionally —
  // hooks may never sit behind the `glare`/reduced-motion checks below.
  const glareX = useTransform(px, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(py, [-0.5, 0.5], ["0%", "100%"]);
  const glareBackground = useMotionTemplate`radial-gradient(420px circle at ${glareX} ${glareY}, rgba(255,255,255,0.10), transparent 55%)`;

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    px.set((event.clientX - rect.left) / rect.width - 0.5);
    py.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        transformPerspective: 1200,
      }}
      whileHover={prefersReduced ? undefined : { y: -lift }}
      transition={{ type: "spring", stiffness: 260, damping: 26 }}
      className={cn("relative", className)}
    >
      {children}

      {glare && !prefersReduced && (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-30 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: glareBackground }}
        />
      )}
    </motion.div>
  );
}
