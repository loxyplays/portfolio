"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  alpha: number;
  /** Depth 0..1 — drives size, opacity and how much the pointer pushes it. */
  z: number;
};

type ParticleFieldProps = {
  className?: string;
  /** Particles at 1920px wide; scaled down proportionally on smaller screens. */
  count?: number;
  /** Draw lines between particles closer than this many px. */
  linkDistance?: number;
  interactive?: boolean;
};

/**
 * Canvas particle field.
 *
 * 2D canvas rather than WebGL: at this particle count the cost is a fraction
 * of a millisecond per frame and it avoids shipping a 3D runtime for what is
 * ultimately drifting dots. Pauses entirely when scrolled out of view.
 */
export function ParticleField({
  className,
  count = 46,
  linkDistance = 130,
  interactive = true,
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReduced = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let particles: Particle[] = [];
    let raf = 0;
    let running = true;

    const pointer = { x: -9999, y: -9999, active: false };

    const seed = () => {
      // Scale density with area so a phone doesn't run desktop counts.
      const scaled = Math.round(count * Math.min(1, width / 1920 + 0.35));
      particles = Array.from({ length: scaled }, () => {
        const z = Math.random();
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.16,
          vy: (Math.random() - 0.5) * 0.16,
          r: 0.6 + z * 1.5,
          alpha: 0.16 + z * 0.4,
          z,
        };
      });
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      // Cap DPR at 2 — beyond that the pixel cost isn't visible here.
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;

        // Wrap rather than bounce — bouncing makes the edges legible.
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        let drawX = p.x;
        let drawY = p.y;

        // Pointer repulsion, weighted by depth so the field parts in layers.
        if (interactive && pointer.active) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const dist = Math.hypot(dx, dy);
          const radius = 150;
          if (dist < radius && dist > 0.01) {
            const push = (1 - dist / radius) * 26 * (0.4 + p.z);
            drawX += (dx / dist) * push;
            drawY += (dy / dist) * push;
          }
        }

        ctx.beginPath();
        ctx.arc(drawX, drawY, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
        ctx.fill();

        // Constellation links. Inner loop starts at i+1 so each pair is
        // considered once.
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = drawX - q.x;
          const dy = drawY - q.y;
          const dist = Math.hypot(dx, dy);
          if (dist < linkDistance) {
            const strength = (1 - dist / linkDistance) * 0.11;
            ctx.beginPath();
            ctx.moveTo(drawX, drawY);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(255,255,255,${strength})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      if (running) raf = requestAnimationFrame(draw);
    };

    const onPointerMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
    };
    const onPointerLeave = () => {
      pointer.active = false;
    };

    resize();
    raf = requestAnimationFrame(draw);

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    // Stop rendering entirely when off-screen — this is the single biggest
    // win for scroll performance further down the page.
    const visibility = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !running) {
          running = true;
          raf = requestAnimationFrame(draw);
        } else if (!entry.isIntersecting && running) {
          running = false;
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0 },
    );
    visibility.observe(canvas);

    const onVisibilityChange = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        raf = requestAnimationFrame(draw);
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    if (interactive) {
      window.addEventListener("mousemove", onPointerMove, { passive: true });
      document.addEventListener("mouseleave", onPointerLeave);
    }

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      visibility.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("mousemove", onPointerMove);
      document.removeEventListener("mouseleave", onPointerLeave);
    };
  }, [count, linkDistance, interactive, prefersReduced]);

  if (prefersReduced) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn("pointer-events-none h-full w-full", className)}
    />
  );
}
