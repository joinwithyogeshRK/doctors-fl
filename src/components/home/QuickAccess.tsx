import Link from "next/link";
import { ArrowUpRight, CalendarPlus, Pill, Stethoscope, Video } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Action {
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
  accent: string;
}

const actions: Action[] = [
  {
    label: "Book appointment",
    description: "Pick a doctor, date and time",
    href: "/appointments/book",
    icon: CalendarPlus,
    accent: "var(--color-electric)",
  },
  {
    label: "Find a doctor",
    description: "Search by specialty or condition",
    href: "/doctors",
    icon: Stethoscope,
    accent: "var(--color-indigo)",
  },
  {
    label: "Video consultation",
    description: "Speak to a doctor from home",
    href: "/consultation/demo",
    icon: Video,
    accent: "var(--color-violet)",
  },
  {
    label: "Order medicines",
    description: "Delivered to your door",
    href: "/pharmacy",
    icon: Pill,
    accent: "var(--color-mint)",
  },
];

/**
 * Divider edges per breakpoint: stacked (1 col), 2x2 (sm), single row (xl).
 * Keeps the four actions reading as one panel instead of four cards.
 */
const edges = [
  "",
  "border-t sm:border-t-0 sm:border-l",
  "border-t xl:border-t-0 xl:border-l",
  "border-t sm:border-l xl:border-t-0",
];

/**
 * One segmented panel rather than four separate cards — it reads as a
 * single control surface lifted off the hero.
 */
export function QuickAccess() {
  return (
    <section aria-label="Quick actions" className="relative z-20 -mt-16 lg:-mt-20">
      <div className="shell">
        <div className="glass grid grid-cols-1 overflow-hidden rounded-panel sm:grid-cols-2 xl:grid-cols-4">
          {actions.map((action, i) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className={`group relative flex items-center gap-4 p-5 transition-colors duration-300 hover:bg-white/70 sm:p-6 xl:flex-col xl:items-start xl:gap-5 hairline ${edges[i]}`}
              >
                <span
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-white shadow-[0_10px_22px_-10px] transition-transform duration-300 group-hover:-translate-y-1"
                  style={{
                    background: `linear-gradient(140deg, ${action.accent}, color-mix(in oklab, ${action.accent} 62%, black))`,
                    color: "#fff",
                    boxShadow: `0 12px 24px -12px ${action.accent}`,
                  }}
                >
                  <Icon size={21} />
                </span>

                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 font-semibold text-ink">
                    {action.label}
                    <ArrowUpRight
                      size={15}
                      className="text-ink-faint transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-electric"
                    />
                  </p>
                  <p className="mt-1 text-[0.8125rem] leading-snug text-ink-soft">
                    {action.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
