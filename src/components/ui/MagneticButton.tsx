"use client";

import { motion, useTransform } from "framer-motion";
import type { ReactNode, MouseEvent } from "react";
import { useMagnetic } from "@/hooks/useMagnetic";
import { useUIStore } from "@/store/useUIStore";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-bright text-void shadow-[0_10px_40px_-12px_rgba(255,255,255,0.45)] hover:shadow-[0_16px_50px_-10px_rgba(255,255,255,0.6)]",
  secondary: "glass text-bright hover:border-white/20 hover:bg-white/[0.07]",
  ghost:
    "text-muted hover:text-bright border border-transparent hover:border-white/10",
};

const sizeStyles: Record<Size, string> = {
  sm: "h-9 px-4 text-[0.8125rem] rounded-full gap-1.5",
  md: "h-11 px-5 text-sm rounded-full gap-2",
  lg: "h-[3.25rem] px-7 text-[0.9375rem] rounded-full gap-2.5",
};

type BaseProps = {
  children: ReactNode;
  className?: string;
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  /** Magnetic pull distance in px. 0 disables the effect. */
  magnetStrength?: number;
};

type ButtonProps = BaseProps & {
  href?: undefined;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit";
  disabled?: boolean;
};

type AnchorProps = BaseProps & {
  href: string;
  /** Force a new tab. Inferred for absolute URLs when omitted. */
  external?: boolean;
  onClick?: () => void;
};

export type MagneticButtonProps = ButtonProps | AnchorProps;

/**
 * The site's one button.
 *
 * Two nested layers do the work: an outer node that translates toward the
 * cursor, and an inner node that counter-translates at ~35%, so the label
 * appears to lag inside the shell. That parallax is the difference between a
 * magnetic button and a button that merely moves.
 */
export function MagneticButton(props: MagneticButtonProps) {
  const {
    children,
    className,
    variant = "primary",
    size = "md",
    icon,
    magnetStrength = 14,
  } = props;

  const { setRef, x, y, handlers } = useMagnetic({ max: magnetStrength });
  const setCursor = useUIStore((s) => s.setCursor);

  // Counter-motion for the inner content.
  const innerX = useTransform(x, (v) => v * -0.35);
  const innerY = useTransform(y, (v) => v * -0.35);

  const shellClass = cn(
    "group/btn relative inline-flex items-center justify-center overflow-hidden",
    "font-medium tracking-[-0.01em] whitespace-nowrap select-none",
    "transition-[background-color,border-color,box-shadow,color] duration-300",
    "disabled:pointer-events-none disabled:opacity-45",
    sizeStyles[size],
    variantStyles[variant],
    className,
  );

  const content = (
    <>
      {/* Sheen sweep, primary only — a light bar crossing the fill on hover. */}
      {variant === "primary" && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/15 to-transparent transition-transform duration-700 ease-out group-hover/btn:translate-x-full"
        />
      )}

      <motion.span
        className="relative z-10 inline-flex items-center gap-[inherit]"
        style={{ x: innerX, y: innerY }}
      >
        {children}
        {icon && (
          <span className="transition-transform duration-300 ease-out group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5">
            {icon}
          </span>
        )}
      </motion.span>
    </>
  );

  const onMouseEnter = () => setCursor("hover");
  const onMouseLeave = () => {
    handlers.onMouseLeave();
    setCursor("default");
  };

  const shellProps = {
    style: { x, y },
    className: shellClass,
    onMouseMove: handlers.onMouseMove,
    onMouseEnter,
    onMouseLeave,
  };

  if ("href" in props && props.href !== undefined) {
    const isExternal = props.external ?? /^https?:\/\//.test(props.href);

    // A plain anchor for every case. Internal links here are same-page
    // hashes, where next/link has nothing to prefetch and no route to
    // change — and wrapping the label in an overlaid <Link> would announce
    // it twice to a screen reader.
    return (
      <motion.a
        {...shellProps}
        ref={setRef}
        href={props.href}
        onClick={props.onClick}
        {...(isExternal
          ? { target: "_blank", rel: "noopener noreferrer" }
          : null)}
      >
        {content}
      </motion.a>
    );
  }

  const btn = props as ButtonProps;

  return (
    <motion.button
      {...shellProps}
      ref={setRef}
      type={btn.type ?? "button"}
      onClick={btn.onClick}
      disabled={btn.disabled}
    >
      {content}
    </motion.button>
  );
}
