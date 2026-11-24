"use client";

import { Clock, FileText, Video } from "lucide-react";
import { patientById } from "@/data/patients";
import { consultationLabel } from "@/lib/format";
import { useClinicAppointments } from "@/store/appointments";
import { Card, CardTitle, EmptyState, PageHeader, StatTile, StatusPill } from "@/components/ui/Surfaces";
import { ButtonLink } from "@/components/ui/Button";

export function ConsultationsView() {
  const clinic = useClinicAppointments();
  const live = clinic.filter((a) => a.status === "upcoming" && a.type === "video");
  const done = clinic.filter((a) => a.status === "completed");

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Consultations"
        lede="Video rooms waiting to open, and the notes from the ones you've finished."
      />

      <div className="mt-7 grid gap-4 sm:grid-cols-3">
        <StatTile label="Video rooms open" value={live.length} icon={<Video size={19} />} tone="electric" />
        <StatTile label="Completed today" value={done.length} icon={<FileText size={19} />} tone="mint" />
        <StatTile label="Average length" value="18 min" detail="Across this week" icon={<Clock size={19} />} tone="violet" />
      </div>

      <Card className="mt-5">
        <CardTitle>Ready to start</CardTitle>
        {live.length === 0 ? (
          <EmptyState
            icon={<Video size={22} />}
            title="No video consultations waiting"
            body="When a patient joins a video appointment, the room appears here."
          />
        ) : (
          <ul className="space-y-3">
            {live.map((appointment) => {
              const patient = patientById[appointment.patientId];
              return (
                <li key={appointment.id} className="flex flex-wrap items-center gap-4 rounded-card border hairline p-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[linear-gradient(140deg,var(--color-electric),var(--color-violet))] text-xs font-bold text-white">
                    {patient?.name.split(" ").map((p) => p[0]).join("")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-ink">{patient?.name}</p>
                    <p className="truncate text-xs text-ink-faint">
                      {appointment.time} · {consultationLabel[appointment.type]} · {appointment.reason}
                    </p>
                  </div>
                  <ButtonLink href={`/consultation/${appointment.id}`} size="sm">
                    <Video size={14} />
                    Start room
                  </ButtonLink>
                </li>
              );
            })}
          </ul>
        )}
      </Card>

      <Card className="mt-5">
        <CardTitle>Completed consultations</CardTitle>
        {done.length === 0 ? (
          <p className="text-sm text-ink-soft">Nothing completed yet today.</p>
        ) : (
          <ul className="divide-y divide-[color-mix(in_oklab,var(--color-ink)_7%,transparent)]">
            {done.map((appointment) => {
              const patient = patientById[appointment.patientId];
              return (
                <li key={appointment.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-ink">{patient?.name}</p>
                      <p className="text-xs text-ink-faint">
                        {appointment.time} · {consultationLabel[appointment.type]}
                      </p>
                    </div>
                    <StatusPill status="completed" />
                  </div>
                  {appointment.notes && (
                    <p className="mt-3 rounded-xl bg-mist px-4 py-3 text-sm leading-relaxed text-ink-soft">
                      {appointment.notes}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}
