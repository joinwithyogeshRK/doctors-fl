import { Suspense } from "react";
import type { Metadata } from "next";
import { BookingFlow } from "@/components/appointments/BookingFlow";
import { Breadcrumbs, PageHeader, Skeleton } from "@/components/ui/Surfaces";

export const metadata: Metadata = {
  title: "Book an appointment",
  description: "Choose a doctor, a consultation type and a time that suits you.",
};

export default function BookAppointmentPage() {
  return (
    <div className="bg-mist pt-18">
      <div className="shell py-8 lg:py-12">
        <Breadcrumbs
          trail={[
            { label: "Home", href: "/" },
            { label: "Appointments", href: "/patient/appointments" },
            { label: "Book" },
          ]}
        />
        <div className="mt-6 mb-8">
          <PageHeader
            title="Book an appointment"
            lede="Eight short steps. You can go back and change anything until you confirm."
          />
        </div>

        <Suspense fallback={<Skeleton className="h-[32rem] w-full rounded-panel" />}>
          <BookingFlow />
        </Suspense>
      </div>
    </div>
  );
}
