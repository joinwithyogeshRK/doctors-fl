import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { specialties } from "@/data/specialties";
import { specialtyIcons } from "@/components/home/specialtyIcons";
import { Breadcrumbs, PageHeader } from "@/components/ui/Surfaces";
import { LiveDot } from "@/components/ui/Badge";
import { Reveal } from "@/components/animations/Reveal";

export const metadata: Metadata = {
  title: "Medical specialties",
  description: "Twelve departments staffed by credential-checked consultants, with same-day slots held for urgent cases.",
};

export default function SpecialtiesPage() {
  return (
    <div className="pt-18">
      <section className="border-b hairline bg-[linear-gradient(180deg,var(--color-ice),var(--color-mist))]">
        <div className="shell py-10 lg:py-14">
          <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Specialties" }]} />
          <div className="mt-6">
            <PageHeader
              eyebrow={`${specialties.length} departments`}
              title="Medical specialties"
              lede="Each department is led by consultants with the credentials to match, and holds back same-day slots for urgent cases."
            />
          </div>
        </div>
      </section>

      <section className="shell py-10 lg:py-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {specialties.map((specialty, i) => {
            const Icon = specialtyIcons[specialty.slug];
            const accent = `var(--color-${specialty.accent})`;
            return (
              <Reveal key={specialty.slug} delay={0.03 * (i % 6)}>
                <Link
                  href={`/specialties/${specialty.slug}`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-panel border hairline bg-white p-6 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lift"
                >
                  <span
                    className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                    style={{ background: `color-mix(in oklab, ${accent} 32%, transparent)` }}
                    aria-hidden="true"
                  />
                  <span
                    className="relative grid h-12 w-12 place-items-center rounded-2xl transition-transform duration-300 group-hover:scale-110"
                    style={{ background: `color-mix(in oklab, ${accent} 12%, white)`, color: accent }}
                  >
                    <Icon size={21} />
                  </span>

                  <h2 className="relative mt-5 font-display text-xl font-semibold text-ink">
                    {specialty.name}
                  </h2>
                  <p className="relative mt-1 text-sm font-medium" style={{ color: accent }}>
                    {specialty.tagline}
                  </p>
                  <p className="relative mt-3 flex-1 text-sm leading-relaxed text-ink-soft">
                    {specialty.description}
                  </p>

                  <ul className="relative mt-5 flex flex-wrap gap-1.5">
                    {specialty.conditions.slice(0, 3).map((condition) => (
                      <li key={condition} className="rounded-chip bg-ice px-2.5 py-1 text-[0.6875rem] font-semibold text-ink-soft">
                        {condition}
                      </li>
                    ))}
                  </ul>

                  <div className="relative mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t hairline pt-4 text-sm">
                    <span className="font-semibold text-ink">{specialty.doctorCount} doctors</span>
                    <span className="inline-flex items-center gap-1.5 text-ink-soft">
                      <LiveDot />
                      {specialty.slotsToday} today
                    </span>
                    <span className="ml-auto inline-flex items-center gap-1 font-semibold text-electric transition-transform group-hover:translate-x-1">
                      Explore
                      <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>
    </div>
  );
}
