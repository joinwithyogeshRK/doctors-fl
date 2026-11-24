import type { Metadata } from "next";
import { PatientOverview } from "@/components/dashboard/patient/PatientOverview";

export const metadata: Metadata = { title: "Patient dashboard" };

export default function PatientDashboardPage() {
  return <PatientOverview />;
}
