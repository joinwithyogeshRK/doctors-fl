import type { Metadata } from "next";
import { RecordsView } from "@/components/dashboard/patient/RecordsView";

export const metadata: Metadata = { title: "Medical records" };

export default function MedicalRecordsPage() {
  return <RecordsView />;
}
