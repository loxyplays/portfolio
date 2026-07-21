"use client";

import { useEffect } from "react";
import { navItems, type SectionId } from "@/lib/data";
import { useUIStore } from "@/store/useUIStore";

/**
 * Tracks which section owns the viewport and writes it into the UI store,
 * driving the navbar's sliding indicator.
 *
 * Uses a band of thresholds rather than a single one so tall sections (Projects)
 * and short ones (Contact) compete fairly: whichever has the greatest visible
 * area wins, with a scroll-bottom override so the final section can always
 * become active even when it can't fill the screen.
 */
export function useActiveSection() {
  const setActiveSection = useUIStore((s) => s.setActiveSection);

  useEffect(() => {
    const elements = navItems
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const ratios = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target.id, entry.intersectionRatio);
        }

        let bestId: string | null = null;
        let bestRatio = 0;
        for (const [id, ratio] of ratios) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        }

        if (bestId && bestRatio > 0) {
          setActiveSection(bestId as SectionId);
        }
      },
      {
        threshold: [0, 0.1, 0.25, 0.4, 0.55, 0.7, 0.85, 1],
        // Discount the area under the navbar so a section isn't "active"
        // while it's still tucked behind it.
        rootMargin: "-88px 0px 0px 0px",
      },
    );

    elements.forEach((el) => observer.observe(el));

    // Landing at the very bottom should always light up the last nav item,
    // even if that section is shorter than the viewport.
    const onScroll = () => {
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      if (atBottom) {
        setActiveSection(navItems[navItems.length - 1].id);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [setActiveSection]);
}
