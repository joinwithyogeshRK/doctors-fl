import type { Metadata } from "next";
import { AppointmentsView } from "@/components/dashboard/patient/AppointmentsView";

export const metadata: Metadata = { title: "My appointments" };

export default function PatientAppointmentsPage() {
  return <AppointmentsView />;
}
