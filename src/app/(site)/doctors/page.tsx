import { Suspense } from "react";
import type { Metadata } from "next";
import { doctors } from "@/data/doctors";
import { DoctorExplorer } from "@/components/doctors/DoctorExplorer";
import { Breadcrumbs, PageHeader, SkeletonCard } from "@/components/ui/Surfaces";

export const metadata: Metadata = {
  title: "Find a doctor",
  description:
    "Search Meridian Health consultants by name, specialty, condition or hospital, and book the next available slot.",
};

export default function DoctorsPage() {
  return (
    <div className="pt-18">
      <div className="border-b hairline bg-[linear-gradient(180deg,var(--color-ice),var(--color-mist))]">
        <div className="shell py-10 lg:py-14">
          <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Doctors" }]} />
          <div className="mt-6">
            <PageHeader
              eyebrow={`${doctors.length} consultants`}
              title="Find the right doctor"
              lede="Filter by specialty, experience, fee and availability. Every profile shows credentials and the next free slot before you book."
            />
          </div>
        </div>
      </div>

      <div className="shell py-10 lg:py-14">
        <Suspense fallback={<ExplorerSkeleton />}>
          <DoctorExplorer />
        </Suspense>
      </div>
    </div>
  );
}

function ExplorerSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
