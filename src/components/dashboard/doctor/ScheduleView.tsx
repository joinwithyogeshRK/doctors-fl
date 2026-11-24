"use client";

import { useState } from "react";
import { Ban, Check, Clock, Plus, Save } from "lucide-react";
import { patientById } from "@/data/patients";
import { cx } from "@/lib/format";
import { useClinicAppointments } from "@/store/appointments";
import { Card, CardTitle, PageHeader } from "@/components/ui/Surfaces";
import { Button } from "@/components/ui/Button";
import { SelectField } from "@/components/ui/Field";
import { useToast } from "@/components/providers/ToastProvider";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HOURS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "14:00", "14:30", "15:00", "16:00", "16:30",
  "17:00", "17:30", "18:00", "19:00",
];

type SlotState = "available" | "blocked" | "booked";

const seedBookings: Record<string, string> = {
  "Mon-09:00": "Ravi Pawar",
  "Mon-11:30": "Alex Fernandes",
  "Tue-10:00": "Sunita Agarwal",
  "Tue-14:00": "Imran Khan",
  "Wed-16:30": "Lakshmi Iyer",
  "Thu-09:30": "Zoya Rahman",
  "Thu-15:00": "Ravi Pawar",
  "Fri-11:00": "Alex Fernandes",
  "Fri-17:00": "Sunita Agarwal",
};

