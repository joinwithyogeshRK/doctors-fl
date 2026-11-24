import type { Metadata } from "next";
import { AdminDoctors } from "@/components/dashboard/admin/AdminDoctors";

export const metadata: Metadata = { title: "Manage doctors" };

export default function AdminDoctorsPage() {
  return <AdminDoctors />;
}
