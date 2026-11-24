import Link from "next/link";
import { cx } from "@/lib/format";

export function Logo({ tone = "light" }: { tone?: "light" | "dark" }) {
  return (
    <Link
      href="/"
      className="group inline-flex items-center gap-2.5"
      aria-label="Meridian Health — home"
    >
      <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-[linear-gradient(140deg,var(--color-electric),var(--color-violet))] shadow-[0_6px_16px_-6px_rgb(27_99_255/0.8)]">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 20.5s-7.5-4.6-7.5-9.7A4.3 4.3 0 0 1 12 7.8a4.3 4.3 0 0 1 7.5 3c0 5.1-7.5 9.7-7.5 9.7Z"
            fill="white"
            fillOpacity="0.95"
          />
          <path
            d="M4.9 13.4h3l1.3-2.5 1.7 4.6 1.6-6 1.5 3.9h5.1"
            stroke="var(--color-electric)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span
        className={cx(
          "font-display text-[1.0625rem] font-bold tracking-[-0.03em]",
          tone === "dark" ? "text-white" : "text-ink",
        )}
      >
        Meridian<span className="text-electric">Health</span>
      </span>
    </Link>
  );
}
