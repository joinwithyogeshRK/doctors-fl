import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { specialties } from "@/data/specialties";
import { specialtyIcons } from "@/components/home/specialtyIcons";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { ButtonLink } from "@/components/ui/Button";
import { LiveDot } from "@/components/ui/Badge";
import { Reveal } from "@/components/animations/Reveal";

const [feature, ...rest] = specialties;
const medium = rest.slice(0, 4);
const compact = rest.slice(4);

export function Specialties() {
  const FeatureIcon = specialtyIcons[feature.slug];

  return (
    <section id="specialties" className="relative scroll-mt-24 py-24 lg:py-32">
      <div className="shell">
        <SectionIntro
          title="Twelve specialties, one standard of care"
          lede="Every department is staffed by credential-checked consultants, with same-day slots held back for urgent cases."
          action={
            <ButtonLink href="/specialties" variant="secondary">
              Explore all specialties
              <ArrowRight size={16} />
            </ButtonLink>
          }
        />

        <div className="mt-12 grid gap-4 lg:grid-cols-12">
          {/* Feature: the department the hospital leads with */}
          <Reveal className="lg:col-span-6" y={24}>
            <Link
              href={`/specialties/${feature.slug}`}
              className="group relative flex h-full flex-col justify-between overflow-hidden rounded-panel p-7 text-white transition-transform duration-300 hover:-translate-y-1 sm:p-9"
              style={{
                background:
                  "linear-gradient(148deg, #16255a 0%, #22215e 48%, #3a1f5e 100%)",
              }}
            >
              <span
                className="pointer-events-none absolute -top-16 -right-16 h-72 w-72 rounded-full blur-3xl"
                style={{ background: "color-mix(in oklab, var(--color-sp-cardiology) 42%, transparent)" }}
                aria-hidden="true"
              />
              <Image
                src="/assets/healthcare/hero/holographic-heart.png"
                alt=""
                width={788}
                height={927}
                sizes="(max-width: 1024px) 50vw, 20rem"
                className="pointer-events-none absolute -right-8 -bottom-10 w-52 opacity-90 transition-transform duration-700 group-hover:scale-105 sm:w-64"
              />

              <div className="relative">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/12 backdrop-blur-sm">
                  <FeatureIcon size={22} />
                </span>
                <h3 className="mt-6 font-display text-3xl font-semibold sm:text-[2.125rem]">
                  {feature.name}
                </h3>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/72">
                  {feature.description}
                </p>
              </div>

              <div className="relative mt-10">
                <ul className="flex flex-wrap gap-1.5">
                  {feature.conditions.map((c) => (
                    <li
                      key={c}
                      className="rounded-chip bg-white/10 px-2.5 py-1 text-[0.6875rem] font-medium text-white/80"
                    >
                      {c}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/14 pt-5 text-sm">
                  <span className="font-semibold">{feature.doctorCount} doctors</span>
                  <span className="inline-flex items-center gap-1.5 text-white/75">
                    <LiveDot />
                    {feature.slotsToday} slots today
                  </span>
                  <span className="ml-auto inline-flex items-center gap-1 font-semibold transition-transform duration-300 group-hover:translate-x-1">
                    Explore
                    <ArrowRight size={15} />
                  </span>
                </div>
              </div>
            </Link>
          </Reveal>

          {/* Four departments at medium weight */}
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-6">
            {medium.map((specialty, i) => {
              const Icon = specialtyIcons[specialty.slug];
              const accent = `var(--color-${specialty.accent})`;
              return (
                <Reveal key={specialty.slug} delay={0.05 * i} y={20}>
                  <Link
                    href={`/specialties/${specialty.slug}`}
                    className="group relative flex h-full flex-col overflow-hidden rounded-card border border-[color-mix(in_oklab,var(--color-ink)_8%,transparent)] bg-white p-6 shadow-soft transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lift"
                  >
                    <span
                      className="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                      style={{ background: `color-mix(in oklab, ${accent} 30%, transparent)` }}
                      aria-hidden="true"
                    />
                    <span
                      className="grid h-11 w-11 place-items-center rounded-2xl transition-transform duration-300 group-hover:scale-110"
                      style={{
                        background: `color-mix(in oklab, ${accent} 12%, white)`,
                        color: accent,
                      }}
                    >
                      <Icon size={20} />
                    </span>
                    <h3 className="relative mt-5 text-lg font-semibold text-ink">
                      {specialty.name}
                    </h3>
                    <p className="relative mt-1.5 flex-1 text-[0.8125rem] leading-relaxed text-ink-soft">
                      {specialty.tagline}
                    </p>
                    <div className="relative mt-5 flex items-center justify-between border-t hairline pt-4 text-[0.8125rem]">
                      <span className="font-semibold text-ink">
                        {specialty.doctorCount} doctors
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-ink-soft">
                        <LiveDot />
                        {specialty.slotsToday} today
                      </span>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>

        {/* The remaining departments, compact */}
        <Reveal className="mt-4" y={18}>
          <ul className="grid gap-px overflow-hidden rounded-card border border-[color-mix(in_oklab,var(--color-ink)_8%,transparent)] bg-[color-mix(in_oklab,var(--color-ink)_8%,transparent)] sm:grid-cols-2 lg:grid-cols-4">
            {compact.map((specialty) => {
              const Icon = specialtyIcons[specialty.slug];
              const accent = `var(--color-${specialty.accent})`;
              return (
                <li key={specialty.slug}>
                  <Link
                    href={`/specialties/${specialty.slug}`}
                    className="group flex h-full items-center gap-3 bg-white px-4 py-4 transition-colors duration-200 hover:bg-mist"
                  >
                    <span
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-xl"
                      style={{
                        background: `color-mix(in oklab, ${accent} 11%, white)`,
                        color: accent,
                      }}
                    >
                      <Icon size={17} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-ink">
                        {specialty.name}
                      </span>
                      <span className="block truncate text-xs text-ink-faint">
                        {specialty.doctorCount} doctors · {specialty.slotsToday} today
                      </span>
                    </span>
                    <ChevronRight
                      size={16}
                      className="shrink-0 text-ink-faint transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-electric"
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
