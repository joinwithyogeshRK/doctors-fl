"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  Clock,
  IndianRupee,
  Smile,
  Users,
  Video,
} from "lucide-react";
import { featuredDoctor } from "@/data/doctors";
import { patientById } from "@/data/patients";
import { doctorWeek } from "@/data/analytics";
import { consultationLabel, formatFee } from "@/lib/format";
import { useGreeting } from "@/hooks/useToday";
import { useClinicAppointments } from "@/store/appointments";
import { Card, CardTitle, StatTile, StatusPill } from "@/components/ui/Surfaces";
import { Button, ButtonLink } from "@/components/ui/Button";
import { GroupedBars } from "@/components/charts/Charts";
import { EcgLine } from "@/components/animations/EcgLine";

export function DoctorOverview() {
  const greeting = useGreeting();
  const clinic = useClinicAppointments();

  const completed = clinic.filter((a) => a.status === "completed");
  const pending = clinic.filter((a) => a.status === "pending");
  const upcoming = clinic.filter((a) => a.status === "upcoming");
  const revenue = completed.reduce((sum, a) => sum + a.fee, 0);
  const lastName = featuredDoctor.name.replace(/^Dr\.?\s+/i, "").split(" ").pop();

  return (
    <div className="mx-auto max-w-7xl">
      <section className="relative overflow-hidden rounded-panel bg-[linear-gradient(118deg,#0d1b45,#23215f_55%,#3b2064)] px-6 py-8 text-white sm:px-9 sm:py-10">
        <span className="pointer-events-none absolute -top-20 -right-16 h-64 w-64 rounded-full bg-violet/35 blur-3xl" />
        <EcgLine
          className="pointer-events-none absolute inset-x-0 bottom-0 h-20 w-full opacity-25"
          stroke="var(--color-electric-light)"
          speed={5}
        />
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div>
            <h1 className="font-display text-[clamp(1.5rem,3.4vw,2.125rem)] font-bold">
              {greeting}, Dr. {lastName}.
            </h1>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-white/65">
              You have {upcoming.length} appointments left today and {pending.length} waiting for
              your decision.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <ButtonLink href="/doctor/appointments" size="sm">
              Today&rsquo;s clinic
            </ButtonLink>
            <ButtonLink href="/doctor/prescriptions" variant="onDark" size="sm">
              Write a prescription
            </ButtonLink>
          </div>
        </div>
      </section>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <StatTile label="Today's appointments" value={clinic.length} detail={`${upcoming.length} still to see`} icon={<CalendarCheck size={19} />} tone="electric" />
        <StatTile label="Total patients" value="1,284" detail="Across all clinics" icon={<Users size={19} />} tone="violet" />
        <StatTile label="Completed today" value={completed.length} detail="Notes filed" icon={<CheckCircle2 size={19} />} tone="mint" />
        <StatTile label="Pending approval" value={pending.length} detail="Awaiting your decision" icon={<Clock size={19} />} tone="amber" />
        <StatTile label="Revenue today" value={formatFee(revenue)} detail="Consultations settled" icon={<IndianRupee size={19} />} tone="electric" />
        <StatTile label="Patient satisfaction" value="4.9/5" detail="412 reviews" icon={<Smile size={19} />} tone="mint" />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <Card>
          <CardTitle
            action={
              <Link href="/doctor/appointments" className="inline-flex items-center gap-1 text-sm font-semibold text-electric hover:underline">
                Manage
                <ArrowRight size={14} />
              </Link>
            }
          >
            Today&rsquo;s clinic
          </CardTitle>

          <ul className="divide-y divide-[color-mix(in_oklab,var(--color-ink)_7%,transparent)]">
            {clinic.map((appointment) => {
              const patient = patientById[appointment.patientId];
              return (
                <li key={appointment.id} className="flex flex-wrap items-center gap-4 py-3.5 first:pt-0 last:pb-0">
                  <span className="w-20 shrink-0 text-sm font-semibold text-ink tnum">
                    {appointment.time}
                  </span>
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[linear-gradient(140deg,var(--color-electric),var(--color-violet))] text-xs font-bold text-white">
                    {patient?.name.split(" ").map((p) => p[0]).join("")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-ink">{patient?.name}</p>
                    <p className="truncate text-xs text-ink-faint">
                      {patient?.age}, {patient?.gender} · {appointment.reason}
                    </p>
                  </div>
                  <span className="hidden text-xs text-ink-soft sm:block">
                    {consultationLabel[appointment.type]}
                  </span>
                  <StatusPill status={appointment.status} />
                  {appointment.status === "upcoming" && appointment.type === "video" && (
                    <ButtonLink href={`/consultation/${appointment.id}`} size="sm">
                      <Video size={13} />
                      Start
                    </ButtonLink>
                  )}
                </li>
              );
            })}
          </ul>
        </Card>

        <Card>
          <GroupedBars
            title="This week's load"
            caption="Booked slots against capacity"
            data={doctorWeek as unknown as Record<string, string | number>[]}
            series={[
              { key: "booked", label: "Booked" },
              { key: "capacity", label: "Capacity" },
            ]}
          />
        </Card>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Card>
          <CardTitle>Waiting for your decision</CardTitle>
          {pending.length === 0 ? (
            <p className="text-sm text-ink-soft">Nothing pending. Your list is clear.</p>
          ) : (
            <ul className="space-y-3">
              {pending.map((appointment) => {
                const patient = patientById[appointment.patientId];
                return (
                  <li key={appointment.id} className="rounded-card border hairline p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-semibold text-ink">{patient?.name}</p>
                      <span className="text-xs text-ink-faint tnum">{appointment.time}</span>
                    </div>
                    <p className="mt-1 text-sm text-ink-soft">{appointment.reason}</p>
                    <div className="mt-3 flex gap-2">
                      <ButtonLink href="/doctor/appointments" size="sm">
                        Review request
                      </ButtonLink>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        <Card>
          <CardTitle
            action={
              <Link href="/doctor/schedule" className="text-sm font-semibold text-electric hover:underline">
                Edit schedule
              </Link>
            }
          >
            Quick actions
          </CardTitle>
          <div className="grid gap-2 sm:grid-cols-2">
            <QuickAction href="/doctor/prescriptions" label="Write a prescription" />
            <QuickAction href="/doctor/patients" label="Look up a patient" />
            <QuickAction href="/doctor/schedule" label="Block a time slot" />
            <QuickAction href="/doctor/analytics" label="See this month's figures" />
          </div>
          <div className="mt-5 rounded-card bg-mist p-4">
            <p className="text-xs font-semibold text-ink-soft">Availability</p>
            <p className="mt-1.5 text-sm text-ink">
              Mon–Fri 9:00 AM – 7:00 PM · Sat 9:00 AM – 2:00 PM
            </p>
            <Button variant="secondary" size="sm" className="mt-3" disabled>
              Currently accepting bookings
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function QuickAction({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between gap-2 rounded-card border hairline p-4 text-sm font-medium text-ink transition-all hover:-translate-y-0.5 hover:border-electric/40 hover:shadow-soft"
    >
      {label}
      <ArrowRight size={15} className="shrink-0 text-ink-faint transition-transform group-hover:translate-x-0.5 group-hover:text-electric" />
    </Link>
  );
}
