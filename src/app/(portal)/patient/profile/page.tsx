import type { Metadata } from "next";
import { ProfileView } from "@/components/dashboard/patient/ProfileView";

export const metadata: Metadata = { title: "Health profile" };

export default function ProfilePage() {
  return <ProfileView />;
}
