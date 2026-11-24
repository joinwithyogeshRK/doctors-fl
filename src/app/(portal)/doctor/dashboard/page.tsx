import type { Metadata } from "next";
import { DoctorOverview } from "@/components/dashboard/doctor/DoctorOverview";

export const metadata: Metadata = { title: "Doctor dashboard" };

export default function DoctorDashboardPage() {
  return <DoctorOverview />;
}
