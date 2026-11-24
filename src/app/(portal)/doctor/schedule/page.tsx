import type { Metadata } from "next";
import { ScheduleView } from "@/components/dashboard/doctor/ScheduleView";

export const metadata: Metadata = { title: "Schedule" };

export default function SchedulePage() {
  return <ScheduleView />;
}
