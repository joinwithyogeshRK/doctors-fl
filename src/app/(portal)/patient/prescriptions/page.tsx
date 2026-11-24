import type { Metadata } from "next";
import { PrescriptionsView } from "@/components/dashboard/patient/PrescriptionsView";

export const metadata: Metadata = { title: "Prescriptions" };

export default function PrescriptionsPage() {
  return <PrescriptionsView />;
}