export function ScheduleView() {
  const { toast } = useToast();
  const clinic = useClinicAppointments();
  const [blocked, setBlocked] = useState<Set<string>>(new Set(["Wed-12:00", "Sat-17:00"]));
  const [workingDays, setWorkingDays] = useState<Set<string>>(
    new Set(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]),
  );
  const [duration, setDuration] = useState("30");
  const [accepting, setAccepting] = useState(true);

  const stateOf = (day: string, hour: string): SlotState => {
    const key = `${day}-${hour}`;
    if (seedBookings[key]) return "booked";
    if (blocked.has(key)) return "blocked";
    return "available";
  };

  const toggleSlot = (day: string, hour: string) => {
    const key = `${day}-${hour}`;
    if (seedBookings[key]) {
      toast("info", "That slot is booked", `${seedBookings[key]} · ${day} ${hour}`);
      return;
    }
    setBlocked((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
        toast("success", "Slot opened", `${day} at ${hour}`);
      } else {
        next.add(key);
        toast("info", "Slot blocked", `${day} at ${hour}`);
      }
      return next;
    });
  };

  const toggleDay = (day: string) => {
    setWorkingDays((prev) => {
      const next = new Set(prev);
      if (next.has(day)) next.delete(day);
      else next.add(day);
      return next;
    });
  };

  const bookedCount = Object.keys(seedBookings).length;
  const blockedCount = blocked.size;
  const openCount = DAYS.filter((d) => workingDays.has(d)).length * HOURS.length - bookedCount - blockedCount;

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Schedule"
        lede="Set your working hours, block time out, and see the week at a glance."
        action={
          <Button onClick={() => toast("success", "Schedule saved", "Patients see the updated availability immediately.")}>
            <Save size={16} />
            Save changes
          </Button>
        }
      />

      <div className="mt-7 grid gap-5 xl:grid-cols-[1fr_19rem]">
        {/* Week grid */}
        <Card padded={false} className="overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 p-5 sm:p-6">
            <CardTitle>This week</CardTitle>
            <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-ink-soft">
              <Key tone="bg-[color-mix(in_oklab,var(--color-mint)_16%,white)]" label="Available" />
              <Key tone="bg-electric" label="Booked" textLight />
              <Key tone="bg-ice-deep" label="Blocked" />
            </ul>
          </div>

          <div className="overflow-x-auto px-5 pb-5 sm:px-6 sm:pb-6">
            <div className="min-w-[46rem]">
              <div className="grid grid-cols-[4rem_repeat(7,1fr)] gap-1">
                <span />
                {DAYS.map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    aria-pressed={workingDays.has(day)}
                    className={cx(
                      "rounded-lg py-2 text-xs font-semibold transition-colors",
                      workingDays.has(day)
                        ? "bg-ice text-ink hover:bg-ice-deep"
                        : "bg-mist text-ink-faint/60 line-through",
                    )}
                  >
                    {day}
                  </button>
                ))}

                {HOURS.map((hour) => (
                  <div key={hour} className="contents">
                    <span className="flex items-center justify-end pr-2 text-[0.625rem] text-ink-faint tnum">
                      {hour}
                    </span>
                    {DAYS.map((day) => {
                      const off = !workingDays.has(day);
                      const state = stateOf(day, hour);
                      const booking = seedBookings[`${day}-${hour}`];
                      return (
                        <button
                          key={`${day}-${hour}`}
                          type="button"
                          disabled={off}
                          onClick={() => toggleSlot(day, hour)}
                          title={booking ? `${booking} · ${day} ${hour}` : `${day} ${hour}`}
                          aria-label={`${day} ${hour}, ${off ? "not working" : state}`}
                          className={cx(
                            "h-7 rounded-md text-[0.5625rem] font-semibold transition-colors",
                            off && "cursor-not-allowed bg-mist",
                            !off && state === "available" && "bg-[color-mix(in_oklab,var(--color-mint)_16%,white)] hover:bg-[color-mix(in_oklab,var(--color-mint)_28%,white)]",
                            !off && state === "booked" && "truncate bg-electric px-1 text-white",
                            !off && state === "blocked" && "bg-ice-deep text-ink-faint",
                          )}
                        >
                          {state === "booked" ? booking?.split(" ")[0] : ""}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Controls */}
        <div className="space-y-5">
          <Card>
            <CardTitle>Availability</CardTitle>
            <label className="flex items-center justify-between gap-4">
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-ink">Accepting bookings</span>
                <span className="mt-0.5 block text-xs text-ink-faint">
                  Turn off to hide your slots from patients
                </span>
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={accepting}
                aria-label="Accepting bookings"
                onClick={() => {
                  setAccepting((a) => !a);
                  toast(accepting ? "info" : "success", accepting ? "Bookings paused" : "Bookings open");
                }}
                className={cx(
                  "relative h-6 w-11 shrink-0 rounded-full transition-colors",
                  accepting ? "bg-mint" : "bg-[#ccd6e9]",
                )}
              >
                <span
                  className={cx(
                    "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
                    accepting ? "translate-x-5.5" : "translate-x-0.5",
                  )}
                />
              </button>
            </label>

            <div className="mt-5 border-t hairline pt-5">
              <SelectField
                label="Consultation duration"
                value={duration}
                onChange={(e) => {
                  setDuration(e.target.value);
                  toast("success", "Duration updated", `${e.target.value} minutes per consultation`);
                }}
              >
                <option value="15">15 minutes</option>
                <option value="20">20 minutes</option>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
              </SelectField>
            </div>
          </Card>

          <Card>
            <CardTitle>Working days</CardTitle>
            <div className="flex flex-wrap gap-1.5">
              {DAYS.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  aria-pressed={workingDays.has(day)}
                  className={cx(
                    "rounded-chip px-3 py-2 text-xs font-semibold transition-colors",
                    workingDays.has(day)
                      ? "bg-electric text-white"
                      : "bg-ice text-ink-faint hover:bg-ice-deep",
                  )}
                >
                  {day}
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs text-ink-faint">
              Tap a day to add or remove it from your working week.
            </p>
          </Card>

          <Card>
            <CardTitle>This week at a glance</CardTitle>
            <dl className="space-y-3">
              <Figure icon={<Check size={15} />} tone="mint" label="Open slots" value={Math.max(0, openCount)} />
              <Figure icon={<Clock size={15} />} tone="electric" label="Booked" value={bookedCount} />
              <Figure icon={<Ban size={15} />} tone="neutral" label="Blocked" value={blockedCount} />
            </dl>

            <Button
              variant="secondary"
              size="sm"
              className="mt-5 w-full"
              onClick={() =>
                toast("info", "Tap any green slot in the grid", "That blocks it out for the week.")
              }
            >
              <Plus size={14} />
              Block a time
            </Button>
          </Card>

          <Card>
            <CardTitle>Today&rsquo;s bookings</CardTitle>
            <ul className="space-y-2.5">
              {clinic.slice(0, 4).map((appointment) => (
                <li key={appointment.id} className="flex items-center gap-3 text-sm">
                  <span className="w-16 shrink-0 font-semibold text-ink tnum">{appointment.time}</span>
                  <span className="min-w-0 flex-1 truncate text-ink-soft">
                    {patientById[appointment.patientId]?.name}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Key({ tone, label, textLight }: { tone: string; label: string; textLight?: boolean }) {
  return (
    <li className="flex items-center gap-1.5">
      <span className={cx("h-3 w-3 rounded-sm", tone, textLight && "border border-white")} />
      {label}
    </li>
  );
}

function Figure({
  icon,
  tone,
  label,
  value,
}: {
  icon: React.ReactNode;
  tone: "mint" | "electric" | "neutral";
  label: string;
  value: number;
}) {
  const tint = {
    mint: "bg-[color-mix(in_oklab,var(--color-mint)_14%,white)] text-mint",
    electric: "bg-[color-mix(in_oklab,var(--color-electric)_12%,white)] text-electric",
    neutral: "bg-ice text-ink-soft",
  }[tone];

  return (
    <div className="flex items-center gap-3">
      <span className={cx("grid h-8 w-8 shrink-0 place-items-center rounded-lg", tint)}>{icon}</span>
      <dt className="min-w-0 flex-1 text-sm text-ink-soft">{label}</dt>
      <dd className="font-display text-lg font-bold text-ink tnum">{value}</dd>
    </div>
  );
}
