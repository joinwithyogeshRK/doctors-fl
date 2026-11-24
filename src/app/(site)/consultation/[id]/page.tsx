import { Suspense } from "react";
import type { Metadata } from "next";
import { ConsultationRoom } from "@/components/consultation/ConsultationRoom";
import { Breadcrumbs, Skeleton } from "@/components/ui/Surfaces";

export const metadata: Metadata = { title: "Video consultation" };

export function generateStaticParams() {
  return [{ id: "demo" }, { id: "APT-9F3K21" }, { id: "APT-7B2M84" }];
}

async function Room({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ConsultationRoom appointmentId={id} />;
}

export default function ConsultationPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <div className="bg-mist pt-18">
      <div className="shell py-8 lg:py-12">
        <Breadcrumbs
          trail={[
            { label: "Home", href: "/" },
            { label: "Appointments", href: "/patient/appointments" },
            { label: "Consultation" },
          ]}
        />
        <div className="mt-6">
          <Suspense fallback={<Skeleton className="h-[30rem] w-full rounded-panel" />}>
            <Room params={params} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
