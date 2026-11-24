"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { cx } from "@/lib/format";
import { isoToParts, monthLabel, toIso, useTodayIso } from "@/hooks/useToday";
import { Skeleton } from "@/components/ui/Surfaces";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface CalendarProps {
  value: string | null;
  onChange: (iso: string) => void;
  /** Returns how many slots a given date has. 0 means unavailable. */
  slotsOn: (iso: string) => number;
  /** How many days ahead can be booked. */
  horizonDays?: number;
}

export function Calendar({ value, onChange, slotsOn, horizonDays = 45 }: CalendarProps) {
  const todayIso = useTodayIso();
  const [offset, setOffset] = useState(0);

  if (!todayIso) {
    return <Skeleton className="h-80 w-full rounded-card" />;
  }

  const today = isoToParts(todayIso);
  const viewMonth = new Date(Date.UTC(today.year, today.month + offset, 1));
  const year = viewMonth.getUTCFullYear();
  const month = viewMonth.getUTCMonth();

  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  // Monday-first index for the 1st of the month.
  const firstWeekday = (new Date(Date.UTC(year, month, 1)).getUTCDay() + 6) % 7;

  const todayStamp = Date.UTC(today.year, today.month, today.day);
  const horizonStamp = todayStamp + horizonDays * 86_400_000;

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="font-display text-base font-semibold text-ink">{monthLabel(year, month)}</p>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setOffset((o) => Math.max(0, o - 1))}
            disabled={offset === 0}
            aria-label="Previous month"
            className="grid h-9 w-9 place-items-center rounded-full text-ink-soft transition-colors hover:bg-ice disabled:opacity-35 disabled:hover:bg-transparent"
          >
            <ChevronLeft size={17} />
          </button>
          <button
            type="button"
            onClick={() => setOffset((o) => Math.min(2, o + 1))}
            disabled={offset === 2}
            aria-label="Next month"
            className="grid h-9 w-9 place-items-center rounded-full text-ink-soft transition-colors hover:bg-ice disabled:opacity-35 disabled:hover:bg-transparent"
          >
            <ChevronRight size={17} />
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((day) => (
          <div key={day} className="pb-2 text-[0.6875rem] font-semibold text-ink-faint">
            {day}
          </div>
        ))}

        {Array.from({ length: firstWeekday }).map((_, i) => (
          <div key={`pad-${i}`} />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const iso = toIso(year, month, day);
          const stamp = Date.UTC(year, month, day);
          const isToday = iso === todayIso;
          const past = stamp < todayStamp;
          const beyond = stamp > horizonStamp;
          const slots = past || beyond ? 0 : slotsOn(iso);
          const disabled = slots === 0;
          const selected = value === iso;

          return (
            <button
              key={iso}
              type="button"
              disabled={disabled}
              onClick={() => onChange(iso)}
              aria-label={`${day} ${monthLabel(year, month)}${disabled ? ", unavailable" : `, ${slots} slots`}`}
              aria-pressed={selected}
              className={cx(
                "relative grid aspect-square place-items-center rounded-xl text-sm font-medium transition-all duration-150",
                selected && "bg-electric text-white shadow-[0_8px_18px_-8px_rgb(27_99_255/0.8)]",
                !selected && !disabled && "text-ink hover:bg-ice",
                !selected && disabled && "text-ink-faint/50",
                isToday && !selected && "ring-1 ring-electric/40",
              )}
            >
              {day}
              {!disabled && !selected && (
                <span className="absolute bottom-1.5 h-1 w-1 rounded-full bg-mint" aria-hidden="true" />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t hairline pt-4 text-xs text-ink-soft">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-mint" />
          Slots available
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-[4px] ring-1 ring-electric/40" />
          Today
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-[4px] bg-ice" />
          Unavailable
        </span>
      </div>
    </div>
  );
}

/** Slot grid with available / selected / booked states. */
export function SlotGrid({
  slots,
  booked,
  value,
  onChange,
}: {
  slots: string[];
  booked: string[];
  value: string | null;
  onChange: (slot: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {slots.map((slot) => {
        const isBooked = booked.includes(slot);
        const selected = value === slot;
        return (
          <button
            key={slot}
            type="button"
            disabled={isBooked}
            onClick={() => onChange(slot)}
            aria-pressed={selected}
            className={cx(
              "rounded-xl border px-3 py-3 text-sm font-semibold transition-all duration-150 tnum",
              selected && "border-electric bg-electric text-white shadow-[0_8px_18px_-8px_rgb(27_99_255/0.8)]",
              !selected && !isBooked && "hairline bg-white text-ink hover:border-electric hover:text-electric",
              isBooked && "border-transparent bg-ice text-ink-faint/60 line-through",
            )}
          >
            {slot}
          </button>
        );
      })}
    </div>
  );
}
