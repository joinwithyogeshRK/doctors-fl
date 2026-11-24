import type { Metadata } from "next";
import { PatientsView } from "@/components/dashboard/doctor/PatientsView";

export const metadata: Metadata = { title: "Patients" };

export default function DoctorPatientsPage() {
  return <PatientsView />;
}
