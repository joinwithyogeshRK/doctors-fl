"use client";

import Link from "next/link";
import { useState } from "react";
import { CalendarDays, CalendarX, Clock, MapPin, Video, X } from "lucide-react";
import { doctorBySlug } from "@/data/doctors";
import { allSlots } from "@/data/appointments";
import { consultationLabel, cx, formatFee } from "@/lib/format";
import { formatLongDate } from "@/hooks/useToday";
import {
  rescheduleAppointment,
  setAppointmentStatus,
  usePatientAppointments,
} from "@/store/appointments";
import { Card, EmptyState, PageHeader, StatusPill } from "@/components/ui/Surfaces";
import { Button, ButtonLink } from "@/components/ui/Button";
import { DoctorAvatar } from "@/components/ui/DoctorAvatar";
import { Dialog } from "@/components/ui/Dialog";
import { Calendar, SlotGrid } from "@/components/ui/Calendar";
import { useToast } from "@/components/providers/ToastProvider";
import type { Appointment } from "@/types";

const tabs = [
  { id: "upcoming", label: "Upcoming" },
  { id: "pending", label: "Pending" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
] as const;

export function AppointmentsView() {
  const appointments = usePatientAppointments();
  const { toast } = useToast();
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("upcoming");
  const [rescheduling, setRescheduling] = useState<Appointment | null>(null);
  const [cancelling, setCancelling] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState<string | null>(null);
  const [newTime, setNewTime] = useState<string | null>(null);

  const visible = appointments.filter((a) => a.status === tab);

  const counts = Object.fromEntries(
    tabs.map((t) => [t.id, appointments.filter((a) => a.status === t.id).length]),
  );

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="My appointments"
        lede="Everything booked, completed and cancelled, with the actions you need on each."
        action={<ButtonLink href="/appointments/book">Book an appointment</ButtonLink>}
      />

      <div className="no-scrollbar mt-7 flex gap-1 overflow-x-auto border-b hairline">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            aria-current={tab === t.id ? "page" : undefined}
            className={cx(
              "relative shrink-0 px-4 py-3 text-sm font-semibold transition-colors",
              tab === t.id ? "text-electric" : "text-ink-soft hover:text-ink",
            )}
          >
            {t.label}
            <span className="ml-1.5 text-xs text-ink-faint tnum">({counts[t.id] ?? 0})</span>
            {tab === t.id && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-electric" />}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {visible.length === 0 ? (
          <EmptyState
            icon={<CalendarX size={22} />}
            title={`No ${tab} appointments`}
            body={
              tab === "upcoming"
                ? "Book a consultation and it will appear here with a reminder and a join link."
                : `Nothing in your ${tab} list right now.`
            }
            action={tab === "upcoming" ? <ButtonLink href="/appointments/book">Book now</ButtonLink> : undefined}
          />
        ) : (
          visible.map((appointment) => {
            const doctor = doctorBySlug[appointment.doctorSlug];
            if (!doctor) return null;
            return (
              <Card key={appointment.id}>
                <div className="flex flex-wrap items-start gap-4">
                  <DoctorAvatar doctor={doctor} size={56} rounded="card" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/doctors/${doctor.slug}`}
                        className="font-semibold text-ink hover:text-electric hover:underline"
                      >
                        {doctor.name}
                      </Link>
                      <StatusPill status={appointment.status} />
                      <StatusPill status={appointment.paid ? "paid" : "unpaid"}>
                        {appointment.paid ? "Paid" : "Pay at clinic"}
                      </StatusPill>
                    </div>
                    <p className="mt-0.5 text-sm text-electric">{doctor.specialty}</p>

                    <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink-soft">
                      <li className="flex items-center gap-1.5">
                        <CalendarDays size={14} className="text-ink-faint" />
                        {formatLongDate(appointment.date)}
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Clock size={14} className="text-ink-faint" />
                        {appointment.time}
                      </li>
                      <li className="flex items-center gap-1.5">
                        {appointment.type === "video" ? (
                          <Video size={14} className="text-ink-faint" />
                        ) : (
                          <MapPin size={14} className="text-ink-faint" />
                        )}
                        {consultationLabel[appointment.type]}
                        {appointment.type === "in-clinic" && ` · ${doctor.hospital}`}
                      </li>
                    </ul>

                    <p className="mt-3 rounded-xl bg-mist px-3.5 py-2.5 text-sm text-ink-soft">
                      <span className="font-medium text-ink">Reason:</span> {appointment.reason}
                    </p>

                    {appointment.notes && (
                      <p className="mt-2 rounded-xl bg-[color-mix(in_oklab,var(--color-mint)_8%,white)] px-3.5 py-2.5 text-sm text-ink-soft">
                        <span className="font-medium text-ink">Doctor&rsquo;s notes:</span>{" "}
                        {appointment.notes}
                      </p>
                    )}
                  </div>

                  <div className="w-full shrink-0 text-right sm:w-auto">
                    <p className="font-display text-xl font-bold text-ink">
                      {formatFee(appointment.fee)}
                    </p>
                    <p className="text-xs text-ink-faint tnum">{appointment.id}</p>
                  </div>
                </div>

                {(appointment.status === "upcoming" || appointment.status === "pending") && (
                  <div className="mt-5 flex flex-wrap gap-2 border-t hairline pt-5">
                    {appointment.type === "video" && (
                      <ButtonLink href={`/consultation/${appointment.id}`} size="sm">
                        <Video size={14} />
                        Join consultation
                      </ButtonLink>
                    )}
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setRescheduling(appointment);
                        setNewDate(null);
                        setNewTime(null);
                      }}
                    >
                      Reschedule
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => setCancelling(appointment)}>
                      <X size={14} />
                      Cancel
                    </Button>
                    <ButtonLink href={`/doctors/${doctor.slug}`} variant="ghost" size="sm">
                      View doctor
                    </ButtonLink>
                  </div>
                )}

                {appointment.status === "completed" && (
                  <div className="mt-5 flex flex-wrap gap-2 border-t hairline pt-5">
                    <ButtonLink href="/patient/prescriptions" variant="secondary" size="sm">
                      View prescription
                    </ButtonLink>
                    <ButtonLink
                      href={`/appointments/book?doctor=${doctor.slug}`}
                      variant="secondary"
                      size="sm"
                    >
                      Book a follow-up
                    </ButtonLink>
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>

      {/* Reschedule */}
      <Dialog
        open={Boolean(rescheduling)}
        onClose={() => setRescheduling(null)}
        title="Reschedule appointment"
        description={rescheduling ? `${doctorBySlug[rescheduling.doctorSlug]?.name}` : undefined}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setRescheduling(null)}>
              Keep original
            </Button>
            <Button
              disabled={!newDate || !newTime}
              onClick={() => {
                if (!rescheduling || !newDate || !newTime) return;
                rescheduleAppointment(rescheduling.id, newDate, newTime);
                toast("success", "Appointment moved", `${formatLongDate(newDate)} at ${newTime}`);
                setRescheduling(null);
              }}
            >
              Confirm new time
            </Button>
          </div>
        }
      >
        <Calendar
          value={newDate}
          onChange={(iso) => {
            setNewDate(iso);
            setNewTime(null);
          }}
          slotsOn={(iso) => (new Date(`${iso}T00:00:00Z`).getUTCDay() === 0 ? 0 : 5)}
        />
        {newDate && (
          <div className="mt-6 border-t hairline pt-6">
            <p className="mb-3 text-xs font-semibold text-ink-soft">
              Slots on {formatLongDate(newDate)}
            </p>
            <SlotGrid slots={allSlots.slice(0, 6)} booked={[]} value={newTime} onChange={setNewTime} />
          </div>
        )}
      </Dialog>

      {/* Cancel */}
      <Dialog
        open={Boolean(cancelling)}
        onClose={() => setCancelling(null)}
        title="Cancel this appointment?"
        size="sm"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setCancelling(null)}>
              Keep it
            </Button>
            <Button
              onClick={() => {
                if (!cancelling) return;
                setAppointmentStatus(cancelling.id, "cancelled");
                toast("info", "Appointment cancelled", "Any fee paid is refunded within 5 working days.");
                setCancelling(null);
              }}
            >
              Yes, cancel
            </Button>
          </div>
        }
      >
        <p className="text-sm leading-relaxed text-ink-soft">
          {cancelling && (
            <>
              Your appointment with{" "}
              <span className="font-medium text-ink">
                {doctorBySlug[cancelling.doctorSlug]?.name}
              </span>{" "}
              on {formatLongDate(cancelling.date)} at {cancelling.time} will be released.
            </>
          )}
        </p>
        <p className="mt-4 rounded-xl bg-mist px-4 py-3 text-xs leading-relaxed text-ink-soft">
          Cancellations more than four hours ahead are free. Within four hours the fee is held as
          credit for 30 days.
        </p>
      </Dialog>
    </div>
  );
}
