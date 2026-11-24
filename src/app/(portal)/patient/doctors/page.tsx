import type { Metadata } from "next";
import { MyDoctors } from "@/components/dashboard/patient/MyDoctors";

export const metadata: Metadata = { title: "My doctors" };

export default function MyDoctorsPage() {
  return <MyDoctors />;
}
