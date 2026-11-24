"use client";

import Link from "next/link";
import { doctors } from "@/data/doctors";
import { formatFee } from "@/lib/format";
import { ManagementTable } from "@/components/dashboard/admin/ManagementTable";
import { DoctorAvatar } from "@/components/ui/DoctorAvatar";
import { Stars } from "@/components/ui/Stars";
import { StatusPill } from "@/components/ui/Surfaces";
import { ButtonLink } from "@/components/ui/Button";

export function AdminDoctors() {
  return (
    <ManagementTable
      title="Doctors"
      lede="Every consultant on the platform, their credentials and current availability."
      action={<ButtonLink href="/for-doctors" variant="secondary">Invite a doctor</ButtonLink>}
      rows={doctors}
      searchKeys={(d) => [d.name, d.specialty, d.hospital, d.location].join(" ")}
      filters={[
        { label: "Available today", test: (d) => d.availableToday },
        { label: "Online now", test: (d) => d.online },
        { label: "Video enabled", test: (d) => d.consultationTypes.includes("video") },
      ]}
      emptyTitle="No doctors match"
      emptyBody="Try a different name, specialty or hospital."
      columns={[
        {
          key: "name",
          header: "Doctor",
          render: (d) => (
            <div className="flex items-center gap-3">
              <DoctorAvatar doctor={d} size={36} rounded="card" />
              <div className="min-w-0">
                <Link href={`/doctors/${d.slug}`} className="block truncate font-medium text-ink hover:text-electric hover:underline">
                  {d.name}
                </Link>
                <p className="truncate text-xs text-ink-faint">{d.qualifications.join(", ")}</p>
              </div>
            </div>
          ),
        },
        { key: "specialty", header: "Specialty", render: (d) => <span className="text-ink-soft">{d.specialty}</span> },
        {
          key: "hospital",
          header: "Hospital",
          hideBelow: "lg",
          render: (d) => (
            <span className="text-ink-soft">
              {d.hospital}
              <span className="block text-xs text-ink-faint">{d.location}</span>
            </span>
          ),
        },
        {
          key: "experience",
          header: "Experience",
          hideBelow: "md",
          render: (d) => <span className="text-ink-soft tnum">{d.experienceYears} yrs</span>,
        },
        {
          key: "rating",
          header: "Rating",
          hideBelow: "sm",
          render: (d) => (
            <span className="flex items-center gap-1.5">
              <Stars rating={d.rating} size={12} />
              <span className="font-medium text-ink tnum">{d.rating}</span>
            </span>
          ),
        },
        { key: "fee", header: "Fee", align: "right", render: (d) => <span className="font-semibold text-ink tnum">{formatFee(d.consultationFee)}</span> },
        {
          key: "status",
          header: "Status",
          align: "right",
          render: (d) => <StatusPill status={d.availableToday ? "upcoming" : "pending"}>{d.availableToday ? "Available" : "Booked up"}</StatusPill>,
        },
      ]}
    />
  );
}
