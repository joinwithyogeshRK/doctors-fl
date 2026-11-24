"use client";

import { Check } from "lucide-react";
import { cx } from "@/lib/format";

export function Stepper({
  steps,
  current,
  onJump,
}: {
  steps: string[];
  current: number;
  onJump?: (index: number) => void;
}) {
  return (
    <>
      {/* Compact progress on small screens */}
      <div className="sm:hidden">
        <div className="flex items-baseline justify-between">
          <p className="text-sm font-semibold text-ink">{steps[current]}</p>
          <p className="text-xs text-ink-faint tnum">
            Step {current + 1} of {steps.length}
          </p>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ice">
          <div
            className="h-full rounded-full bg-[linear-gradient(90deg,var(--color-electric),var(--color-violet))] transition-[width] duration-400"
            style={{ width: `${((current + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Full rail on larger screens */}
      <ol className="hidden items-center gap-2 sm:flex" aria-label="Progress">
        {steps.map((step, i) => {
          const done = i < current;
          const active = i === current;
          const reachable = Boolean(onJump) && i <= current;
          return (
            <li key={step} className="flex min-w-0 flex-1 items-center gap-2">
              <button
                type="button"
                disabled={!reachable}
                onClick={() => reachable && onJump?.(i)}
                aria-current={active ? "step" : undefined}
                className={cx(
                  "flex min-w-0 items-center gap-2 rounded-full py-1 text-left transition-colors",
                  reachable && "cursor-pointer hover:opacity-80",
                  !reachable && "cursor-default",
                )}
              >
                <span
                  className={cx(
                    "grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold transition-colors",
                    done && "bg-mint text-white",
                    active && "bg-electric text-white",
                    !done && !active && "bg-ice text-ink-faint",
                  )}
                >
                  {done ? <Check size={14} /> : i + 1}
                </span>
                <span
                  className={cx(
                    "hidden truncate text-xs font-semibold lg:block",
                    active ? "text-ink" : "text-ink-faint",
                  )}
                >
                  {step}
                </span>
              </button>
              {i < steps.length - 1 && (
                <span
                  aria-hidden="true"
                  className={cx(
                    "h-px flex-1 transition-colors",
                    done ? "bg-mint" : "bg-[color-mix(in_oklab,var(--color-ink)_12%,transparent)]",
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </>
  );
}
