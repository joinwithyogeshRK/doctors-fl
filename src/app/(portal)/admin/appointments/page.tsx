import type { Metadata } from "next";
import { AdminAppointments } from "@/components/dashboard/admin/AdminTables";

export const metadata: Metadata = { title: "AdminAppointments" };

export default function Page() {
  return <AdminAppointments />;
}
