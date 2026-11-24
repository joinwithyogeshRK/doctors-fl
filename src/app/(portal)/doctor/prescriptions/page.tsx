import type { Metadata } from "next";
import { PrescriptionBuilder } from "@/components/dashboard/doctor/PrescriptionBuilder";

export const metadata: Metadata = { title: "Prescriptions" };

export default function DoctorPrescriptionsPage() {
  return <PrescriptionBuilder />;
}
