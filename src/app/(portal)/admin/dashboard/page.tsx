import type { Metadata } from "next";
import { AdminOverview } from "@/components/dashboard/admin/AdminOverview";

export const metadata: Metadata = { title: "Admin dashboard" };

export default function AdminDashboardPage() {
  return <AdminOverview />;
}
