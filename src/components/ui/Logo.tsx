import Image from "next/image";
import { cn } from "@/lib/utils";

/** Intrinsic size of public/logo.png. Regenerate with scripts/logo-assets.mjs. */
const W = 320;
const H = 249;

/**
 * The brand mark.
 *
 * Sized by className (set a height and leave width auto) so the aspect ratio
 * is never fought. Defaults to empty alt text: everywhere it appears it sits
 * beside the site name, and announcing "logo" after it just repeats the same
 * information to a screen reader. Pass `alt` when it stands alone.
 */
export function Logo({
  className,
  alt = "",
  priority = false,
}: {
  className?: string;
  alt?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/logo.png"
      alt={alt}
      width={W}
      height={H}
      priority={priority}
      aria-hidden={alt === "" ? true : undefined}
      className={cn("h-6 w-auto select-none", className)}
    />
  );
}
