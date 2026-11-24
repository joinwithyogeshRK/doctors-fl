import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cx } from "@/lib/format";

type Variant = "primary" | "secondary" | "ghost" | "onDark";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-[transform,box-shadow,background-color,color] duration-200 ease-out active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary:
    "bg-[linear-gradient(104deg,var(--color-electric),var(--color-indigo))] text-white shadow-[0_10px_28px_-10px_rgb(27_99_255/0.75)] hover:shadow-[0_16px_38px_-12px_rgb(27_99_255/0.85)] hover:-translate-y-0.5",
  secondary:
    "bg-white text-ink border border-[color-mix(in_oklab,var(--color-ink)_12%,transparent)] shadow-soft hover:border-[color-mix(in_oklab,var(--color-electric)_45%,transparent)] hover:text-electric hover:-translate-y-0.5",
  ghost: "text-ink-soft hover:text-electric hover:bg-ice",
  onDark:
    "bg-white/10 text-white border border-white/20 backdrop-blur-sm hover:bg-white/18 hover:-translate-y-0.5",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-[0.8125rem]",
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-[0.9375rem]",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: CommonProps & ComponentProps<"button">) {
  return (
    <button className={cx(base, variants[variant], sizes[size], className)} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: CommonProps & ComponentProps<typeof Link>) {
  return (
    <Link className={cx(base, variants[variant], sizes[size], className)} {...rest}>
      {children}
    </Link>
  );
}
