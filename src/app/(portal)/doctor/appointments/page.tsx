import type { Metadata } from "next";
import { ClinicAppointments } from "@/components/dashboard/doctor/ClinicAppointments";

export const metadata: Metadata = { title: "Appointments" };

export default function DoctorAppointmentsPage() {
  return <ClinicAppointments />;
}
