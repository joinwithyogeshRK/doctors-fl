"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  IndianRupee,
  Package,
  ShieldCheck,
  Stethoscope,
  UserRound,
} from "lucide-react";
import { doctors } from "@/data/doctors";
import {
  appointmentsOverTime,
  doctorPerformance,
  patientGrowth,
  pharmacyOrders,
  popularSpecialties,
  revenueByMonth,
} from "@/data/analytics";
import { formatFee } from "@/lib/format";
import { useGreeting } from "@/hooks/useToday";
import { Card, CardTitle, PageHeader, StatTile, StatusPill } from "@/components/ui/Surfaces";
import { ButtonLink } from "@/components/ui/Button";
import { Donut, GroupedBars, RankedBars, TrendArea } from "@/components/charts/Charts";

const pendingRegistrations = [
  { name: "Dr. Harish Menon", specialty: "Pulmonology", city: "Kochi", submitted: "2 days ago" },
  { name: "Dr. Shalini Rao", specialty: "Endocrinology", city: "Bengaluru", submitted: "3 days ago" },
  { name: "Dr. Faisal Ahmed", specialty: "Urology", city: "Hyderabad", submitted: "5 days ago" },
];

export function AdminOverview() {
  const greeting = useGreeting();

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        eyebrow={`${greeting}, Priya`}
        title="Platform overview"
        lede="How the network is performing this month across clinics, patients and the pharmacy."
        action={<ButtonLink href="/admin/analytics" variant="secondary">Full analytics</ButtonLink>}
      />

      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <StatTile label="Total doctors" value="527" detail={`${doctors.length} in this demo`} icon={<Stethoscope size={19} />} tone="electric" />
        <StatTile label="Total patients" value="50,240" detail="Up 5.5% this month" icon={<UserRound size={19} />} tone="violet" />
        <StatTile label="Appointments" value="991" detail="November to date" icon={<CalendarDays size={19} />} tone="mint" />
        <StatTile label="Revenue" value={formatFee(2870000)} detail="Up 13.9% on October" icon={<IndianRupee size={19} />} tone="electric" />
        <StatTile label="Pharmacy orders" value="3,345" detail="Up 10.8% on October" icon={<Package size={19} />} tone="amber" />
        <StatTile label="Pending registrations" value={pendingRegistrations.length} detail="Awaiting verification" icon={<ShieldCheck size={19} />} tone="amber" />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Card>
          <GroupedBars
            title="Appointments over time"
            caption="In-clinic against video consultations"
            data={appointmentsOverTime as unknown as Record<string, string | number>[]}
            series={[
              { key: "inClinic", label: "In clinic" },
              { key: "video", label: "Video" },
            ]}
          />
        </Card>

        <Card>
          <TrendArea
            title="Revenue"
            caption="Consultation and pharmacy revenue combined"
            data={revenueByMonth}
            valueKey="amount"
            format={(n) => `₹${(n / 100000).toFixed(1)}L`}
          />
        </Card>

        <Card>
          <Donut
            title="Popular specialties"
            caption="Share of all appointments this month"
            data={popularSpecialties}
          />
        </Card>

        <Card>
          <TrendArea
            title="Patient growth"
            caption="Registered patients on the platform"
            data={patientGrowth}
            valueKey="patients"
            format={(n) => `${(n / 1000).toFixed(1)}k`}
            color="#7a4dff"
          />
        </Card>

        <Card>
          <RankedBars
            title="Doctor performance"
            caption="Consultations completed this month"
            data={doctorPerformance.map((d) => ({
              label: d.name,
              value: d.consultations,
              sub: `${d.rating} rating · ${formatFee(d.revenue)} revenue`,
            }))}
          />
        </Card>

        <Card>
          <TrendArea
            title="Pharmacy orders"
            caption="Orders dispatched each month"
            data={pharmacyOrders}
            valueKey="orders"
            color="#d97a12"
          />
        </Card>
      </div>

      <Card className="mt-5">
        <CardTitle
          action={
            <Link href="/admin/doctors" className="inline-flex items-center gap-1 text-sm font-semibold text-electric hover:underline">
              Manage doctors
              <ArrowRight size={14} />
            </Link>
          }
        >
          Pending doctor registrations
        </CardTitle>
        <ul className="divide-y divide-[color-mix(in_oklab,var(--color-ink)_7%,transparent)]">
          {pendingRegistrations.map((registration) => (
            <li key={registration.name} className="flex flex-wrap items-center gap-4 py-3.5 first:pt-0 last:pb-0">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-ice text-xs font-bold text-ink-soft">
                {registration.name.replace("Dr. ", "").split(" ").map((p) => p[0]).join("")}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-ink">{registration.name}</p>
                <p className="truncate text-xs text-ink-faint">
                  {registration.specialty} · {registration.city}
                </p>
              </div>
              <span className="text-xs text-ink-faint">{registration.submitted}</span>
              <StatusPill status="pending">Verification</StatusPill>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
