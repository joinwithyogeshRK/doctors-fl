import type { Metadata } from "next";
import { OrdersView } from "@/components/dashboard/patient/OrdersView";

export const metadata: Metadata = { title: "Medicine orders" };

export default function PatientOrdersPage() {
  return <OrdersView />;
}
