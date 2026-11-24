import type { Metadata } from "next";
import { AdminPharmacy } from "@/components/dashboard/admin/AdminTables";

export const metadata: Metadata = { title: "AdminPharmacy" };

export default function Page() {
  return <AdminPharmacy />;
}
