"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE } from "@/lib/motion";
import { useUIStore } from "@/store/useUIStore";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { site } from "@/lib/data";

const DURATION = 1650; // ms for the counter to reach 100
const HOLD_AFTER_FULL = 380; // ms to sit at 100% before the curtain lifts
/**
 * Wall-clock deadline after which the curtain lifts no matter what.
 * Generous enough never to cut the real animation short.
 */
const FAILSAFE_MS = DURATION + HOLD_AFTER_FULL + 1500;

/**
 * Entry curtain.
 *
 * Runs a synthetic 0–100 counter rather than tracking real asset loads: the
 * page is server-rendered and mostly text, so a genuine progress bar would
 * flash and vanish. The counter eases out so the last few percent feel like
 * work finishing, then two panels split apart to reveal the page.
 *
 * Sets `introComplete` in the store on the way out, which is what unblocks
 * the hero's own entrance animation.
 */
export function Preloader() {
  const setIntroComplete = useUIStore((s) => s.setIntroComplete);
  const prefersReduced = usePrefersReducedMotion();

  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  /**
   * Set when the curtain is torn down without playing its exit — because
   * nobody is watching, or because something went wrong. Renders `null`
   * outright rather than handing the job to AnimatePresence, whose exit
   * animation is itself rAF-driven and would stall under exactly the
   * conditions this exists to escape.
   */
  const [skipExit, setSkipExit] = useState(false);

  /** Guards against the failsafe and the animation both finishing. */
  const finishedRef = useRef(false);

  const finish = useCallback(
    (immediate = false) => {
      if (finishedRef.current) return;
      finishedRef.current = true;

      setProgress(100);
      setDone(true);
      if (immediate) setSkipExit(true);
      // Release the scroll lock here too, not only in the effect below —
      // this is the path that runs when something has gone wrong.
      document.body.style.overflow = "";

      try {
        sessionStorage.setItem("intro-played", "1");
      } catch {
        // Private-mode Safari throws on sessionStorage writes. The curtain
        // simply replays on the next navigation; not worth failing over.
      }

      if (immediate) setIntroComplete(true);
      // Otherwise let the curtain start moving before the hero begins.
      else window.setTimeout(() => setIntroComplete(true), 220);
    },
    [setIntroComplete],
  );

  useEffect(() => {
    // Honour reduced motion by skipping the whole sequence.
    if (prefersReduced) {
      finish(true);
      return;
    }

    // Don't re-run the curtain on soft navigations within a session.
    let alreadyPlayed = false;
    try {
      alreadyPlayed = sessionStorage.getItem("intro-played") === "1";
    } catch {
      alreadyPlayed = false;
    }
    if (alreadyPlayed) {
      finish(true);
      return;
    }

    // Background tabs suspend requestAnimationFrame entirely. Holding a
    // full-screen curtain over a page nobody is looking at means they'd
    // arrive to a black screen with scrolling locked, so skip straight to
    // the finished state and let them land on real content.
    if (document.visibilityState === "hidden") {
      finish(true);
      return;
    }

    let holdTimer = 0;
    let raf = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min((now - start) / DURATION, 1);
      // expo-out: fast start, long tail.
      const eased = 1 - Math.pow(2, -10 * t);
      setProgress(Math.round(eased * 100));

      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        holdTimer = window.setTimeout(() => finish(), HOLD_AFTER_FULL);
      }
    };

    raf = requestAnimationFrame(tick);

    // Safety net. setTimeout keeps firing when rAF is suspended, so this is
    // what guarantees the page is never permanently held hostage by a
    // decorative animation that failed to run.
    const failsafe = window.setTimeout(() => finish(true), FAILSAFE_MS);

    // Scrolling during the intro would desync the reveal.
    document.body.style.overflow = "hidden";

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(holdTimer);
      window.clearTimeout(failsafe);
      document.body.style.overflow = "";
    };
  }, [prefersReduced, finish]);

  useEffect(() => {
    if (done) document.body.style.overflow = "";
  }, [done]);

  // Torn down without an exit — get off the page immediately.
  if (skipExit) return null;

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[10000] flex items-center justify-center"
          exit={{ pointerEvents: "none" }}
        >
          {/* Two panels that split vertically to uncover the page. */}
          <motion.div
            className="absolute inset-x-0 top-0 h-1/2 bg-void"
            exit={{ y: "-100%" }}
            transition={{ duration: 1.05, ease: EASE.inOut }}
          />
          <motion.div
            className="absolute inset-x-0 bottom-0 h-1/2 bg-void"
            exit={{ y: "100%" }}
            transition={{ duration: 1.05, ease: EASE.inOut }}
          />

          {/* Hairline where the panels meet. */}
          <motion.div
            className="absolute left-0 right-0 top-1/2 h-px origin-center bg-gradient-to-r from-transparent via-white/40 to-transparent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: EASE.out }}
          />

          <motion.div
            className="relative z-10 flex w-full max-w-md flex-col items-center px-8"
            exit={{ opacity: 0, filter: "blur(8px)", scale: 0.96 }}
            transition={{ duration: 0.45, ease: EASE.out }}
          >
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE.out }}
              className="mb-8 text-[0.6875rem] font-medium uppercase tracking-[0.3em] text-dim"
            >
              {site.name}
            </motion.span>

            {/* Progress rail */}
            <div className="relative h-px w-full overflow-hidden bg-white/10">
              <motion.div
                className="absolute inset-y-0 left-0 bg-white"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="mt-5 flex w-full items-baseline justify-between">
              <span className="font-mono text-[0.6875rem] tracking-[0.12em] text-faint">
                LOADING
              </span>
              <span className="font-mono text-2xl font-light tabular-nums tracking-tight text-bright">
                {String(progress).padStart(3, "0")}
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
