"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  skillCategories,
  marqueeItems,
  type SkillCategory,
  type Skill,
} from "@/lib/data";
import { SectionShell } from "@/components/ui/SectionShell";
import { StaggerGroup, StaggerItem } from "@/components/ui/Reveal";
import { scaleIn, EASE } from "@/lib/motion";
import {
  Code,
  Terminal,
  Gamepad,
  Palette,
  type IconComponent,
} from "@/components/ui/Icons";

const categoryIcons: Record<string, IconComponent> = {
  frontend: Code,
  backend: Terminal,
  games: Gamepad,
  design: Palette,
};

/* -------------------------------------------------------------------------- */
/* Skill row                                                                   */
/* -------------------------------------------------------------------------- */

function SkillRow({
  skill,
  index,
  active,
}: {
  skill: Skill;
  index: number;
  active: boolean;
}) {
  return (
    <li className="group/skill">
      <div className="flex items-baseline justify-between gap-3 pb-2">
        <span className="text-[0.8125rem] font-medium text-bright/90 transition-colors group-hover/skill:text-bright">
          {skill.name}
        </span>
        <span className="shrink-0 font-mono text-[0.625rem] text-faint">
          {skill.note ?? `${skill.level}%`}
        </span>
      </div>

      {/* Rail */}
      <div
        className="relative h-1 w-full overflow-hidden rounded-full bg-white/[0.07]"
        role="progressbar"
        aria-valuenow={skill.level}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${skill.name} proficiency`}
      >
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-white/55 to-white"
          initial={{ width: 0 }}
          animate={active ? { width: `${skill.level}%` } : { width: 0 }}
          transition={{
            duration: 1.3,
            ease: EASE.out,
            delay: 0.15 + index * 0.09,
          }}
        >
          {/* Leading glow at the tip of the bar. */}
          <span className="absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 translate-x-1/2 rounded-full bg-white/70 blur-[6px]" />
        </motion.div>
      </div>
    </li>
  );
}

/* -------------------------------------------------------------------------- */
/* Category card                                                               */
/* -------------------------------------------------------------------------- */

function CategoryCard({
  category,
  index,
}: {
  category: SkillCategory;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });
  const Icon = categoryIcons[category.id] ?? Code;

  return (
    <StaggerItem variants={scaleIn} className="h-full">
      <div
        ref={ref}
        className="group glass relative h-full overflow-hidden rounded-[24px] p-6 transition-colors duration-500 hover:border-white/[0.18]"
      >
        {/* Corner glow */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.10),transparent_70%)] opacity-0 blur-xl transition-opacity duration-700 group-hover:opacity-100" />

        <div className="relative">
          <div className="flex items-start gap-3.5">
            {/* Icon tile floats gently, independent per card. */}
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{
                duration: 5.5,
                repeat: Infinity,
                ease: "easeInOut",
                // Deterministic offset so the four tiles drift out of phase
                // without the delay changing on every re-render.
                delay: index * 0.55,
              }}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-bright shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)]"
            >
              <Icon className="h-[18px] w-[18px]" />
            </motion.div>

            <div className="pt-0.5">
              <h3 className="text-[0.9375rem] font-semibold tracking-[-0.02em] text-bright">
                {category.title}
              </h3>
              <p className="mt-0.5 text-[0.75rem] leading-snug text-faint">
                {category.blurb}
              </p>
            </div>
          </div>

          <ul className="mt-7 space-y-4">
            {category.skills.map((skill, i) => (
              <SkillRow
                key={skill.name}
                skill={skill}
                index={i}
                active={inView}
              />
            ))}
          </ul>
        </div>
      </div>
    </StaggerItem>
  );
}

/* -------------------------------------------------------------------------- */
/* Marquee                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Infinite ticker.
 *
 * The list is rendered twice and translated by exactly -50%, so the second
 * copy lands precisely where the first began and the loop has no seam.
 */
function SkillMarquee() {
  return (
    <div className="relative mt-6 overflow-hidden py-2 mask-fade-edges">
      <motion.div
        className="flex w-max gap-3"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 38, repeat: Infinity, ease: "linear" }}
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 gap-3" aria-hidden={copy === 1}>
            {marqueeItems.map((item) => (
              <span
                key={`${copy}-${item}`}
                className="whitespace-nowrap rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-[0.75rem] font-medium text-muted backdrop-blur-sm"
              >
                {item}
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Section                                                                     */
/* -------------------------------------------------------------------------- */

export function Skills() {
  return (
    <SectionShell
      id="skills"
      eyebrow="Capabilities"
      title="The tools I reach for."
      description="Depth where it counts, and enough breadth to take something from an empty repo to a live product without handing it off."
    >
      <StaggerGroup
        gap={0.1}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4"
      >
        {skillCategories.map((category, i) => (
          <CategoryCard key={category.id} category={category} index={i} />
        ))}
      </StaggerGroup>

      <SkillMarquee />
    </SectionShell>
  );
}
