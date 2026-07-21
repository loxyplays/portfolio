"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { about, site, stats, type Stat } from "@/lib/data";
import { SectionShell } from "@/components/ui/SectionShell";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/Reveal";
import { useCountUp } from "@/hooks/useCountUp";
import { fadeUp, scaleIn } from "@/lib/motion";
import { MapPin, Clock, Sparkle } from "@/components/ui/Icons";

/* -------------------------------------------------------------------------- */
/* Stat card                                                                   */
/* -------------------------------------------------------------------------- */

function StatCard({ stat }: { stat: Stat }) {
  const ref = useRef<HTMLDivElement>(null);
  // `once` so the counter doesn't restart every time it scrolls past.
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const value = useCountUp(stat.value, inView);

  return (
    <StaggerItem variants={scaleIn}>
      <div
        ref={ref}
        className="group glass relative h-full overflow-hidden rounded-[20px] p-5 transition-colors duration-500 hover:border-white/20 sm:p-6"
      >
        {/* Hover wash */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_0%,rgba(255,255,255,0.07),transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        <div className="relative">
          <p className="flex items-baseline gap-0.5 text-[2.25rem] font-semibold leading-none tracking-[-0.045em] text-bright sm:text-[2.75rem]">
            <span className="tabular-nums">{value}</span>
            <span className="text-muted">{stat.suffix}</span>
          </p>

          <p className="mt-3 text-[0.875rem] font-medium text-bright/90">
            {stat.label}
          </p>
          <p className="mt-1 text-[0.75rem] text-faint">{stat.hint}</p>
        </div>

        {/* Bottom hairline that draws in on hover */}
        <span className="pointer-events-none absolute inset-x-5 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-white/40 to-transparent transition-transform duration-700 ease-out group-hover:scale-x-100" />
      </div>
    </StaggerItem>
  );
}

/* -------------------------------------------------------------------------- */
/* Section                                                                     */
/* -------------------------------------------------------------------------- */

export function About() {
  return (
    <SectionShell
      id="about"
      eyebrow="About"
      title={about.heading}
      description={site.description}
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-10">
        {/* ---------------------------------------------------------- */}
        {/* Profile card                                                */}
        {/* ---------------------------------------------------------- */}
        <Reveal variants={scaleIn}>
          <div className="group glass ring-gradient relative h-full overflow-hidden rounded-[28px] p-6 sm:p-8">
            <div className="dot-bg pointer-events-none absolute inset-0 opacity-30" />

            <div className="relative">
              {/* Monogram stands in for a photo — swap the block below for
                  an <Image> when you have one you like. */}
              <div className="relative mb-6 flex h-20 w-20 items-center justify-center overflow-hidden rounded-[22px] bg-gradient-to-br from-white via-white to-zinc-300 text-void">
                <span className="text-2xl font-bold tracking-tight">
                  {site.initials}
                </span>
                <motion.span
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                  animate={{ x: ["-120%", "220%"] }}
                  transition={{
                    duration: 2.8,
                    repeat: Infinity,
                    repeatDelay: 3.5,
                    ease: "easeInOut",
                  }}
                />
              </div>

              <h3 className="text-xl font-semibold tracking-[-0.03em] text-bright">
                {site.name}
              </h3>
              <p className="mt-1 text-sm text-muted">{site.role}</p>

              <div className="my-6 h-px w-full bg-gradient-to-r from-white/15 via-white/5 to-transparent" />

              <dl className="space-y-3.5 text-[0.8125rem]">
                <div className="flex items-center gap-3">
                  <dt className="flex items-center gap-2 text-faint">
                    <MapPin className="h-3.5 w-3.5" />
                    <span className="sr-only">Location</span>
                  </dt>
                  <dd className="text-muted">{site.location}</dd>
                </div>

                <div className="flex items-center gap-3">
                  <dt className="flex items-center gap-2 text-faint">
                    <Clock className="h-3.5 w-3.5" />
                    <span className="sr-only">Availability</span>
                  </dt>
                  <dd className="text-muted">
                    {site.available ? "Open to new work" : "Currently booked"}
                  </dd>
                </div>

                <div className="flex items-center gap-3">
                  <dt className="flex items-center gap-2 text-faint">
                    <Sparkle className="h-3.5 w-3.5" />
                    <span className="sr-only">Now</span>
                  </dt>
                  <dd className="text-muted">{about.nowPlaying}</dd>
                </div>
              </dl>
            </div>
          </div>
        </Reveal>

        {/* ---------------------------------------------------------- */}
        {/* Prose + stats                                               */}
        {/* ---------------------------------------------------------- */}
        <div className="flex flex-col gap-8">
          <StaggerGroup gap={0.1} className="space-y-5">
            {about.paragraphs.map((paragraph, i) => (
              <StaggerItem key={i} variants={fadeUp}>
                <p className="text-[0.9375rem] leading-[1.75] text-muted sm:text-base">
                  {paragraph}
                </p>
              </StaggerItem>
            ))}
          </StaggerGroup>

          <StaggerGroup
            gap={0.09}
            delayChildren={0.15}
            className="grid grid-cols-2 gap-3 sm:gap-4"
          >
            {stats.map((stat) => (
              <StatCard key={stat.label} stat={stat} />
            ))}
          </StaggerGroup>
        </div>
      </div>
    </SectionShell>
  );
}
