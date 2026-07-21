"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { projects, socials, type Project } from "@/lib/data";
import { SectionShell } from "@/components/ui/SectionShell";
import { StaggerGroup, StaggerItem, Reveal } from "@/components/ui/Reveal";
import { TiltCard } from "@/components/ui/TiltCard";
import { Chip, StatusBadge } from "@/components/ui/Badge";
import { useUIStore } from "@/store/useUIStore";
import { scaleIn, EASE } from "@/lib/motion";
import { ArrowUpRight, GitHub, Layers } from "@/components/ui/Icons";

/* -------------------------------------------------------------------------- */
/* Shared bits                                                                 */
/* -------------------------------------------------------------------------- */

function ProjectLinks({
  project,
  size = "md",
}: {
  project: Project;
  size?: "sm" | "md";
}) {
  const base =
    size === "sm"
      ? "h-8 px-3 text-[0.75rem] gap-1.5"
      : "h-10 px-4 text-[0.8125rem] gap-2";

  return (
    <div className="flex flex-wrap items-center gap-2">
      {project.demo && (
        <a
          href={project.demo}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center rounded-full bg-bright font-medium text-void transition-transform duration-300 hover:scale-[1.04] active:scale-95 ${base}`}
        >
          Live Demo
          <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      )}

      {project.source && (
        <a
          href={project.source}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center rounded-full border border-white/12 bg-white/[0.04] font-medium text-bright backdrop-blur-xl transition-colors duration-300 hover:border-white/25 hover:bg-white/[0.08] ${base}`}
        >
          <GitHub className="h-3.5 w-3.5" />
          Source Code
        </a>
      )}
    </div>
  );
}

/** Image frame with the zoom + sheen treatment shared by both card layouts. */
function ProjectCover({
  project,
  priority = false,
  className = "",
  sizes,
}: {
  project: Project;
  priority?: boolean;
  className?: string;
  sizes: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[20px] border border-white/[0.07] bg-abyss ${className}`}
    >
      <Image
        src={project.cover}
        alt={`${project.name} — project cover`}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
      />

      {/* Glass reflection: a diagonal light bar that sweeps across on hover. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -translate-x-full -skew-x-12 bg-gradient-to-r from-transparent via-white/[0.13] to-transparent transition-transform duration-[1100ms] ease-out group-hover:translate-x-full"
      />

      {/* Keeps the badge legible over any artwork. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent"
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Featured                                                                    */
/* -------------------------------------------------------------------------- */

function FeaturedProject({ project }: { project: Project }) {
  const setCursor = useUIStore((s) => s.setCursor);

  return (
    <Reveal variants={scaleIn}>
      <article
        onMouseEnter={() => setCursor("hover", "View")}
        onMouseLeave={() => setCursor("default")}
        className="group glass ring-gradient relative overflow-hidden rounded-[28px] p-3 transition-colors duration-500 hover:border-white/[0.18] sm:p-4"
      >
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-4">
          <ProjectCover
            project={project}
            priority
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="aspect-[16/11] w-full lg:aspect-auto lg:h-full lg:min-h-[26rem]"
          />

          <div className="flex flex-col justify-between gap-6 p-4 sm:p-6">
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-bright px-2.5 py-1 text-[0.625rem] font-semibold uppercase tracking-[0.12em] text-void">
                  <Layers className="h-3 w-3" />
                  Featured
                </span>
                <StatusBadge status={project.status} />
                <span className="font-mono text-[0.6875rem] text-faint">
                  {project.year}
                </span>
              </div>

              <h3 className="mt-5 text-[1.75rem] font-semibold leading-tight tracking-[-0.035em] text-bright sm:text-[2.125rem]">
                {project.name}
              </h3>

              <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">
                {project.detail ?? project.summary}
              </p>

              {project.metrics && (
                <dl className="mt-6 grid grid-cols-3 gap-3 border-y border-white/[0.07] py-5">
                  {project.metrics.map((metric) => (
                    <div key={metric.label}>
                      <dt className="sr-only">{metric.label}</dt>
                      <dd className="text-lg font-semibold tracking-tight text-bright sm:text-xl">
                        {metric.value}
                      </dd>
                      <p className="mt-1 text-[0.6875rem] leading-snug text-faint">
                        {metric.label}
                      </p>
                    </div>
                  ))}
                </dl>
              )}

              <div className="mt-5 flex flex-wrap gap-1.5">
                {project.tech.map((tech) => (
                  <Chip key={tech}>{tech}</Chip>
                ))}
              </div>
            </div>

            <ProjectLinks project={project} />
          </div>
        </div>
      </article>
    </Reveal>
  );
}

/* -------------------------------------------------------------------------- */
/* Standard card                                                               */
/* -------------------------------------------------------------------------- */

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const setCursor = useUIStore((s) => s.setCursor);

  return (
    <StaggerItem variants={scaleIn}>
      <TiltCard intensity={5} lift={8} className="h-full">
        <article
          onMouseEnter={() => setCursor("hover", "View")}
          onMouseLeave={() => setCursor("default")}
          className="group glass relative flex h-full flex-col overflow-hidden rounded-[24px] p-3 transition-colors duration-500 hover:border-white/[0.18]"
        >
          <ProjectCover
            project={project}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="aspect-[16/10] w-full"
          />

          <div className="absolute right-6 top-6 z-20">
            <StatusBadge status={project.status} />
          </div>

          <div className="flex flex-1 flex-col p-4 pt-5">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-[1.0625rem] font-semibold tracking-[-0.025em] text-bright">
                {project.name}
              </h3>
              <span className="shrink-0 font-mono text-[0.6875rem] text-faint">
                {project.year}
              </span>
            </div>

            <p className="mt-2 flex-1 text-[0.8125rem] leading-relaxed text-muted">
              {project.summary}
            </p>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {project.tech.slice(0, 4).map((tech) => (
                <Chip key={tech}>{tech}</Chip>
              ))}
            </div>

            <div className="mt-5 border-t border-white/[0.07] pt-4">
              <ProjectLinks project={project} size="sm" />
            </div>
          </div>

          {/* Index watermark — a small typographic flourish. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-3 right-4 font-mono text-[0.625rem] text-white/[0.14] transition-colors duration-500 group-hover:text-white/25"
          >
            {String(index + 2).padStart(2, "0")}
          </span>
        </article>
      </TiltCard>
    </StaggerItem>
  );
}

/* -------------------------------------------------------------------------- */
/* Section                                                                     */
/* -------------------------------------------------------------------------- */

export function Projects() {
  const featured = projects.find((p) => p.featured) ?? projects[0];
  const rest = projects.filter((p) => p.slug !== featured.slug);

  return (
    <SectionShell
      id="projects"
      eyebrow="Selected work"
      title="Things I've built and shipped."
      description="A mix of product work, open source and games. Every one of these went live and had real people use it."
      aside={
        <motion.a
          href={
            socials.find((s) => s.key === "github")?.href ??
            "https://github.com"
          }
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ x: 3 }}
          transition={{ duration: 0.3, ease: EASE.out }}
          className="group inline-flex items-center gap-2 text-[0.8125rem] font-medium text-muted transition-colors hover:text-bright"
        >
          <GitHub className="h-4 w-4" />
          All repositories
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </motion.a>
      }
    >
      <div className="space-y-4 sm:space-y-6">
        <FeaturedProject project={featured} />

        <StaggerGroup
          gap={0.09}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3"
        >
          {rest.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </StaggerGroup>
      </div>
    </SectionShell>
  );
}
