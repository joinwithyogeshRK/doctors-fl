import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  CalendarCheck,
  ClipboardCheck,
  HeartPulse,
  Home,
  Microscope,
  Pill,
  Siren,
  Video,
} from "lucide-react";
import { Breadcrumbs, PageHeader } from "@/components/ui/Surfaces";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/animations/Reveal";
import { SectionIntro } from "@/components/ui/SectionIntro";

export const metadata: Metadata = {
  title: "Our services",
  description: "Consultations, health checks, diagnostics, telemedicine, pharmacy and home care.",
};

const primary = [
  {
    icon: CalendarCheck,
    title: "In-clinic consultation",
    body: "See a consultant in person, with same-day slots held back for urgent cases.",
    href: "/appointments/book",
    cta: "Book a visit",
  },
  {
    icon: Video,
    title: "Video consultation",
    body: "Speak to a doctor from home. Browser-based, no app, prescription issued on the call.",
    href: "/consultation/demo",
    cta: "Try the demo",
  },
  {
    icon: Pill,
    title: "Pharmacy and delivery",
    body: "Prescription and over-the-counter medicines, checked by a pharmacist and delivered same day.",
    href: "/pharmacy",
    cta: "Browse the pharmacy",
  },
];

const secondary = [
  { icon: ClipboardCheck, title: "Annual health checks", body: "A focused panel that actually changes decisions, with the results explained." },
  { icon: Microscope, title: "Diagnostics and imaging", body: "Pathology, ultrasound, X-ray, CT and MRI reported by consultant radiologists." },
  { icon: HeartPulse, title: "Chronic disease care", body: "Structured programmes for diabetes, hypertension and heart disease." },
  { icon: Home, title: "Home care", body: "Nursing visits, physiotherapy and sample collection at your address." },
  { icon: Siren, title: "Emergency department", body: "Open 24 hours at our flagship hospitals, with resuscitation and trauma cover." },
  { icon: HeartPulse, title: "Preventive screening", body: "Age and risk-appropriate screening, with reminders when the next one is due." },
];

export default function ServicesPage() {
  return (
    <div className="pt-18">
      <section className="border-b hairline bg-[linear-gradient(180deg,var(--color-ice),var(--color-mist))]">
        <div className="shell py-10 lg:py-14">
          <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Services" }]} />
          <div className="mt-6">
            <PageHeader
              title="Our services"
              lede="From a fifteen-minute video call to a full cardiac workup — all of it on one record, with one booking system."
            />
          </div>
        </div>
      </section>

      {/* Three ways to be seen */}
      <section className="shell py-14 lg:py-20">
        <SectionIntro
          title="Three ways to be seen"
          lede="Pick whichever fits the day you're having."
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {primary.map((service, i) => {
            const Icon = service.icon;
            return (
              <Reveal key={service.title} delay={0.06 * i}>
                <div className="flex h-full flex-col rounded-panel bg-[linear-gradient(160deg,var(--color-ice),var(--color-lavender))] p-7">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-electric shadow-soft">
                    <Icon size={21} />
                  </span>
                  <h2 className="mt-5 font-display text-xl font-semibold text-ink">{service.title}</h2>
                  <p className="mt-2.5 flex-1 text-sm leading-relaxed text-ink-soft">{service.body}</p>
                  <ButtonLink href={service.href} size="sm" className="mt-6 self-start">
                    {service.cta}
                    <ArrowRight size={14} />
                  </ButtonLink>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Everything else */}
      <section className="bg-mist py-14 lg:py-20">
        <div className="shell">
          <SectionIntro
            title="And everything around it"
            lede="The services that make a diagnosis into a treated condition."
            action={<ButtonLink href="/contact" variant="secondary">Ask about a service</ButtonLink>}
          />

          <ul className="mt-10 grid gap-px overflow-hidden rounded-panel border hairline bg-[color-mix(in_oklab,var(--color-ink)_8%,transparent)] sm:grid-cols-2 lg:grid-cols-3">
            {secondary.map((service) => {
              const Icon = service.icon;
              return (
                <li key={service.title} className="bg-white p-6">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-[color-mix(in_oklab,var(--color-electric)_10%,white)] text-electric">
                    <Icon size={18} />
                  </span>
                  <h3 className="mt-4 font-semibold text-ink">{service.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{service.body}</p>
                </li>
              );
            })}
          </ul>

          <p className="mt-8 text-center text-sm text-ink-soft">
            Looking for a specific department?{" "}
            <Link href="/specialties" className="font-semibold text-electric hover:underline">
              Browse all twelve specialties
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
