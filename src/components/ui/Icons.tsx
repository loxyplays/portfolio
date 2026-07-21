import type { ComponentType, SVGProps } from "react";
import type { SocialKey } from "@/lib/data";

export type IconProps = SVGProps<SVGSVGElement>;
export type IconComponent = ComponentType<IconProps>;

/**
 * Hand-rolled icon set.
 *
 * Deliberately not a dependency: every stroke icon here shares a 1.5 weight
 * and 24px box so they optically match at any size, and brand marks stay
 * pinned to their official paths rather than drifting with a package version.
 */

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function StrokeIcon({ children, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke} {...props}>
      {children}
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* UI                                                                          */
/* -------------------------------------------------------------------------- */

export const ArrowUpRight = (p: IconProps) => (
  <StrokeIcon {...p}>
    <path d="M7 17 17 7M8 7h9v9" />
  </StrokeIcon>
);

export const ArrowRight = (p: IconProps) => (
  <StrokeIcon {...p}>
    <path d="M4 12h16M14 6l6 6-6 6" />
  </StrokeIcon>
);

export const ArrowDown = (p: IconProps) => (
  <StrokeIcon {...p}>
    <path d="M12 4v16M6 14l6 6 6-6" />
  </StrokeIcon>
);

export const Menu = (p: IconProps) => (
  <StrokeIcon {...p}>
    <path d="M4 8h16M4 16h16" />
  </StrokeIcon>
);

export const Close = (p: IconProps) => (
  <StrokeIcon {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </StrokeIcon>
);

export const Mail = (p: IconProps) => (
  <StrokeIcon {...p}>
    <rect x="2.5" y="4.5" width="19" height="15" rx="3" />
    <path d="m3.5 7.5 7.36 5.15a2 2 0 0 0 2.28 0L20.5 7.5" />
  </StrokeIcon>
);

export const Copy = (p: IconProps) => (
  <StrokeIcon {...p}>
    <rect x="9" y="9" width="11.5" height="11.5" rx="2.5" />
    <path d="M6.5 15H5a1.5 1.5 0 0 1-1.5-1.5v-8A1.5 1.5 0 0 1 5 4h8A1.5 1.5 0 0 1 14.5 5.5V7" />
  </StrokeIcon>
);

export const Check = (p: IconProps) => (
  <StrokeIcon {...p}>
    <path d="m4.5 12.5 5 5 10-11" />
  </StrokeIcon>
);

export const Code = (p: IconProps) => (
  <StrokeIcon {...p}>
    <path d="m8 6-6 6 6 6M16 6l6 6-6 6M13.5 3.5l-3 17" />
  </StrokeIcon>
);

export const Sparkle = (p: IconProps) => (
  <StrokeIcon {...p}>
    <path d="M12 3v5m0 8v5M3 12h5m8 0h5M6.2 6.2l3 3m5.6 5.6 3 3m0-11.6-3 3m-5.6 5.6-3 3" />
  </StrokeIcon>
);

export const MapPin = (p: IconProps) => (
  <StrokeIcon {...p}>
    <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.5" />
  </StrokeIcon>
);

export const Clock = (p: IconProps) => (
  <StrokeIcon {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5.2l3.2 2" />
  </StrokeIcon>
);

export const Layers = (p: IconProps) => (
  <StrokeIcon {...p}>
    <path d="m12 3 9 5-9 5-9-5 9-5Z" />
    <path d="m3.5 12.5 8.5 4.7 8.5-4.7" />
  </StrokeIcon>
);

export const Terminal = (p: IconProps) => (
  <StrokeIcon {...p}>
    <rect x="2.5" y="4" width="19" height="16" rx="3" />
    <path d="m7 10 2.6 2.4L7 14.8M12.6 15H17" />
  </StrokeIcon>
);

export const Gamepad = (p: IconProps) => (
  <StrokeIcon {...p}>
    <path d="M7.5 8h9a4.5 4.5 0 0 1 4.4 3.6l.7 4a3.1 3.1 0 0 1-5.6 2.3L14.8 16H9.2l-1.2 1.9a3.1 3.1 0 0 1-5.6-2.3l.7-4A4.5 4.5 0 0 1 7.5 8Z" />
    <path d="M7 11.5v2.2M5.9 12.6h2.2M15.8 11.8h.01M17.9 13.6h.01" />
  </StrokeIcon>
);

export const Palette = (p: IconProps) => (
  <StrokeIcon {...p}>
    <path d="M12 21a9 9 0 1 1 9-9c0 2-1.6 2.6-3 2.6h-1.4a2 2 0 0 0-1.4 3.4 1.7 1.7 0 0 1-1.2 3H12Z" />
    <path d="M7.5 12h.01M9.8 8.2h.01M14.4 7.8h.01" />
  </StrokeIcon>
);

/* -------------------------------------------------------------------------- */
/* Brand marks — official paths, solid fill                                    */
/* -------------------------------------------------------------------------- */

export const GitHub = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58l-.01-2.05c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.96 0-1.32.47-2.39 1.24-3.23-.12-.31-.54-1.53.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6.01 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.18.77.84 1.23 1.91 1.23 3.23 0 4.63-2.8 5.65-5.48 5.95.43.37.81 1.1.81 2.22l-.01 3.29c0 .32.21.7.82.58A12.01 12.01 0 0 0 24 12.5C24 5.87 18.63.5 12 .5Z" />
  </svg>
);

export const X = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.65l-5.22-6.82-5.96 6.82H1.68l7.73-8.84L1.25 2.25h6.82l4.71 6.23 5.46-6.23Zm-1.16 17.52h1.83L7.01 4.13H5.05l12.03 15.64Z" />
  </svg>
);

export const LinkedIn = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12Zm1.78 13.02H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
  </svg>
);

export const Dribbble = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24Zm7.93 5.53a10.15 10.15 0 0 1 2.3 6.35c-.34-.07-3.7-.75-7.1-.33l-.24-.55c-.2-.48-.43-.97-.67-1.44 3.76-1.53 5.47-3.74 5.7-4.03ZM12 1.78c2.6 0 4.98.98 6.78 2.58-.2.28-1.74 2.34-5.37 3.7A53.4 53.4 0 0 0 9.6 2.2c.77-.19 1.57-.29 2.4-.29ZM7.63 2.9a63.1 63.1 0 0 1 3.79 5.79A21.2 21.2 0 0 1 1.86 10 10.27 10.27 0 0 1 7.63 2.9ZM1.63 12l.01-.3c.34.01 4.86.07 9.85-1.43.28.55.55 1.11.8 1.67l-.4.11c-5.14 1.66-7.87 6.2-8.1 6.58A10.2 10.2 0 0 1 1.63 12ZM12 22.24c-2.36 0-4.53-.8-6.26-2.15.18-.37 2.2-4.27 7.83-6.23l.06-.02a42.6 42.6 0 0 1 2.2 7.8c-1.16.5-2.44.6-3.83.6Zm5.56-1.54a44.5 44.5 0 0 0-2.01-7.4c3.2-.51 6.01.33 6.36.44a10.26 10.26 0 0 1-4.35 6.96Z" />
  </svg>
);

/** Lookup used by the socials list so data stays declarative. */
export const socialIcons: Record<SocialKey, IconComponent> = {
  github: GitHub,
  x: X,
  linkedin: LinkedIn,
  dribbble: Dribbble,
  mail: Mail,
};
