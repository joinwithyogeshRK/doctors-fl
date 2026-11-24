import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Clock3, ShieldCheck, Truck } from "lucide-react";
import { medicineCategories, medicines } from "@/data/medicines";
import { PharmacyBrowser } from "@/components/pharmacy/PharmacyBrowser";
import { MedicineCard } from "@/components/pharmacy/MedicineCard";
import { Breadcrumbs, PageHeader, Skeleton } from "@/components/ui/Surfaces";

export const metadata: Metadata = {
  title: "Pharmacy",
  description:
    "Order prescription and over-the-counter medicines, vitamins and health essentials with same-day delivery.",
};

const promises = [
  { icon: Truck, title: "Same-day delivery", body: "Express within 3 hours in 20 cities" },
  { icon: ShieldCheck, title: "Pharmacist checked", body: "Every order verified before dispatch" },
  { icon: Clock3, title: "Open around the clock", body: "Order any time, dispatched 8 AM to 10 PM" },
];

const trending = medicines.filter((m) => m.store === "pharmacy" && m.rating >= 4.6).slice(0, 4);

export default function PharmacyPage() {
  return (
    <div className="pt-18">
      <section className="border-b hairline bg-[linear-gradient(180deg,var(--color-ice),var(--color-mist))]">
        <div className="shell py-10 lg:py-14">
          <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Pharmacy" }]} />
          <div className="mt-6">
            <PageHeader
              eyebrow={`${medicines.filter((m) => m.store === "pharmacy").length} products`}
              title="Pharmacy"
              lede="Prescription medicines, everyday essentials and vitamins — checked by a pharmacist and delivered to your door."
            />
          </div>

          <ul className="mt-8 grid gap-3 sm:grid-cols-3">
            {promises.map((promise) => {
              const Icon = promise.icon;
              return (
                <li key={promise.title} className="flex items-center gap-3 rounded-card bg-white/70 p-4 backdrop-blur-sm">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[color-mix(in_oklab,var(--color-electric)_10%,white)] text-electric">
                    <Icon size={18} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-ink">{promise.title}</span>
                    <span className="block text-xs text-ink-faint">{promise.body}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Trending */}
      <section className="shell py-10 lg:py-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-ink">Frequently purchased</h2>
            <p className="mt-1.5 text-sm text-ink-soft">What patients order most this month.</p>
          </div>
          <Link
            href="/wellness"
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-electric hover:underline"
          >
            Wellness store
            <ArrowRight size={15} />
          </Link>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trending.map((item) => (
            <MedicineCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="shell pb-10 lg:pb-14">
        <h2 className="font-display text-2xl font-bold text-ink">Browse by category</h2>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {medicineCategories.map((category) => (
            <li key={category.slug}>
              <Link
                href={`/pharmacy?category=${category.slug}`}
                className="group flex items-center justify-between gap-3 rounded-card border hairline bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-electric/40 hover:shadow-soft"
              >
                <span className="min-w-0">
                  <span className="block font-semibold text-ink">{category.name}</span>
                  <span className="mt-0.5 block text-xs text-ink-faint">{category.blurb}</span>
                </span>
                <ArrowRight
                  size={16}
                  className="shrink-0 text-ink-faint transition-transform group-hover:translate-x-0.5 group-hover:text-electric"
                />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Full catalogue */}
      <section className="bg-mist py-10 lg:py-14">
        <div className="shell">
          <h2 className="font-display text-2xl font-bold text-ink">All medicines</h2>
          <div className="mt-6">
            <Suspense fallback={<Skeleton className="h-96 w-full rounded-card" />}>
              <PharmacyBrowser store="pharmacy" />
            </Suspense>
          </div>

          <p className="mt-8 rounded-card border hairline bg-white px-5 py-4 text-xs leading-relaxed text-ink-soft">
            Product information here is for demonstration purposes only. Consult a qualified
            healthcare professional before using any medication. This demo does not dispense
            medicines and does not provide dosage recommendations.
          </p>
        </div>
      </section>
    </div>
  );
}
