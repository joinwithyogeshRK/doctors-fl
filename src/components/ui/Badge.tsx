import type { ReactNode } from "react";
import { cx } from "@/lib/format";

interface BadgeProps {
  children: ReactNode;
  tone?: "neutral" | "mint" | "electric" | "amber";
  className?: string;
}

const tones = {
  neutral: "bg-ice text-ink-soft",
  mint: "bg-[color-mix(in_oklab,var(--color-mint)_14%,white)] text-[color-mix(in_oklab,var(--color-mint)_80%,black)]",
  electric: "bg-[color-mix(in_oklab,var(--color-electric)_12%,white)] text-electric-dark",
  amber: "bg-[color-mix(in_oklab,var(--color-amber)_18%,white)] text-[#8a5a00]",
};

export function Badge({ children, tone = "neutral", className }: BadgeProps) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Small pulsing dot used for "available today" / "online now". */
export function LiveDot({ className }: { className?: string }) {
  return (
    <span className={cx("relative flex h-1.5 w-1.5", className)}>
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint opacity-70" />
      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-mint" />
    </span>
  );
}
