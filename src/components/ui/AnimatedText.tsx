"use client";

import { motion } from "framer-motion";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

type AnimatedTextProps = {
  text: string;
  /** Applied to the outer wrapper — use for layout, not colour. */
  className?: string;
  /**
   * Applied to each individual word.
   *
   * Gradient text belongs here, not on `className`: `background-clip: text`
   * is painted by the element that owns the background, and browsers drop it
   * unreliably when descendants are independently transformed — which every
   * word here is. Per-word means each gradient clips to its own glyphs.
   */
  wordClassName?: string;
  /** Seconds before the first word moves. */
  delay?: number;
  /** Seconds between consecutive words. */
  stagger?: number;
  /** Gate the animation on something external, e.g. the preloader finishing. */
  play?: boolean;
  /** Words rendered in the muted tone — pass the exact word, casing included. */
  dim?: string[];
};

/**
 * Word-by-word headline entrance.
 *
 * Each word gets its own clipping row so it rises out of a hard edge rather
 * than fading in place, which is what makes the effect read as deliberate.
 * The full string is also rendered for assistive tech, so screen readers and
 * crawlers see one sentence rather than a pile of fragments.
 */
export function AnimatedText({
  text,
  className,
  wordClassName,
  delay = 0,
  stagger = 0.055,
  play = true,
  dim = [],
}: AnimatedTextProps) {
  const words = text.split(" ");
  const dimSet = new Set(dim);

  return (
    <span className={cn("inline-block", className)}>
      <span className="sr-only">{text}</span>

      <motion.span
        aria-hidden="true"
        className="inline"
        initial="hidden"
        animate={play ? "show" : "hidden"}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: stagger, delayChildren: delay } },
        }}
      >
        {words.map((word, i) => {
          const isDim = dimSet.has(word);

          return (
            <span
              key={`${word}-${i}`}
              // Clip box. The pb/-mb pair keeps descenders (g, y, p) from
              // being sliced by the overflow while preserving the baseline.
              className="inline-block overflow-hidden pb-[0.14em] -mb-[0.14em] align-bottom"
            >
              <motion.span
                className={cn(
                  "inline-block",
                  // A dim word opts out of the gradient entirely — an opaque
                  // colour would just sit on top of it anyway.
                  isDim ? "text-muted" : wordClassName,
                )}
                variants={{
                  hidden: { y: "115%", opacity: 0 },
                  show: {
                    y: "0%",
                    opacity: 1,
                    transition: { duration: 0.9, ease: EASE.out },
                  },
                }}
              >
                {word}
              </motion.span>

              {/* Real space between clip boxes, outside the overflow. */}
              {i < words.length - 1 && (
                <span className="inline-block">&nbsp;</span>
              )}
            </span>
          );
        })}
      </motion.span>
    </span>
  );
}
