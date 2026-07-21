"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import { usePointerParallax } from "@/hooks/usePointerParallax";
import { ParticleField } from "@/components/effects/ParticleField";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/* Floating layer                                                              */
/* -------------------------------------------------------------------------- */

type FloatLayerProps = {
  x: MotionValue<number>;
  y: MotionValue<number>;
  /** Pixels of pointer travel. Higher = reads as nearer to camera. */
  depth: number;
  /** Z translation within the 3D scene. */
  z?: number;
  className?: string;
  children: React.ReactNode;
  delay?: number;
  /** Seconds for one idle float cycle. */
  floatDuration?: number;
};

/**
 * One element in the 3D scene: pointer parallax, a genuine Z offset, and an
 * independent idle float.
 *
 * The float lives on an inner node and the parallax on the outer one, so the
 * two transforms compose instead of overwriting each other.
 */
function FloatLayer({
  x,
  y,
  depth,
  z = 0,
  className,
  children,
  delay = 0,
  floatDuration = 9,
}: FloatLayerProps) {
  const tx = useTransform(x, [-1, 1], [-depth, depth]);
  const ty = useTransform(y, [-1, 1], [-depth, depth]);

  // Layers nearer the camera rotate a touch more.
  const rotY = useTransform(x, [-1, 1], [depth * 0.16, -depth * 0.16]);
  const rotX = useTransform(y, [-1, 1], [-depth * 0.12, depth * 0.12]);

  return (
    <motion.div
      className={cn("absolute", className)}
      style={{ x: tx, y: ty, z, rotateX: rotX, rotateY: rotY }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: EASE.out, delay }}
    >
      <motion.div
        animate={{ y: [0, -14, 0] }}
        transition={{
          duration: floatDuration,
          repeat: Infinity,
          ease: "easeInOut",
          delay,
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/* Code card                                                                   */
/* -------------------------------------------------------------------------- */

/** Monochrome syntax "highlighting" — weight and opacity carry the roles. */
const T = {
  key: "text-white font-medium",
  fn: "text-white/85",
  str: "text-white/55",
  com: "text-white/28 italic",
  punc: "text-white/40",
  plain: "text-white/70",
};

function CodeCard() {
  return (
    <div className="ring-gradient w-[19rem] overflow-hidden rounded-[20px] bg-black/55 backdrop-blur-2xl sm:w-[23rem]">
      {/* Window chrome */}
      <div className="flex items-center gap-2 border-b border-white/[0.07] px-4 py-3">
        <span className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/13" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/[0.08]" />
        </span>
        <span className="ml-1.5 font-mono text-[0.625rem] tracking-wide text-white/35">
          motion.ts
        </span>
      </div>

      <pre className="overflow-hidden px-4 py-4 font-mono text-[0.6875rem] leading-[1.85]">
        <code>
          <span className={T.com}>{"// the only easing that matters"}</span>
          {"\n"}
          <span className={T.key}>export const</span>{" "}
          <span className={T.fn}>ease</span> <span className={T.punc}>=</span>{" "}
          <span className={T.punc}>[</span>
          <span className={T.str}>0.16</span>
          <span className={T.punc}>,</span> <span className={T.str}>1</span>
          <span className={T.punc}>,</span> <span className={T.str}>0.3</span>
          <span className={T.punc}>,</span> <span className={T.str}>1</span>
          <span className={T.punc}>{"]"}</span>
          {"\n\n"}
          <span className={T.key}>function</span>{" "}
          <span className={T.fn}>reveal</span>
          <span className={T.punc}>(</span>
          <span className={T.plain}>el</span>
          <span className={T.punc}>)</span> <span className={T.punc}>{"{"}</span>
          {"\n  "}
          <span className={T.key}>return</span>{" "}
          <span className={T.fn}>animate</span>
          <span className={T.punc}>(</span>
          <span className={T.plain}>el</span>
          <span className={T.punc}>,</span> <span className={T.punc}>{"{"}</span>
          {"\n    "}
          <span className={T.plain}>opacity</span>
          <span className={T.punc}>:</span> <span className={T.str}>[0, 1]</span>
          <span className={T.punc}>,</span>
          {"\n    "}
          <span className={T.plain}>y</span>
          <span className={T.punc}>:</span>{" "}
          <span className={T.str}>[24, 0]</span>
          <span className={T.punc}>,</span>
          {"\n  "}
          <span className={T.punc}>{"}"}</span>
          <span className={T.punc}>,</span> <span className={T.punc}>{"{"}</span>{" "}
          <span className={T.plain}>ease</span>{" "}
          <span className={T.punc}>{"}"}</span>
          <span className={T.punc}>)</span>
          {"\n"}
          <span className={T.punc}>{"}"}</span>
          <motion.span
            aria-hidden="true"
            className="ml-0.5 inline-block h-[0.95em] w-[0.5em] translate-y-[0.12em] bg-white/70"
            animate={{ opacity: [1, 1, 0, 0] }}
            transition={{ duration: 1.1, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
          />
        </code>
      </pre>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Small floating cards                                                        */
/* -------------------------------------------------------------------------- */

function DeployCard() {
  return (
    <div className="glass-strong flex items-center gap-3 rounded-2xl px-4 py-3">
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
      </span>
      <div className="leading-tight">
        <p className="text-[0.6875rem] font-medium text-bright">
          Deployed to production
        </p>
        <p className="font-mono text-[0.625rem] text-white/35">
          build 4d2f1a · 812ms
        </p>
      </div>
    </div>
  );
}

function MetricCard() {
  const bars = [38, 62, 45, 78, 56, 92, 71];

  return (
    <div className="glass-strong w-[10.5rem] rounded-[20px] p-4">
      <p className="text-[0.625rem] font-medium uppercase tracking-[0.16em] text-white/35">
        Lighthouse
      </p>
      <p className="mt-1 text-3xl font-semibold tracking-tight text-bright">
        100
      </p>

      <div className="mt-3 flex h-9 items-end gap-1">
        {bars.map((h, i) => (
          <motion.span
            key={i}
            className="flex-1 rounded-sm bg-white/25"
            initial={{ height: "12%" }}
            animate={{ height: `${h}%` }}
            transition={{
              duration: 1.4,
              delay: 1 + i * 0.08,
              ease: EASE.out,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function StackCard() {
  return (
    <div className="glass flex items-center gap-2 rounded-full px-3.5 py-2">
      <span className="font-mono text-[0.625rem] tracking-wide text-white/50">
        TypeScript
      </span>
      <span className="h-3 w-px bg-white/15" />
      <span className="font-mono text-[0.625rem] tracking-wide text-white/50">
        99.2%
      </span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Scene                                                                       */
/* -------------------------------------------------------------------------- */

/**
 * The hero's right-hand visual.
 *
 * Built from CSS 3D transforms on a shared `perspective` rather than WebGL —
 * at this complexity a canvas renderer would cost ~600KB of runtime and a
 * second paint path for something the compositor draws for free.
 */
export function HeroVisual() {
  const { x, y } = usePointerParallax();

  // The whole scene counter-rotates slightly, which sells the depth.
  const sceneRotY = useTransform(x, [-1, 1], [6, -6]);
  const sceneRotX = useTransform(y, [-1, 1], [-4, 4]);

  return (
    <div
      aria-hidden="true"
      className="relative h-[30rem] w-full select-none sm:h-[34rem] lg:h-[38rem]"
      style={{ perspective: "1400px" }}
    >
      {/* Gradient orb — the light source everything else is lit by. */}
      <motion.div
        className="absolute left-1/2 top-1/2 h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.16),rgba(255,255,255,0.04)_45%,transparent_70%)] blur-2xl"
        animate={{ scale: [1, 1.12, 1], opacity: [0.75, 1, 0.75] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Particles sit behind the cards. */}
      <div className="absolute inset-0">
        <ParticleField count={38} linkDistance={110} />
      </div>

      <motion.div
        className="relative h-full w-full preserve-3d"
        style={{ rotateX: sceneRotX, rotateY: sceneRotY }}
      >
        {/* Wireframe rings — abstract geometry, slowly counter-rotating. */}
        <motion.div
          className="absolute left-1/2 top-1/2 h-[21rem] w-[21rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.09]"
          style={{ rotateX: 68 }}
          animate={{ rotateZ: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute left-1/2 top-1/2 h-[27rem] w-[27rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.055]"
          style={{ rotateX: 72, rotateY: 14 }}
          animate={{ rotateZ: -360 }}
          transition={{ duration: 62, repeat: Infinity, ease: "linear" }}
        />

        {/* Main code card — the anchor of the composition. */}
        <FloatLayer
          x={x}
          y={y}
          depth={22}
          z={60}
          delay={0.15}
          floatDuration={11}
          className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <div className="rotate-[-3deg]">
            <CodeCard />
          </div>
        </FloatLayer>

        {/* Satellites */}
        <FloatLayer
          x={x}
          y={y}
          depth={38}
          z={130}
          delay={0.5}
          floatDuration={8}
          className="right-[2%] top-[12%] sm:right-[4%]"
        >
          <div className="rotate-[4deg]">
            <MetricCard />
          </div>
        </FloatLayer>

        <FloatLayer
          x={x}
          y={y}
          depth={30}
          z={100}
          delay={0.7}
          floatDuration={9.5}
          className="bottom-[14%] left-[-2%] sm:left-[2%]"
        >
          <div className="rotate-[-5deg]">
            <DeployCard />
          </div>
        </FloatLayer>

        <FloatLayer
          x={x}
          y={y}
          depth={16}
          z={30}
          delay={0.85}
          floatDuration={12}
          className="right-[8%] bottom-[20%]"
        >
          <div className="rotate-[3deg]">
            <StackCard />
          </div>
        </FloatLayer>

        {/* Loose dots for depth at the extremes. */}
        <FloatLayer
          x={x}
          y={y}
          depth={46}
          z={160}
          delay={1}
          floatDuration={7}
          className="left-[14%] top-[16%]"
        >
          <span className="block h-2 w-2 rounded-full bg-white/60 shadow-[0_0_18px_4px_rgba(255,255,255,0.28)]" />
        </FloatLayer>

        <FloatLayer
          x={x}
          y={y}
          depth={12}
          z={-40}
          delay={1.1}
          floatDuration={13}
          className="right-[22%] top-[6%]"
        >
          <span className="block h-1.5 w-1.5 rounded-full bg-white/30" />
        </FloatLayer>

        <FloatLayer
          x={x}
          y={y}
          depth={26}
          z={70}
          delay={1.2}
          floatDuration={10}
          className="bottom-[8%] right-[38%]"
        >
          <span className="block h-1 w-1 rounded-full bg-white/45" />
        </FloatLayer>
      </motion.div>
    </div>
  );
}
