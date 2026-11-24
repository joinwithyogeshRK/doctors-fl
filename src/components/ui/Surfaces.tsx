import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { cx } from "@/lib/format";

/* ---------- Page heading used across inner pages ---------- */

export function PageHeader({
  eyebrow,
  title,
  lede,
  action,
  tone = "light",
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
  action?: ReactNode;
  tone?: "light" | "dark";
}) {
  return (
    <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        {eyebrow && (
          <p className={cx("text-sm font-medium", tone === "dark" ? "text-electric-light" : "text-electric")}>
            {eyebrow}
          </p>
        )}
        <h1
          className={cx(
            "mt-2 font-display text-[clamp(1.75rem,4vw,2.5rem)] leading-[1.08] font-bold",
            tone === "dark" ? "text-white" : "text-ink",
          )}
        >
          {title}
        </h1>
        {lede && (
          <p className={cx("mt-3 text-base leading-relaxed", tone === "dark" ? "text-white/65" : "text-ink-soft")}>
            {lede}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/* ---------- Breadcrumbs ---------- */

export function Breadcrumbs({ trail }: { trail: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-ink-faint">
        {trail.map((crumb, i) => (
          <li key={crumb.label} className="flex items-center gap-1">
            {i > 0 && <ChevronRight size={14} aria-hidden="true" />}
            {crumb.href ? (
              <Link href={crumb.href} className="transition-colors hover:text-electric">
                {crumb.label}
              </Link>
            ) : (
              <span className="font-medium text-ink-soft">{crumb.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* ---------- Card ---------- */

export function Card({
  children,
  className,
  padded = true,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <div
      className={cx(
        "rounded-card border border-[color-mix(in_oklab,var(--color-ink)_8%,transparent)] bg-white shadow-soft",
        padded && "p-5 sm:p-6",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-5 flex items-center justify-between gap-4">
      <h2 className="text-base font-semibold text-ink">{children}</h2>
      {action}
    </div>
  );
}

/* ---------- Empty state ---------- */

export function EmptyState({
  icon,
  title,
  body,
  action,
}: {
  icon: ReactNode;
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center rounded-card border border-dashed border-[color-mix(in_oklab,var(--color-ink)_14%,transparent)] bg-mist px-6 py-14 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white text-ink-faint shadow-soft">
        {icon}
      </span>
      <h3 className="mt-5 text-base font-semibold text-ink">{title}</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink-soft">{body}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

/* ---------- Loading skeleton ---------- */

export function Skeleton({ className }: { className?: string }) {
  return <div className={cx("animate-pulse rounded-xl bg-ice", className)} />;
}

export function SkeletonCard() {
  return (
    <Card>
      <div className="flex items-start gap-4">
        <Skeleton className="h-16 w-16 rounded-2xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-1/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <Skeleton className="mt-5 h-10 w-full" />
    </Card>
  );
}

/* ---------- Stat tile ---------- */

export function StatTile({
  label,
  value,
  detail,
  icon,
  tone = "neutral",
}: {
  label: string;
  value: ReactNode;
  detail?: string;
  icon?: ReactNode;
  tone?: "neutral" | "mint" | "electric" | "violet" | "amber";
}) {
  const tint = {
    neutral: "bg-ice text-ink-soft",
    mint: "bg-[color-mix(in_oklab,var(--color-mint)_14%,white)] text-mint",
    electric: "bg-[color-mix(in_oklab,var(--color-electric)_12%,white)] text-electric",
    violet: "bg-[color-mix(in_oklab,var(--color-violet)_12%,white)] text-violet",
    amber: "bg-[color-mix(in_oklab,var(--color-amber)_18%,white)] text-[#8a5a00]",
  }[tone];

  return (
    <Card className="flex items-start gap-4">
      {icon && <span className={cx("grid h-11 w-11 shrink-0 place-items-center rounded-2xl", tint)}>{icon}</span>}
      <div className="min-w-0">
        <p className="text-sm text-ink-soft">{label}</p>
        <p className="font-display mt-1 text-2xl font-bold text-ink tnum">{value}</p>
        {detail && <p className="mt-1 text-xs text-ink-faint">{detail}</p>}
      </div>
    </Card>
  );
}

/* ---------- Status pill ---------- */

const statusTones: Record<string, string> = {
  upcoming: "bg-[color-mix(in_oklab,var(--color-electric)_12%,white)] text-electric-dark",
  pending: "bg-[color-mix(in_oklab,var(--color-amber)_20%,white)] text-[#8a5a00]",
  completed: "bg-[color-mix(in_oklab,var(--color-mint)_14%,white)] text-[color-mix(in_oklab,var(--color-mint)_82%,black)]",
  cancelled: "bg-[color-mix(in_oklab,var(--color-coral)_12%,white)] text-coral",
  paid: "bg-[color-mix(in_oklab,var(--color-mint)_14%,white)] text-[color-mix(in_oklab,var(--color-mint)_82%,black)]",
  unpaid: "bg-ice text-ink-soft",
};

export function StatusPill({ status, children }: { status: string; children?: ReactNode }) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold capitalize",
        statusTones[status] ?? "bg-ice text-ink-soft",
      )}
    >
      {children ?? status}
    </span>
  );
}
