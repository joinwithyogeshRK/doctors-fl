import type { Metadata } from "next";
import { ConsultationsView } from "@/components/dashboard/doctor/ConsultationsView";

export const metadata: Metadata = { title: "Consultations" };

export default function DoctorConsultationsPage() {
  return <ConsultationsView />;
}
