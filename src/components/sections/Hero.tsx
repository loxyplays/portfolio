"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { site } from "@/lib/data";
import { useUIStore } from "@/store/useUIStore";
import { EASE } from "@/lib/motion";
import { AnimatedText } from "@/components/ui/AnimatedText";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { HeroVisual } from "@/components/hero/HeroVisual";
import { ArrowUpRight, ArrowDown, Mail } from "@/components/ui/Icons";

export function Hero() {
  const introComplete = useUIStore((s) => s.introComplete);
  const sectionRef = useRef<HTMLElement>(null);

  // Parallax the whole hero away as it scrolls out.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const visualY = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const visualScale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);

  // Everything waits for the preloader curtain.
  const play = introComplete;

  const rise = (delay: number) => ({
    initial: { opacity: 0, y: 22, filter: "blur(6px)" },
    animate: play
      ? { opacity: 1, y: 0, filter: "blur(0px)" }
      : { opacity: 0, y: 22, filter: "blur(6px)" },
    transition: { duration: 0.85, ease: EASE.out, delay },
  });

  return (
    <section
      ref={sectionRef}
      id="home"
      aria-labelledby="hero-heading"
      className="relative flex min-h-[100svh] items-center px-5 pb-20 pt-32 sm:px-8 lg:pt-28"
    >
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-8">
        {/* ------------------------------------------------------------ */}
        {/* Left: copy                                                    */}
        {/* ------------------------------------------------------------ */}
        <motion.div
          style={{ y: contentY, opacity: contentOpacity }}
          className="relative z-10 max-w-xl"
        >
          {/* Availability pill */}
          <motion.div {...rise(0.05)}>
            <a
              href="#contact"
              className="group inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] py-1.5 pl-2 pr-4 backdrop-blur-xl transition-colors duration-300 hover:border-white/20 hover:bg-white/[0.07]"
            >
              <span className="relative flex h-5 w-5 items-center justify-center">
                <span className="absolute h-2 w-2 animate-ping rounded-full bg-white/70" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-white" />
              </span>
              <span className="text-[0.75rem] font-medium tracking-[-0.005em] text-muted transition-colors group-hover:text-bright">
                {site.availabilityLabel}
              </span>
            </a>
          </motion.div>

          <h1
            id="hero-heading"
            className="mt-7 text-[2.5rem] font-semibold leading-[1.02] tracking-[-0.045em] sm:text-[3.5rem] lg:text-[4.25rem]"
          >
            <AnimatedText
              text="Building digital experiences that feel futuristic."
              wordClassName="text-gradient"
              play={play}
              delay={0.25}
              stagger={0.06}
              dim={["that", "feel"]}
            />
          </h1>

          <motion.p
            {...rise(0.85)}
            className="mt-7 max-w-lg text-[0.9375rem] leading-relaxed text-muted sm:text-[1.0625rem]"
          >
            I&apos;m {site.name.split(" ")[0]} — a developer and designer building
            websites, games, and applications. I care about the details most
            people only feel: how fast it loads, how it responds, how right it
            feels in the hand.
          </motion.p>

          <motion.div
            {...rise(1)}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <MagneticButton
              href="#projects"
              size="lg"
              icon={<ArrowUpRight className="h-4 w-4" />}
            >
              View Projects
            </MagneticButton>

            <MagneticButton
              href="#contact"
              size="lg"
              variant="secondary"
              icon={<Mail className="h-4 w-4" />}
            >
              Contact Me
            </MagneticButton>
          </motion.div>

          {/* Micro-credibility row */}
          <motion.div
            {...rise(1.15)}
            className="mt-12 flex items-center gap-6 text-[0.75rem] text-faint"
          >
            <span className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-white/40" />
              {site.location}
            </span>
            <span className="hidden h-3 w-px bg-white/10 sm:block" />
            <span className="hidden sm:inline">7+ years building for the web</span>
          </motion.div>
        </motion.div>

        {/* ------------------------------------------------------------ */}
        {/* Right: 3D scene                                               */}
        {/* ------------------------------------------------------------ */}
        <motion.div
          style={{ y: visualY, scale: visualScale }}
          initial={{ opacity: 0 }}
          animate={{ opacity: play ? 1 : 0 }}
          transition={{ duration: 1.2, ease: EASE.out, delay: 0.4 }}
          // The scene's decorative layers (a 26rem orb, 27rem rings) are wider
          // than a phone on purpose — they're meant to bleed. Below `lg` that
          // bleed would widen the page past the viewport and make mobile
          // browsers scale the whole document down to fit, so clip it there.
          // From `lg` the two-column grid gives them room, and the glow is
          // allowed to spill past the column edge as designed.
          //
          // Clipping here rather than inside HeroVisual keeps it clear of the
          // `perspective` element, since a non-visible overflow on that would
          // flatten the 3D scene.
          className="relative -mx-5 overflow-hidden lg:mx-0 lg:overflow-visible"
        >
          <HeroVisual />
        </motion.div>
      </div>

      {/* Scroll cue. Scroll-driven fade and intro fade live on separate
          elements — a single node can't take `opacity` from both `style` and
          `animate` without one silently winning. */}
      <motion.div
        style={{ opacity: contentOpacity }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 lg:block"
      >
        <motion.a
          href="#about"
          aria-label="Scroll to about section"
          initial={{ opacity: 0 }}
          animate={{ opacity: play ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 1.6 }}
          className="group flex flex-col items-center gap-2"
        >
          <span className="text-[0.625rem] font-medium uppercase tracking-[0.24em] text-faint transition-colors group-hover:text-muted">
            Scroll
          </span>
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-dim transition-colors group-hover:text-bright"
          >
            <ArrowDown className="h-4 w-4" />
          </motion.span>
        </motion.a>
      </motion.div>
    </section>
  );
}
