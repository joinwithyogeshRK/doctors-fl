"use client";

import { useState } from "react";
import { AlertTriangle, Mail, Phone, Pill, Search, UserRound } from "lucide-react";
import { patients } from "@/data/patients";
import { prescriptions } from "@/data/clinical";
import { cx } from "@/lib/format";
import { useClinicAppointments } from "@/store/appointments";
import { Card, CardTitle, EmptyState, PageHeader, StatusPill } from "@/components/ui/Surfaces";
import { ButtonLink } from "@/components/ui/Button";
import type { Patient } from "@/types";

export function PatientsView() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Patient>(patients[0]);
  const clinic = useClinicAppointments();

  const filtered = patients.filter((p) =>
    [p.name, p.city, p.email, ...p.conditions].join(" ").toLowerCase().includes(query.toLowerCase()),
  );

  const history = clinic.filter((a) => a.patientId === selected.id);
  const patientRx = prescriptions.filter((rx) => rx.patientId === selected.id);

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Patients" lede="Contact details, history and prescriptions for everyone under your care." />

      <div className="mt-7 grid gap-5 lg:grid-cols-[20rem_1fr]">
        {/* List */}
        <div>
          <div className="relative">
            <Search size={16} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-ink-faint" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search patients"
              aria-label="Search patients"
              className="h-11 w-full rounded-full border hairline bg-white pr-4 pl-9 text-sm text-ink placeholder:text-ink-faint focus:border-electric focus:outline-none"
            />
          </div>

          {filtered.length === 0 ? (
            <div className="mt-4">
              <EmptyState icon={<UserRound size={20} />} title="No patients found" body="Try a different name, city or condition." />
            </div>
          ) : (
            <ul className="mt-4 space-y-2">
              {filtered.map((patient) => (
                <li key={patient.id}>
                  <button
                    type="button"
                    onClick={() => setSelected(patient)}
                    aria-pressed={selected.id === patient.id}
                    className={cx(
                      "flex w-full items-center gap-3 rounded-card border p-3.5 text-left transition-all",
                      selected.id === patient.id
                        ? "border-electric bg-[color-mix(in_oklab,var(--color-electric)_6%,white)]"
                        : "hairline bg-white hover:border-electric/40",
                    )}
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[linear-gradient(140deg,var(--color-electric),var(--color-violet))] text-xs font-bold text-white">
                      {patient.name.split(" ").map((p) => p[0]).join("")}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold text-ink">{patient.name}</span>
                      <span className="block truncate text-xs text-ink-faint">
                        {patient.age}, {patient.gender} · {patient.city}
                      </span>
                    </span>
                    {patient.allergies.length > 0 && (
                      <AlertTriangle size={14} className="shrink-0 text-coral" aria-label="Has allergies" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Detail */}
        <div className="space-y-5">
          <Card>
            <div className="flex flex-wrap items-start gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[linear-gradient(140deg,var(--color-electric),var(--color-violet))] text-base font-bold text-white">
                {selected.name.split(" ").map((p) => p[0]).join("")}
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="font-display text-xl font-bold text-ink">{selected.name}</h2>
                <p className="mt-0.5 text-sm text-ink-soft">
                  {selected.age} years · {selected.gender} · Blood group {selected.bloodGroup}
                </p>
                <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink-soft">
                  <li className="flex items-center gap-1.5">
                    <Phone size={14} className="text-ink-faint" />
                    {selected.phone}
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Mail size={14} className="text-ink-faint" />
                    {selected.email}
                  </li>
                </ul>
              </div>
              <div className="text-right">
                <p className="text-xs text-ink-faint">Last visit</p>
                <p className="font-semibold text-ink">{selected.lastVisit}</p>
              </div>
            </div>
          </Card>

          <div className="grid gap-5 sm:grid-cols-2">
            <Card>
              <CardTitle>Allergies</CardTitle>
              {selected.allergies.length === 0 ? (
                <p className="text-sm text-ink-soft">No known allergies recorded.</p>
              ) : (
                <ul className="flex flex-wrap gap-1.5">
                  {selected.allergies.map((allergy) => (
                    <li
                      key={allergy}
                      className="inline-flex items-center gap-1.5 rounded-chip bg-[color-mix(in_oklab,var(--color-coral)_10%,white)] px-3 py-1.5 text-sm font-semibold text-coral"
                    >
                      <AlertTriangle size={13} />
                      {allergy}
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            <Card>
              <CardTitle>Conditions</CardTitle>
              {selected.conditions.length === 0 ? (
                <p className="text-sm text-ink-soft">No ongoing conditions recorded.</p>
              ) : (
                <ul className="flex flex-wrap gap-1.5">
                  {selected.conditions.map((condition) => (
                    <li key={condition} className="rounded-chip bg-ice px-3 py-1.5 text-sm font-medium text-ink-soft">
                      {condition}
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>

          <Card>
            <CardTitle>Current medication</CardTitle>
            {selected.medications.length === 0 ? (
              <p className="text-sm text-ink-soft">Not on any regular medication.</p>
            ) : (
              <ul className="space-y-2.5">
                {selected.medications.map((medication) => (
                  <li key={medication} className="flex items-center gap-2.5 text-sm text-ink-soft">
                    <Pill size={14} className="shrink-0 text-mint" />
                    {medication}
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card>
            <CardTitle
              action={
                <ButtonLink href="/doctor/prescriptions" variant="secondary" size="sm">
                  New prescription
                </ButtonLink>
              }
            >
              Appointment history
            </CardTitle>
            {history.length === 0 ? (
              <p className="text-sm text-ink-soft">No appointments with you yet.</p>
            ) : (
              <ul className="divide-y divide-[color-mix(in_oklab,var(--color-ink)_7%,transparent)]">
                {history.map((appointment) => (
                  <li key={appointment.id} className="flex flex-wrap items-center gap-3 py-3 first:pt-0 last:pb-0">
                    <span className="text-sm font-semibold text-ink tnum">{appointment.time}</span>
                    <span className="min-w-0 flex-1 truncate text-sm text-ink-soft">{appointment.reason}</span>
                    <StatusPill status={appointment.status} />
                  </li>
                ))}
              </ul>
            )}
          </Card>

          {patientRx.length > 0 && (
            <Card>
              <CardTitle>Prescriptions issued</CardTitle>
              <ul className="space-y-3">
                {patientRx.map((rx) => (
                  <li key={rx.id} className="rounded-card border hairline p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-semibold text-ink">{rx.diagnosis}</p>
                      <span className="text-xs text-ink-faint tnum">{rx.id} · {rx.issuedOn}</span>
                    </div>
                    <ul className="mt-2.5 space-y-1">
                      {rx.items.map((item) => (
                        <li key={item.id} className="text-sm text-ink-soft">
                          {item.medicine} {item.strength} · {item.frequency} · {item.duration}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          <Card>
            <CardTitle>Emergency contact</CardTitle>
            <p className="text-sm text-ink-soft">
              <span className="font-medium text-ink">{selected.emergencyContact.name}</span> ·{" "}
              {selected.emergencyContact.relation} · {selected.emergencyContact.phone}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
