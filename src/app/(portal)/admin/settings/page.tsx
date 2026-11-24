import type { Metadata } from "next";
import { SettingsView } from "@/components/dashboard/SettingsView";

export const metadata: Metadata = { title: "Settings" };

export default function AdminSettingsPage() {
  return <SettingsView role="admin" />;
}
