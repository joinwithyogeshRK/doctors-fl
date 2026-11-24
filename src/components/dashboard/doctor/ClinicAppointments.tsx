"use client";

import { useState } from "react";
import { Check, Clock, Video, X } from "lucide-react";
import { patientById } from "@/data/patients";
import { allSlots } from "@/data/appointments";
import { consultationLabel, cx, formatFee } from "@/lib/format";
import { formatLongDate } from "@/hooks/useToday";
import { setClinicStatus, useClinicAppointments } from "@/store/appointments";
import { Card, EmptyState, PageHeader, StatusPill } from "@/components/ui/Surfaces";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { SlotGrid } from "@/components/ui/Calendar";
import { useToast } from "@/components/providers/ToastProvider";
import type { Appointment } from "@/types";

const filters = ["all", "pending", "upcoming", "completed", "cancelled"] as const;

export function ClinicAppointments() {
  const clinic = useClinicAppointments();
  const { toast } = useToast();
  const [filter, setFilter] = useState<(typeof filters)[number]>("all");
  const [rescheduling, setRescheduling] = useState<Appointment | null>(null);
  const [newSlot, setNewSlot] = useState<string | null>(null);

  const visible = filter === "all" ? clinic : clinic.filter((a) => a.status === filter);

  const act = (appointment: Appointment, status: Appointment["status"], message: string) => {
    setClinicStatus(appointment.id, status);
    toast("success", message, patientById[appointment.patientId]?.name);
  };

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Appointments"
        lede="Accept, reschedule or complete the day's bookings."
        action={<ButtonLink href="/doctor/schedule" variant="secondary">Manage schedule</ButtonLink>}
      />

      <div className="mt-7 flex flex-wrap gap-1.5">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className={cx(
              "rounded-chip px-3.5 py-2 text-xs font-semibold capitalize transition-colors",
              filter === f ? "bg-electric text-white" : "bg-white text-ink-soft hover:bg-ice",
            )}
          >
            {f}
            <span className={cx("ml-1.5 tnum", filter === f ? "text-white/70" : "text-ink-faint")}>
              {f === "all" ? clinic.length : clinic.filter((a) => a.status === f).length}
            </span>
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="mt-6">
          <EmptyState icon={<Clock size={22} />} title={`No ${filter} appointments`} body="Nothing in this list right now." />
        </div>
      ) : (
        <Card className="mt-5 overflow-hidden" padded={false}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[52rem] text-sm">
              <thead>
                <tr className="border-b hairline bg-mist text-left text-xs text-ink-faint">
                  <th scope="col" className="px-5 py-3 font-semibold">Time</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Patient</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Reason</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Type</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Status</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Payment</th>
                  <th scope="col" className="px-5 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[color-mix(in_oklab,var(--color-ink)_7%,transparent)]">
                {visible.map((appointment) => {
                  const patient = patientById[appointment.patientId];
                  return (
                    <tr key={appointment.id} className="transition-colors hover:bg-mist">
                      <td className="px-5 py-4 font-semibold text-ink tnum whitespace-nowrap">
                        {appointment.time}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[linear-gradient(140deg,var(--color-electric),var(--color-violet))] text-[0.625rem] font-bold text-white">
                            {patient?.name.split(" ").map((p) => p[0]).join("")}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate font-medium text-ink">{patient?.name}</p>
                            <p className="text-xs text-ink-faint">
                              {patient?.age}, {patient?.gender}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="max-w-48 px-5 py-4 text-ink-soft">
                        <span className="line-clamp-2">{appointment.reason}</span>
                      </td>
                      <td className="px-5 py-4 text-ink-soft whitespace-nowrap">
                        {consultationLabel[appointment.type]}
                      </td>
                      <td className="px-5 py-4">
                        <StatusPill status={appointment.status} />
                      </td>
                      <td className="px-5 py-4">
                        <StatusPill status={appointment.paid ? "paid" : "unpaid"}>
                          {appointment.paid ? formatFee(appointment.fee) : "At clinic"}
                        </StatusPill>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-1.5">
                          {appointment.status === "pending" && (
                            <>
                              <button
                                type="button"
                                onClick={() => act(appointment, "upcoming", "Appointment accepted")}
                                aria-label={`Accept ${patient?.name}`}
                                className="grid h-8 w-8 place-items-center rounded-lg bg-[color-mix(in_oklab,var(--color-mint)_14%,white)] text-mint transition-colors hover:bg-mint hover:text-white"
                              >
                                <Check size={15} />
                              </button>
                              <button
                                type="button"
                                onClick={() => act(appointment, "cancelled", "Appointment declined")}
                                aria-label={`Decline ${patient?.name}`}
                                className="grid h-8 w-8 place-items-center rounded-lg bg-[color-mix(in_oklab,var(--color-coral)_12%,white)] text-coral transition-colors hover:bg-coral hover:text-white"
                              >
                                <X size={15} />
                              </button>
                            </>
                          )}
                          {appointment.status === "upcoming" && (
                            <>
                              {appointment.type === "video" && (
                                <ButtonLink href={`/consultation/${appointment.id}`} size="sm">
                                  <Video size={13} />
                                  Start
                                </ButtonLink>
                              )}
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => act(appointment, "completed", "Marked completed")}
                              >
                                Complete
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setRescheduling(appointment);
                                  setNewSlot(null);
                                }}
                              >
                                Move
                              </Button>
                            </>
                          )}
                          {appointment.status === "completed" && (
                            <ButtonLink href="/doctor/prescriptions" variant="secondary" size="sm">
                              Prescribe
                            </ButtonLink>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Dialog
        open={Boolean(rescheduling)}
        onClose={() => setRescheduling(null)}
        title="Move this appointment"
        description={
          rescheduling
            ? `${patientById[rescheduling.patientId]?.name} · ${formatLongDate(rescheduling.date)}`
            : undefined
        }
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setRescheduling(null)}>
              Cancel
            </Button>
            <Button
              disabled={!newSlot}
              onClick={() => {
                if (!rescheduling || !newSlot) return;
                setClinicStatus(rescheduling.id, "upcoming");
                toast("success", "Appointment moved", `Now at ${newSlot}. The patient has been notified.`);
                setRescheduling(null);
              }}
            >
              Confirm move
            </Button>
          </div>
        }
      >
        <p className="mb-4 text-sm text-ink-soft">Pick a new time from today&rsquo;s open slots.</p>
        <SlotGrid
          slots={allSlots}
          booked={clinic.map((a) => a.time)}
          value={newSlot}
          onChange={setNewSlot}
        />
      </Dialog>
    </div>
  );
}
