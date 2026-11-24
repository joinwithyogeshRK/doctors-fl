import type { Metadata } from "next";
import { AdminOverview } from "@/components/dashboard/admin/AdminOverview";

export const metadata: Metadata = { title: "Analytics" };

export default function AdminAnalyticsPage() {
  return <AdminOverview />;
}
