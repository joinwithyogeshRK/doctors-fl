import type { Metadata } from "next";
import { ReviewsView } from "@/components/dashboard/doctor/ReviewsView";

export const metadata: Metadata = { title: "Reviews" };

export default function DoctorReviewsPage() {
  return <ReviewsView />;
}
