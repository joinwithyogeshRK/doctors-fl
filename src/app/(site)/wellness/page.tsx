import { Suspense } from "react";
import type { Metadata } from "next";
import { medicines } from "@/data/medicines";
import { PharmacyBrowser } from "@/components/pharmacy/PharmacyBrowser";
import { Breadcrumbs, PageHeader, Skeleton } from "@/components/ui/Surfaces";

export const metadata: Metadata = {
  title: "Wellness store",
  description: "Blood pressure monitors, thermometers, glucose meters, trackers and mobility aids.",
};

export default function WellnessPage() {
  return (
    <div className="pt-18">
      <section className="border-b hairline bg-[linear-gradient(180deg,var(--color-lavender),var(--color-mist))]">
        <div className="shell py-10 lg:py-14">
          <Breadcrumbs
            trail={[{ label: "Home", href: "/" }, { label: "Pharmacy", href: "/pharmacy" }, { label: "Wellness" }]}
          />
          <div className="mt-6">
            <PageHeader
              eyebrow={`${medicines.filter((m) => m.store === "wellness").length} products`}
              title="Health products and wellness"
              lede="Monitors, meters and everyday equipment for managing health at home — chosen by our clinical team."
            />
          </div>
        </div>
      </section>

      <section className="shell py-10 lg:py-14">
        <Suspense fallback={<Skeleton className="h-96 w-full rounded-card" />}>
          <PharmacyBrowser store="wellness" />
        </Suspense>
      </section>
    </div>
  );
}
