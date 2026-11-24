import { Suspense } from "react";
import type { Metadata } from "next";
import { GlobalSearch } from "@/components/marketing/GlobalSearch";
import { Breadcrumbs, PageHeader, Skeleton } from "@/components/ui/Surfaces";

export const metadata: Metadata = { title: "Search" };

export default function SearchPage() {
  return (
    <div className="bg-mist pt-18">
      <div className="shell py-8 lg:py-12">
        <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Search" }]} />
        <div className="mx-auto mt-6 mb-8 max-w-3xl">
          <PageHeader title="Search" lede="Doctors, specialties, medicines and health articles, all in one place." />
        </div>
        <Suspense fallback={<Skeleton className="mx-auto h-15 max-w-3xl rounded-full" />}>
          <GlobalSearch />
        </Suspense>
      </div>
    </div>
  );
}
