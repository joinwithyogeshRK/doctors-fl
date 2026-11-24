import type { Metadata } from "next";
import { AdminPatients } from "@/components/dashboard/admin/AdminTables";

export const metadata: Metadata = { title: "AdminPatients" };

export default function Page() {
  return <AdminPatients />;
}
