import type { Metadata } from "next";
import { AdminContent } from "@/components/dashboard/admin/AdminTables";

export const metadata: Metadata = { title: "AdminContent" };

export default function Page() {
  return <AdminContent />;
}
