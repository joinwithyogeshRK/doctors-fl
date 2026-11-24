import type { Metadata } from "next";
import { DoctorAnalytics } from "@/components/dashboard/doctor/DoctorAnalytics";

export const metadata: Metadata = { title: "Analytics" };

export default function DoctorAnalyticsPage() {
  return <DoctorAnalytics />;
}
