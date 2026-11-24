import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Search } from "lucide-react";
import { doctors, featuredDoctor } from "@/data/doctors";
import { specialties } from "@/data/specialties";
import { formatFee } from "@/lib/format";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { ButtonLink } from "@/components/ui/Button";
import { DoctorCard } from "@/components/ui/DoctorCard";
import { Stars } from "@/components/ui/Stars";
import { LiveDot } from "@/components/ui/Badge";
import { Reveal } from "@/components/animations/Reveal";

const roster = doctors.slice(1, 5);
const quickFilters = specialties.slice(0, 6);

export function DoctorShowcase() {
  return (
    <section
      id="doctors"
      className="relative scroll-mt-24 overflow-hidden bg-[linear-gradient(180deg,var(--color-mist),var(--color-ice))] py-24 lg:py-32"
    >
      <div className="shell">
        <SectionIntro
          title="Find the right doctor, not just an available one"
          lede="Search by name, specialty, condition or hospital. Every profile shows credentials, fees and the next free slot before you commit."
          action={
            <ButtonLink href="/doctors" variant="secondary">
              View all {doctors.length} doctors
              <ArrowRight size={16} />
            </ButtonLink>
          }
        />

        {/* Discovery entry point */}
        <Reveal className="mt-10" y={16}>
          <div className="flex flex-col gap-3 rounded-panel border border-white bg-white/70 p-3 shadow-soft backdrop-blur-sm sm:flex-row sm:items-center">
            <Link
              href="/doctors"
              className="group flex flex-1 items-center gap-3 rounded-card px-4 py-3 transition-colors hover:bg-ice"
            >
              <Search size={18} className="shrink-0 text-ink-faint" />
              <span className="text-sm text-ink-faint">
                Try &ldquo;chest pain&rdquo;, &ldquo;Dr. Rao&rdquo; or &ldquo;Meridian Heart Institute&rdquo;
              </span>
            </Link>
            <div className="flex flex-wrap gap-1.5 px-1 pb-1 sm:pb-0">
              {quickFilters.map((s) => (
                <Link
                  key={s.slug}
                  href={`/doctors?specialty=${s.slug}`}
                  className="rounded-chip bg-ice px-3 py-1.5 text-xs font-semibold text-ink-soft transition-colors hover:bg-electric hover:text-white"
                >
                  {s.name}
                </Link>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="mt-6 grid gap-4 lg:grid-cols-12">
          {/* Spotlight */}
          <Reveal className="lg:col-span-5" y={24}>
            <article className="relative flex h-full flex-col overflow-hidden rounded-panel bg-[linear-gradient(155deg,#132252_0%,#23215f_55%,#3b2064_100%)] text-white">
              <span
                className="pointer-events-none absolute -top-20 -left-20 h-72 w-72 rounded-full bg-electric/40 blur-3xl"
                aria-hidden="true"
              />
              <div className="relative flex-1 p-7 sm:p-8">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/12 px-3 py-1 text-[0.6875rem] font-semibold tracking-wide text-white/85 backdrop-blur-sm">
                  <BadgeCheck size={13} />
                  Verified consultant
                </span>

                <h3 className="mt-5 font-display text-3xl font-semibold">{featuredDoctor.name}</h3>
                <p className="mt-1 text-sm font-medium text-electric-light">
                  {featuredDoctor.specialty} · {featuredDoctor.hospital}
                </p>

                <div className="mt-4 flex items-center gap-2 text-sm">
                  <Stars rating={featuredDoctor.rating} />
                  <span className="font-semibold">{featuredDoctor.rating}</span>
                  <span className="text-white/60">({featuredDoctor.reviewCount} reviews)</span>
                </div>

                <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/72">
                  {featuredDoctor.bio}
                </p>

                <dl className="mt-6 flex gap-6 text-sm">
                  <div>
                    <dt className="text-[0.6875rem] text-white/55">Experience</dt>
                    <dd className="mt-0.5 font-display text-xl font-semibold">
                      {featuredDoctor.experienceYears} yrs
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[0.6875rem] text-white/55">Consultation</dt>
                    <dd className="mt-0.5 font-display text-xl font-semibold">
                      {formatFee(featuredDoctor.consultationFee)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[0.6875rem] text-white/55">Next slot</dt>
                    <dd className="mt-0.5 inline-flex items-center gap-1.5 pt-1 text-sm font-semibold">
                      <LiveDot />
                      {featuredDoctor.nextSlot}
                    </dd>
                  </div>
                </dl>

                <div className="mt-7 flex flex-wrap gap-2">
                  <ButtonLink href={`/appointments/book?doctor=${featuredDoctor.slug}`} size="sm">
                    Book appointment
                  </ButtonLink>
                  <ButtonLink
                    href={`/doctors/${featuredDoctor.slug}`}
                    variant="onDark"
                    size="sm"
                  >
                    View profile
                  </ButtonLink>
                </div>
              </div>

              {/* Portrait anchored to the panel floor */}
              <div className="pointer-events-none relative mt-auto hidden h-56 sm:block">
                <Image
                  src="/assets/healthcare/hero/doctor.png"
                  alt=""
                  width={427}
                  height={1263}
                  sizes="20rem"
                  className="absolute -right-2 bottom-0 h-[22rem] w-auto object-contain object-bottom opacity-95"
                />
              </div>
            </article>
          </Reveal>

          {/* Roster */}
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            {roster.map((doctor, i) => (
              <Reveal key={doctor.id} delay={0.05 * i} y={20}>
                <DoctorCard doctor={doctor} className="h-full" />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
