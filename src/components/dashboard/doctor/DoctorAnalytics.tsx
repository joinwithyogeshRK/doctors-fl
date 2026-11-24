"use client";

import { IndianRupee, Repeat, Star, Users } from "lucide-react";
import { appointmentsOverTime, doctorWeek, satisfactionTrend } from "@/data/analytics";
import { formatFee } from "@/lib/format";
import { Card, PageHeader, StatTile } from "@/components/ui/Surfaces";
import { GroupedBars, RankedBars, TrendArea } from "@/components/charts/Charts";

const revenueByMonth = [
  { month: "Jun", amount: 142000 },
  { month: "Jul", amount: 156000 },
  { month: "Aug", amount: 149000 },
  { month: "Sep", amount: 171000 },
  { month: "Oct", amount: 178000 },
  { month: "Nov", amount: 192000 },
];

const topReasons = [
  { label: "Hypertension review", value: 64 },
  { label: "Chest pain assessment", value: 48 },
  { label: "Post-procedure follow-up", value: 39 },
  { label: "Cholesterol management", value: 31 },
  { label: "Pre-operative clearance", value: 22 },
];

export function DoctorAnalytics() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Analytics"
        lede="How your clinic is running — bookings, revenue and patient satisfaction."
      />

      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile label="Consultations this month" value="184" detail="Up 8% on October" icon={<Users size={19} />} tone="electric" />
        <StatTile label="Revenue this month" value={formatFee(192000)} detail="Up 7.9% on October" icon={<IndianRupee size={19} />} tone="mint" />
        <StatTile label="Repeat patients" value="68%" detail="Seen you before" icon={<Repeat size={19} />} tone="violet" />
        <StatTile label="Satisfaction" value="4.9/5" detail="412 reviews" icon={<Star size={19} />} tone="amber" />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Card>
          <GroupedBars
            title="Consultations by type"
            caption="In-clinic against video, last six months"
            data={appointmentsOverTime.map((row) => ({
              month: row.month,
              inClinic: Math.round(row.inClinic / 3.2),
              video: Math.round(row.video / 3.2),
            }))}
            series={[
              { key: "inClinic", label: "In clinic" },
              { key: "video", label: "Video" },
            ]}
          />
        </Card>

        <Card>
          <TrendArea
            title="Revenue"
            caption="Consultation fees settled each month"
            data={revenueByMonth}
            valueKey="amount"
            format={(n) => `₹${(n / 1000).toFixed(0)}k`}
          />
        </Card>

        <Card>
          <RankedBars
            title="Most common reasons for visit"
            caption="Consultations this quarter"
            data={topReasons}
          />
        </Card>

        <Card>
          <TrendArea
            title="Patient satisfaction"
            caption="Percentage rating the consultation 4 or 5 stars"
            data={satisfactionTrend}
            valueKey="score"
            format={(n) => `${n}%`}
            color="#0a8f66"
          />
        </Card>

        <Card className="lg:col-span-2">
          <GroupedBars
            title="Weekly capacity"
            caption="Booked slots against the slots you opened"
            data={doctorWeek.map((d) => ({ month: d.day, booked: d.booked, capacity: d.capacity }))}
            series={[
              { key: "booked", label: "Booked" },
              { key: "capacity", label: "Capacity" },
            ]}
          />
        </Card>
      </div>
    </div>
  );
}
