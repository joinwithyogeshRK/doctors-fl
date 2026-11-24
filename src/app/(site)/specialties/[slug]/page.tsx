import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, Check } from "lucide-react";
import { specialties, specialtyBySlug } from "@/data/specialties";
import { doctors } from "@/data/doctors";
import { specialtyIcons } from "@/components/home/specialtyIcons";
import { Breadcrumbs, Card, CardTitle, EmptyState, Skeleton } from "@/components/ui/Surfaces";
import { DoctorCard } from "@/components/ui/DoctorCard";
import { ButtonLink } from "@/components/ui/Button";
import { LiveDot } from "@/components/ui/Badge";

export function generateStaticParams() {
  return specialties.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const specialty = specialtyBySlug[slug];
  if (!specialty) return { title: "Specialty" };
  return { title: specialty.name, description: specialty.description };
}

async function Detail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const specialty = specialtyBySlug[slug];
  if (!specialty) notFound();

  const Icon = specialtyIcons[specialty.slug];
  const accent = `var(--color-${specialty.accent})`;
  const team = doctors.filter((d) => d.specialtySlug === specialty.slug);

  return (
    <>
      <section
        className="relative overflow-hidden border-b hairline"
        style={{ background: `linear-gradient(170deg, color-mix(in oklab, ${accent} 8%, white), var(--color-mist))` }}
      >
        <span
          className="pointer-events-none absolute -top-28 -right-16 h-96 w-96 rounded-full blur-[110px]"
          style={{ background: `color-mix(in oklab, ${accent} 22%, transparent)` }}
        />
        <div className="shell relative py-10 lg:py-14">
          <Breadcrumbs
            trail={[
              { label: "Home", href: "/" },
              { label: "Specialties", href: "/specialties" },
              { label: specialty.name },
            ]}
          />

          <div className="mt-7 flex flex-wrap items-start gap-6">
            <span
              className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl shadow-soft"
              style={{ background: "white", color: accent }}
            >
              <Icon size={28} />
            </span>
            <div className="min-w-0 max-w-2xl flex-1">
              <p className="text-sm font-medium" style={{ color: accent }}>
                {specialty.tagline}
              </p>
              <h1 className="mt-2 font-display text-[clamp(1.875rem,4.5vw,2.75rem)] leading-tight font-bold text-ink">
                {specialty.name}
              </h1>
              <p className="mt-4 text-base leading-relaxed text-ink-soft">{specialty.description}</p>

              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
                <span className="font-semibold text-ink">{specialty.doctorCount} consultants</span>
                <span className="inline-flex items-center gap-1.5 text-ink-soft">
                  <LiveDot />
                  {specialty.slotsToday} slots open today
                </span>
                <ButtonLink href={`/doctors?specialty=${specialty.slug}`} size="sm">
                  Find a {specialty.name.toLowerCase()} doctor
                  <ArrowRight size={14} />
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="shell py-10 lg:py-16">
        <div className="grid gap-6 lg:grid-cols-[1fr_18rem] lg:gap-8">
          <div className="min-w-0">
            <h2 className="font-display text-2xl font-bold text-ink">
              Our {specialty.name.toLowerCase()} team
            </h2>
            <p className="mt-1.5 text-sm text-ink-soft">
              {team.length} of our {specialty.doctorCount} {specialty.name.toLowerCase()}{" "}
              consultants are shown in this demonstration.
            </p>

            {team.length === 0 ? (
              <div className="mt-6">
                <EmptyState
                  icon={<Icon size={22} />}
                  title="No profiles in this demo"
                  body={`This department has ${specialty.doctorCount} consultants on the live platform. Browse all doctors to see the demo roster.`}
                  action={<ButtonLink href="/doctors">Browse all doctors</ButtonLink>}
                />
              </div>
            ) : (
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {team.map((doctor) => (
                  <DoctorCard key={doctor.id} doctor={doctor} />
                ))}
              </div>
            )}
          </div>

          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <Card>
              <CardTitle>Conditions we treat</CardTitle>
              <ul className="space-y-2.5">
                {specialty.conditions.map((condition) => (
                  <li key={condition} className="flex items-center gap-2.5 text-sm text-ink-soft">
                    <span
                      className="grid h-5 w-5 shrink-0 place-items-center rounded-full"
                      style={{ background: `color-mix(in oklab, ${accent} 14%, white)`, color: accent }}
                    >
                      <Check size={11} />
                    </span>
                    {condition}
                  </li>
                ))}
              </ul>
            </Card>

            <Card>
              <CardTitle>Other departments</CardTitle>
              <ul className="space-y-1">
                {specialties
                  .filter((s) => s.slug !== specialty.slug)
                  .slice(0, 6)
                  .map((other) => (
                    <li key={other.slug}>
                      <Link
                        href={`/specialties/${other.slug}`}
                        className="flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm text-ink-soft transition-colors hover:bg-mist hover:text-electric"
                      >
                        {other.name}
                        <span className="text-xs text-ink-faint tnum">{other.doctorCount}</span>
                      </Link>
                    </li>
                  ))}
              </ul>
              <ButtonLink href="/specialties" variant="secondary" size="sm" className="mt-4 w-full">
                All specialties
              </ButtonLink>
            </Card>
          </aside>
        </div>
      </section>
    </>
  );
}

export default function SpecialtyPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <div className="pt-18">
      <Suspense fallback={<Skeleton className="m-6 h-96 rounded-panel" />}>
        <Detail params={params} />
      </Suspense>
    </div>
  );
}
