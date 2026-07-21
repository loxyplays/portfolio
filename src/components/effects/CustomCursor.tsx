"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { useUIStore } from "@/store/useUIStore";
import {
  useHasFinePointer,
  usePrefersReducedMotion,
} from "@/hooks/usePrefersReducedMotion";

/**
 * Two-part cursor: a small solid dot that tracks the pointer exactly, and a
 * larger ring on a spring that trails behind it. The lag between the two is
 * the whole effect — a single springy circle just feels laggy.
 *
 * Mounts only for fine pointers with motion enabled, and toggles the
 * `has-custom-cursor` class that hides the native one, so touch users and
 * reduced-motion users keep their real cursor.
 */
export function CustomCursor() {
  const hasFinePointer = useHasFinePointer();
  const prefersReduced = usePrefersReducedMotion();
  const enabled = hasFinePointer && !prefersReduced;

  const variant = useUIStore((s) => s.cursorVariant);
  const label = useUIStore((s) => s.cursorLabel);

  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);

  // Dot: raw values, zero smoothing.
  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);

  // Ring: same source, spring-damped so it trails.
  const ringX = useSpring(dotX, { stiffness: 260, damping: 28, mass: 0.55 });
  const ringY = useSpring(dotY, { stiffness: 260, damping: 28, mass: 0.55 });

  useEffect(() => {
    if (!enabled) {
      document.documentElement.classList.remove("has-custom-cursor");
      return;
    }

    document.documentElement.classList.add("has-custom-cursor");

    const onMove = (e: MouseEvent) => {
      dotX.set(e.clientX);
      dotY.set(e.clientY);
      setVisible(true);
    };
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, [enabled, dotX, dotY]);

  if (!enabled) return null;

  const ringSize =
    variant === "hover" ? 62 : variant === "text" ? 8 : variant === "drag" ? 74 : 30;

  const hidden = variant === "hidden" || !visible;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999] hidden md:block"
    >
      {/* Trailing ring */}
      <motion.div
        className="absolute left-0 top-0 flex items-center justify-center rounded-full border border-white/45 backdrop-blur-[2px]"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: ringSize,
          height: ringSize,
          opacity: hidden ? 0 : 1,
          scale: pressed ? 0.85 : 1,
          backgroundColor:
            variant === "hover"
              ? "rgba(255,255,255,0.10)"
              : "rgba(255,255,255,0)",
          borderColor:
            variant === "text"
              ? "rgba(255,255,255,0.9)"
              : "rgba(255,255,255,0.45)",
        }}
        transition={{ type: "spring", stiffness: 380, damping: 30, mass: 0.5 }}
      >
        <AnimatePresence>
          {label && (
            <motion.span
              key={label}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.18 }}
              className="text-[0.5625rem] font-semibold uppercase tracking-[0.14em] text-white"
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Exact-tracking dot — hidden while the ring carries a label. */}
      <motion.div
        className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-white"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          opacity: hidden || variant === "hover" ? 0 : 1,
          scale: pressed ? 1.6 : 1,
        }}
        transition={{ duration: 0.18 }}
      />
    </div>
  );
}
