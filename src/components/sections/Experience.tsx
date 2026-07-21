"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { experience, type ExperienceEntry } from "@/lib/data";
import { SectionShell } from "@/components/ui/SectionShell";
import { Reveal } from "@/components/ui/Reveal";
import { EASE } from "@/lib/motion";
import { ArrowUpRight } from "@/components/ui/Icons";

/* -------------------------------------------------------------------------- */
/* Entry                                                                       */
/* -------------------------------------------------------------------------- */

function TimelineItem({
  entry,
  index,
}: {
  entry: ExperienceEntry;
  index: number;
}) {
  return (
    <li className="relative pl-10 sm:pl-14">
      {/* Node on the line */}
      <Reveal delay={0.05}>
        <span className="absolute left-0 top-6 flex h-4 w-4 -translate-x-1/2 items-center justify-center">
          {entry.current && (
            <motion.span
              aria-hidden="true"
              className="absolute h-4 w-4 rounded-full bg-white/25"
              animate={{ scale: [1, 1.9, 1], opacity: [0.55, 0, 0.55] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
            />
          )}
          <span
            className={
              entry.current
                ? "relative h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_14px_2px_rgba(255,255,255,0.55)]"
                : "relative h-2.5 w-2.5 rounded-full border border-white/25 bg-elevated"
            }
          />
        </span>
      </Reveal>

      <Reveal delay={0.1}>
        <article className="group glass relative overflow-hidden rounded-[24px] p-5 transition-colors duration-500 hover:border-white/[0.18] sm:p-7">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(110%_80%_at_0%_0%,rgba(255,255,255,0.06),transparent_55%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          <div className="relative">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="font-mono text-[0.6875rem] tracking-[0.04em] text-muted">
                {entry.period}
              </span>
              {entry.current && (
                <span className="rounded-full bg-bright px-2 py-0.5 text-[0.5625rem] font-semibold uppercase tracking-[0.12em] text-void">
                  Current
                </span>
              )}
            </div>

            <h3 className="mt-3 text-[1.125rem] font-semibold tracking-[-0.025em] text-bright sm:text-[1.25rem]">
              {entry.role}
            </h3>

            <p className="mt-1 flex flex-wrap items-center gap-2 text-[0.8125rem] text-muted">
              <span className="font-medium text-bright/85">{entry.org}</span>
              <span aria-hidden="true" className="h-1 w-1 rounded-full bg-white/20" />
              <span className="text-faint">{entry.location}</span>
            </p>

            <p className="mt-4 text-[0.875rem] leading-relaxed text-muted">
              {entry.description}
            </p>

            <ul className="mt-5 space-y-2.5">
              {entry.highlights.map((highlight, i) => (
                <motion.li
                  key={highlight}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-10% 0px" }}
                  transition={{
                    duration: 0.6,
                    ease: EASE.out,
                    delay: 0.2 + i * 0.08,
                  }}
                  className="flex items-start gap-3 text-[0.8125rem] leading-relaxed text-muted"
                >
                  <ArrowUpRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-faint transition-colors duration-300 group-hover:text-bright/70" />
                  <span>{highlight}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Index watermark */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-5 top-5 font-mono text-[0.625rem] text-white/[0.13]"
          >
            {String(index + 1).padStart(2, "0")}
          </span>
        </article>
      </Reveal>
    </li>
  );
}

/* -------------------------------------------------------------------------- */
/* Section                                                                     */
/* -------------------------------------------------------------------------- */

export function Experience() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Fill the line as the timeline passes through the viewport.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 75%", "end 65%"],
  });
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 30,
    restDelta: 0.001,
  });
  const glowY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const glowOpacity = useTransform(
    scrollYProgress,
    [0, 0.05, 0.95, 1],
    [0, 1, 1, 0],
  );

  return (
    <SectionShell
      id="experience"
      eyebrow="Experience"
      title="Where I've been."
      description="Seven years of shipping — from solo game projects to leading interface work on products used by whole engineering orgs."
    >
      <div ref={containerRef} className="relative">
        {/* Rail */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-0 top-0 w-px bg-white/[0.08]"
        />

        {/* Fill */}
        <motion.div
          aria-hidden="true"
          style={{ scaleY }}
          className="absolute bottom-0 left-0 top-0 w-px origin-top bg-gradient-to-b from-white/70 via-white/40 to-white/10"
        />

        {/* Travelling glow at the fill head */}
        <motion.div
          aria-hidden="true"
          style={{ top: glowY, opacity: glowOpacity }}
          className="absolute left-0 h-24 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-white to-transparent blur-[3px]"
        />

        <ol className="space-y-5 sm:space-y-6">
          {experience.map((entry, i) => (
            <TimelineItem key={entry.period} entry={entry} index={i} />
          ))}
        </ol>
      </div>
    </SectionShell>
  );
}
