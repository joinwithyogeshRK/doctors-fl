"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Droplets,
  HeartPulse,
  Package,
  Pill,
  Scale,
  Video,
} from "lucide-react";
import { doctorBySlug } from "@/data/doctors";
import { currentPatient } from "@/data/patients";
import { prescriptions } from "@/data/clinical";
import { consultationLabel, formatFee } from "@/lib/format";
import { formatLongDate, useGreeting } from "@/hooks/useToday";
import { usePatientAppointments } from "@/store/appointments";
import { useOrders } from "@/store/orders";
import { Card, CardTitle, EmptyState, StatTile, StatusPill } from "@/components/ui/Surfaces";
import { ButtonLink } from "@/components/ui/Button";
import { DoctorAvatar } from "@/components/ui/DoctorAvatar";
import { EcgLine } from "@/components/animations/EcgLine";

export function PatientOverview() {
  const greeting = useGreeting();
  const appointments = usePatientAppointments();
  const orders = useOrders();

  const upcoming = appointments.filter((a) => a.status === "upcoming" || a.status === "pending");
  const activeRx = prescriptions.filter((p) => p.active);
  const firstName = currentPatient.name.split(" ")[0];

  return (
    <div className="mx-auto max-w-7xl">
      {/* Greeting */}
      <section className="relative overflow-hidden rounded-panel bg-[linear-gradient(118deg,#0d1b45,#23215f_55%,#3b2064)] px-6 py-8 text-white sm:px-9 sm:py-10">
        <span className="pointer-events-none absolute -top-20 -left-16 h-64 w-64 rounded-full bg-electric/35 blur-3xl" />
        <EcgLine
          className="pointer-events-none absolute inset-x-0 bottom-0 h-20 w-full opacity-25"
          stroke="var(--color-electric-light)"
          speed={5}
        />
        <div className="relative">
          <h1 className="font-display text-[clamp(1.5rem,3.4vw,2.125rem)] font-bold">
            {greeting}, {firstName} 👋
          </h1>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-white/65">
            Here&rsquo;s your health overview for today. You have {upcoming.length} upcoming{" "}
            {upcoming.length === 1 ? "appointment" : "appointments"} and {activeRx.length} active{" "}
            {activeRx.length === 1 ? "prescription" : "prescriptions"}.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <ButtonLink href="/appointments/book" size="sm">
              Book an appointment
            </ButtonLink>
            <ButtonLink href="/pharmacy" variant="onDark" size="sm">
              Order medicines
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Key figures */}
      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="Upcoming appointments"
          value={upcoming.length}
          detail={upcoming[0] ? `Next on ${formatLongDate(upcoming[0].date)}` : "Nothing booked"}
          icon={<CalendarDays size={19} />}
          tone="electric"
        />
        <StatTile
          label="Active prescriptions"
          value={activeRx.length}
          detail="Repeat available online"
          icon={<Pill size={19} />}
          tone="mint"
        />
        <StatTile
          label="Medicine orders"
          value={orders.length}
          detail={orders[0] ? `Latest ${orders[0].id}` : "No orders yet"}
          icon={<Package size={19} />}
          tone="violet"
        />
        <StatTile
          label="Health score"
          value="86/100"
          detail="Up 4 points since September"
          icon={<HeartPulse size={19} />}
          tone="amber"
        />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.6fr_1fr]">
        {/* Appointments */}
        <Card>
          <CardTitle
            action={
              <Link
                href="/patient/appointments"
                className="inline-flex items-center gap-1 text-sm font-semibold text-electric hover:underline"
              >
                View all
                <ArrowRight size={14} />
              </Link>
            }
          >
            Upcoming appointments
          </CardTitle>

          {upcoming.length === 0 ? (
            <EmptyState
              icon={<CalendarDays size={22} />}
              title="Nothing booked yet"
              body="When you book a consultation it will show up here with a reminder."
              action={<ButtonLink href="/appointments/book">Book an appointment</ButtonLink>}
            />
          ) : (
            <ul className="space-y-3">
              {upcoming.slice(0, 3).map((appointment) => {
                const doctor = doctorBySlug[appointment.doctorSlug];
                if (!doctor) return null;
                return (
                  <li
                    key={appointment.id}
                    className="flex flex-wrap items-center gap-4 rounded-card border hairline p-4 transition-colors hover:bg-mist"
                  >
                    <DoctorAvatar doctor={doctor} size={48} rounded="card" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-ink">{doctor.name}</p>
                      <p className="truncate text-sm text-electric">{doctor.specialty}</p>
                      <p className="mt-1 text-xs text-ink-faint">
                        {formatLongDate(appointment.date)} · {appointment.time} ·{" "}
                        {consultationLabel[appointment.type]}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusPill status={appointment.status} />
                      {appointment.type === "video" && appointment.status === "upcoming" && (
                        <ButtonLink href={`/consultation/${appointment.id}`} size="sm">
                          <Video size={14} />
                          Join
                        </ButtonLink>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        {/* Health summary */}
        <Card>
          <CardTitle
            action={
              <Link
                href="/patient/profile"
                className="text-sm font-semibold text-electric hover:underline"
              >
                Edit
              </Link>
            }
          >
            Health summary
          </CardTitle>

          <dl className="space-y-3.5">
            <Vital icon={<Droplets size={16} />} label="Blood group" value={currentPatient.bloodGroup} />
            <Vital icon={<HeartPulse size={16} />} label="Blood pressure" value="128 / 82 mmHg" />
            <Vital icon={<Scale size={16} />} label="Weight" value="74 kg · BMI 23.4" />
          </dl>

          <div className="mt-5 border-t hairline pt-5">
            <p className="text-xs font-semibold text-ink-soft">Allergies</p>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {currentPatient.allergies.map((allergy) => (
                <li
                  key={allergy}
                  className="rounded-chip bg-[color-mix(in_oklab,var(--color-coral)_10%,white)] px-2.5 py-1 text-xs font-semibold text-coral"
                >
                  {allergy}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-5 border-t hairline pt-5">
            <p className="text-xs font-semibold text-ink-soft">Ongoing conditions</p>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {currentPatient.conditions.map((condition) => (
                <li key={condition} className="rounded-chip bg-ice px-2.5 py-1 text-xs font-semibold text-ink-soft">
                  {condition}
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        {/* Prescriptions */}
        <Card>
          <CardTitle
            action={
              <Link href="/patient/prescriptions" className="text-sm font-semibold text-electric hover:underline">
                View all
              </Link>
            }
          >
            Active prescriptions
          </CardTitle>
          <ul className="space-y-3">
            {activeRx.map((rx) => {
              const doctor = doctorBySlug[rx.doctorSlug];
              return (
                <li key={rx.id} className="rounded-card border hairline p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold text-ink">{rx.diagnosis}</p>
                    <span className="text-xs font-semibold text-ink-faint tnum">{rx.id}</span>
                  </div>
                  <p className="mt-1 text-xs text-ink-faint">
                    {doctor?.name} · issued {rx.issuedOn}
                  </p>
                  <ul className="mt-3 space-y-1.5">
                    {rx.items.map((item) => (
                      <li key={item.id} className="flex items-center gap-2 text-sm text-ink-soft">
                        <Pill size={13} className="shrink-0 text-mint" />
                        {item.medicine} {item.strength} · {item.frequency}
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ul>
        </Card>

        {/* Orders */}
        <Card>
          <CardTitle
            action={
              <Link href="/patient/orders" className="text-sm font-semibold text-electric hover:underline">
                View all
              </Link>
            }
          >
            Recent medicine orders
          </CardTitle>
          <ul className="space-y-3">
            {orders.slice(0, 3).map((order) => (
              <li key={order.id}>
                <Link
                  href={`/orders/${order.id}/tracking`}
                  className="flex flex-wrap items-center gap-3 rounded-card border hairline p-4 transition-colors hover:bg-mist"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[color-mix(in_oklab,var(--color-violet)_12%,white)] text-violet">
                    <Package size={18} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-ink tnum">{order.id}</span>
                    <span className="block truncate text-xs text-ink-faint">
                      {order.items.length} items · {order.placedAt}
                    </span>
                  </span>
                  <span className="text-right">
                    <span className="block font-semibold text-ink tnum">{formatFee(order.total)}</span>
                    <span className="mt-1 block text-[0.6875rem] text-ink-faint capitalize">
                      {order.stage.replace(/-/g, " ")}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

function Vital({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-ice text-ink-soft">{icon}</span>
      <div className="min-w-0 flex-1">
        <dt className="text-xs text-ink-faint">{label}</dt>
        <dd className="font-semibold text-ink">{value}</dd>
      </div>
    </div>
  );
}
