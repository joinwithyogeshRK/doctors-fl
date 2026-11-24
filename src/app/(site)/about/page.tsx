import Image from "next/image";
import type { Metadata } from "next";
import { Building2, HeartHandshake, Microscope, ShieldCheck, Sparkles, Users } from "lucide-react";
import { Breadcrumbs, PageHeader } from "@/components/ui/Surfaces";
import { Reveal } from "@/components/animations/Reveal";
import { CountUp } from "@/components/animations/CountUp";
import { ButtonLink } from "@/components/ui/Button";
import { SectionIntro } from "@/components/ui/SectionIntro";

export const metadata: Metadata = {
  title: "About us",
  description: "Our mission, our philosophy and the people behind Meridian Health.",
};

const pillars = [
  {
    icon: HeartHandshake,
    title: "Patient first, always",
    body: "Every decision starts with the person in the chair, not the process around them. If a policy makes care harder, the policy changes.",
  },
  {
    icon: Microscope,
    title: "Evidence over opinion",
    body: "Our clinical protocols are reviewed quarterly against current literature, and audited against our own outcomes.",
  },
  {
    icon: ShieldCheck,
    title: "Nothing hidden",
    body: "Fees, waiting times and what a procedure involves are stated before you commit, not discovered afterwards.",
  },
];

const metrics = [
  { value: 50000, suffix: "+", label: "Patients treated" },
  { value: 527, suffix: "", label: "Doctors" },
  { value: 104, suffix: "", label: "Partner hospitals" },
  { value: 10, suffix: " yrs", label: "Of practice" },
];

export default function AboutPage() {
  return (
    <div className="pt-18">
      {/* Opening */}
      <section className="relative overflow-hidden border-b hairline bg-[linear-gradient(176deg,#ffffff,var(--color-ice)_60%,var(--color-lavender))]">
        <span className="pointer-events-none absolute -top-32 -left-24 h-[28rem] w-[28rem] rounded-full bg-electric/12 blur-[110px]" />
        <div className="shell relative py-10 lg:py-16">
          <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "About" }]} />
          <div className="mt-6 max-w-3xl">
            <PageHeader
              eyebrow="Since 2016"
              title="We built the practice we wanted our own families to use"
              lede="Meridian Health began as one cardiology clinic in Bengaluru with a stubborn idea: that good medicine and a good experience are not in tension. Ten years on, that idea runs across 104 hospitals."
            />
          </div>
        </div>
      </section>

      {/* Mission / vision / philosophy */}
      <section className="shell py-16 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <Reveal>
            <div className="relative">
              <div className="overflow-hidden rounded-panel bg-[linear-gradient(165deg,var(--color-ice),var(--color-lavender))] p-8 pt-14 sm:p-10 sm:pt-16">
                <Image
                  src="/assets/healthcare/about/hospital.png"
                  alt="A Meridian Health hospital"
                  width={919}
                  height={419}
                  sizes="(max-width: 1024px) 90vw, 32rem"
                  className="relative h-auto w-full drop-shadow-[0_28px_44px_rgb(10_26_60/0.2)]"
                />
              </div>
              <div className="glass absolute -right-4 -bottom-6 rounded-card px-5 py-4 sm:right-6">
                <p className="font-display text-2xl font-bold text-ink">104</p>
                <p className="mt-0.5 text-xs text-ink-soft">hospitals and clinics</p>
              </div>
            </div>
          </Reveal>

          <div className="space-y-10">
            <Reveal>
              <h2 className="font-display text-2xl font-bold text-ink">Our mission</h2>
              <p className="mt-3 text-[1.0625rem] leading-relaxed text-ink-soft">
                To make good healthcare ordinary. Not exceptional, not a privilege, not something
                you fight the system for — ordinary, reliable and within reach of the people who
                need it.
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <h2 className="font-display text-2xl font-bold text-ink">Our vision</h2>
              <p className="mt-3 text-[1.0625rem] leading-relaxed text-ink-soft">
                A health system where your record follows you, your doctor has the full picture
                before you sit down, and the administration happens quietly in the background.
              </p>
            </Reveal>

            <Reveal delay={0.16}>
              <h2 className="font-display text-2xl font-bold text-ink">Our philosophy</h2>
              <p className="mt-3 text-[1.0625rem] leading-relaxed text-ink-soft">
                Technology should give clinicians more time with patients, not less. Every tool we
                build is measured against that single test.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="bg-mist py-16 lg:py-24">
        <div className="shell">
          <SectionIntro
            title="Three things we don't compromise on"
            lede="They sound obvious. Holding to them under pressure is the hard part."
          />
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {pillars.map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <Reveal key={pillar.title} delay={0.06 * i}>
                  <div className="h-full rounded-panel border hairline bg-white p-7">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[color-mix(in_oklab,var(--color-electric)_10%,white)] text-electric">
                      <Icon size={21} />
                    </span>
                    <h3 className="mt-5 text-lg font-semibold text-ink">{pillar.title}</h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">{pillar.body}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section className="relative overflow-hidden bg-[#0a1733] py-16 text-white lg:py-20">
        <span className="pointer-events-none absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-electric/20 blur-[120px]" />
        <div className="shell relative">
          <dl className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map((metric) => (
              <div key={metric.label}>
                <dd className="font-display text-[clamp(2.5rem,5vw,3.5rem)] leading-none font-bold">
                  <CountUp value={metric.value} suffix={metric.suffix} />
                </dd>
                <dt className="mt-3 text-sm text-white/60">{metric.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Team / facilities */}
      <section className="shell py-16 lg:py-24">
        <SectionIntro
          title="The people and places behind the care"
          lede="527 consultants across 104 hospitals, supported by nursing, pharmacy and diagnostics teams."
          action={<ButtonLink href="/doctors" variant="secondary">Meet our doctors</ButtonLink>}
        />

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: Users, title: "Medical team", body: "Consultants, registrars, nurses and allied health working to shared protocols across every site." },
            { icon: Building2, title: "Facilities", body: "Cath labs, imaging, day-care surgery and in-house pharmacy under one roof at our flagship hospitals." },
            { icon: Sparkles, title: "Healthcare technology", body: "One record, one booking system and one prescription trail — built in-house, used by every clinic." },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} delay={0.06 * i}>
                <div className="h-full rounded-panel bg-[linear-gradient(160deg,var(--color-ice),var(--color-lavender))] p-7">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-electric shadow-soft">
                    <Icon size={19} />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold text-ink">{item.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">{item.body}</p>
                </div>
              </Reveal>
            );
          })}
        </div>

        <p className="mt-10 rounded-card bg-mist px-5 py-4 text-xs leading-relaxed text-ink-soft">
          Meridian Health is a fictional organisation created for this product demonstration. The
          figures, hospitals and history on this page are illustrative.
        </p>
      </section>
    </div>
  );
}
