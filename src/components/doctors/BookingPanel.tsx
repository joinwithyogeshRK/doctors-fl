"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CalendarDays, Phone, Stethoscope, Video } from "lucide-react";
import type { Doctor, ConsultationType } from "@/types";
import { allSlots, bookedSlots } from "@/data/appointments";
import { consultationLabel, cx, formatFee } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { Calendar, SlotGrid } from "@/components/ui/Calendar";
import { formatLongDate } from "@/hooks/useToday";

const typeIcon = { "in-clinic": Stethoscope, video: Video, phone: Phone };

/** Slots a doctor offers on a given date, minus what is already taken. */
export function slotsForDoctor(doctor: Doctor, iso: string): string[] {
  const weekday = new Date(`${iso}T00:00:00Z`).getUTCDay();
  if (weekday === 0) return []; // closed Sundays
  const taken = bookedSlots[iso] ?? [];
  const offered = doctor.availableSlots.length >= 3 ? doctor.availableSlots : allSlots.slice(0, 6);
  return offered.filter((slot) => !taken.includes(slot));
}

export function BookingPanel({ doctor }: { doctor: Doctor }) {
  const router = useRouter();
  const [type, setType] = useState<ConsultationType>(doctor.consultationTypes[0]);
  const [date, setDate] = useState<string | null>(null);
  const [slot, setSlot] = useState<string | null>(null);

  const slots = date ? slotsForDoctor(doctor, date) : [];
  const taken = date ? (bookedSlots[date] ?? []) : [];
  const offered = date
    ? Array.from(new Set([...slots, ...taken])).sort(
        (a, b) => allSlots.indexOf(a) - allSlots.indexOf(b),
      )
    : [];

  const go = () => {
    const params = new URLSearchParams({ doctor: doctor.slug, type });
    if (date) params.set("date", date);
    if (slot) params.set("time", slot);
    router.push(`/appointments/book?${params.toString()}`);
  };

  return (
    <div className="rounded-panel border border-[color-mix(in_oklab,var(--color-ink)_8%,transparent)] bg-white p-5 shadow-lift sm:p-6">
      <div className="flex items-baseline justify-between">
        <p className="text-sm text-ink-soft">Consultation fee</p>
        <p className="font-display text-2xl font-bold text-ink">
          {formatFee(doctor.consultationFee)}
        </p>
      </div>

      <div className="mt-5">
        <p className="mb-2.5 text-xs font-semibold text-ink-soft">How would you like to be seen?</p>
        <div className="grid grid-cols-3 gap-1.5">
          {(["in-clinic", "video", "phone"] as ConsultationType[]).map((option) => {
            const Icon = typeIcon[option];
            const offeredType = doctor.consultationTypes.includes(option);
            const selected = type === option;
            return (
              <button
                key={option}
                type="button"
                disabled={!offeredType}
                onClick={() => setType(option)}
                aria-pressed={selected}
                className={cx(
                  "flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-[0.6875rem] font-semibold transition-all",
                  selected && "border-electric bg-[color-mix(in_oklab,var(--color-electric)_7%,white)] text-electric",
                  !selected && offeredType && "hairline text-ink-soft hover:border-electric/50",
                  !offeredType && "cursor-not-allowed border-transparent bg-ice text-ink-faint/60",
                )}
              >
                <Icon size={17} />
                {consultationLabel[option]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 border-t hairline pt-6">
        <Calendar
          value={date}
          onChange={(iso) => {
            setDate(iso);
            setSlot(null);
          }}
          slotsOn={(iso) => slotsForDoctor(doctor, iso).length}
        />
      </div>

      {date && (
        <div className="mt-6 border-t hairline pt-6">
          <p className="mb-3 text-xs font-semibold text-ink-soft">
            Slots on {formatLongDate(date)}
          </p>
          {offered.length === 0 ? (
            <p className="rounded-xl bg-mist px-4 py-3 text-sm text-ink-soft">
              No slots left on this date. Try the next available day.
            </p>
          ) : (
            <SlotGrid slots={offered} booked={taken} value={slot} onChange={setSlot} />
          )}
        </div>
      )}

      <Button className="mt-6 w-full" size="lg" onClick={go}>
        <CalendarDays size={17} />
        {slot ? `Book ${slot}` : "Continue to booking"}
      </Button>

      <p className="mt-3 text-center text-xs text-ink-faint">
        Free cancellation up to 4 hours before
      </p>
    </div>
  );
}
