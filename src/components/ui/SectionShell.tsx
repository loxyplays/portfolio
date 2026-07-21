"use client";

import type { ReactNode } from "react";
import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";
import type { SectionId } from "@/lib/data";

type SectionShellProps = {
  id: SectionId;
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
  /** Right-hand slot beside the heading, e.g. a link or counter. */
  aside?: ReactNode;
};

/**
 * Shared section chrome: consistent vertical rhythm, max width, eyebrow,
 * heading and lede. Sections supply only their own content.
 */
export function SectionShell({
  id,
  eyebrow,
  title,
  description,
  children,
  className,
  aside,
}: SectionShellProps) {
  return (
    <section
      id={id}
      // scroll-mt keeps the heading clear of the floating navbar on jump.
      className={cn(
        "relative scroll-mt-28 px-5 py-24 sm:px-8 md:py-32 lg:py-40",
        className,
      )}
      aria-labelledby={`${id}-heading`}
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-14 flex flex-col gap-6 md:mb-20 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <Reveal>
              <span className="eyebrow flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="h-px w-8 bg-gradient-to-r from-white/50 to-transparent"
                />
                {eyebrow}
              </span>
            </Reveal>

            <Reveal delay={0.06}>
              <h2
                id={`${id}-heading`}
                className="mt-5 text-balance text-[2rem] font-semibold leading-[1.08] text-gradient sm:text-[2.75rem] lg:text-[3.25rem]"
              >
                {title}
              </h2>
            </Reveal>

            {description && (
              <Reveal delay={0.12}>
                <p className="mt-5 max-w-xl text-[0.9375rem] leading-relaxed text-muted sm:text-base">
                  {description}
                </p>
              </Reveal>
            )}
          </div>

          {aside && (
            <Reveal delay={0.18} className="shrink-0">
              {aside}
            </Reveal>
          )}
        </div>

        {children}
      </div>
    </section>
  );
}
