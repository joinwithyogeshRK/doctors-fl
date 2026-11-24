import type { Metadata } from "next";
import { AdminReviews } from "@/components/dashboard/admin/AdminTables";

export const metadata: Metadata = { title: "AdminReviews" };

export default function Page() {
  return <AdminReviews />;
}
