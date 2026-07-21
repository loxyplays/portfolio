import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { ProjectStatus } from "@/lib/data";

/** Small glass chip. Used for tech tags and meta labels. */
export function Chip({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-white/[0.09] bg-white/[0.035] px-2.5 py-1",
        "text-[0.6875rem] font-medium tracking-[0.01em] text-muted",
        "transition-colors duration-300 group-hover:border-white/[0.16] group-hover:text-bright/90",
        className,
      )}
    >
      {children}
    </span>
  );
}

/**
 * Status pill with a leading dot. Only "Live" gets the animated pulse — an
 * always-on ping next to four labels would just read as noise.
 */
export function StatusBadge({
  status,
  className,
}: {
  status: ProjectStatus;
  className?: string;
}) {
  const isLive = status === "Live";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1.5",
        "text-[0.6875rem] font-medium tracking-[0.02em] text-bright/90 backdrop-blur-md",
        className,
      )}
    >
      <span className="relative flex h-1.5 w-1.5">
        {isLive && (
          <span
            aria-hidden="true"
            className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-70"
          />
        )}
        <span
          className={cn(
            "relative inline-flex h-1.5 w-1.5 rounded-full",
            isLive ? "bg-white" : "bg-dim",
          )}
        />
      </span>
      {status}
    </span>
  );
}
