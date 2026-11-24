import Image from "next/image";
import type { Metadata } from "next";
import {
  BarChart3,
  CalendarCheck,
  CreditCard,
  Globe,
  MessageCircle,
  Palette,
  Pill,
  ScrollText,
  Star,
  Stethoscope,
  UserRound,
  Users,
  Video,
} from "lucide-react";
import { DoctorOnboarding } from "@/components/marketing/DoctorOnboarding";
import { Breadcrumbs } from "@/components/ui/Surfaces";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/animations/Reveal";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { EcgLine } from "@/components/animations/EcgLine";

export const metadata: Metadata = {
  title: "For doctors",
  description:
    "Everything your patients need to discover, trust and connect with your practice — in one beautifully designed platform.",
};

const features = [
  { icon: Globe, title: "Custom doctor website", body: "Your own site on your own domain, built around your practice." },
  { icon: UserRound, title: "Personal doctor profile", body: "Credentials, expertise, languages and reviews in one place." },
  { icon: CalendarCheck, title: "Appointment booking", body: "Patients book real slots against your live availability." },
  { icon: Video, title: "Video consultation", body: "Browser-based calls with chat, notes and a prescription panel." },
  { icon: ScrollText, title: "Digital prescriptions", body: "Write, print and send prescriptions in under a minute." },
  { icon: Users, title: "Patient management", body: "History, allergies, medication and notes at a glance." },
  { icon: Pill, title: "Medicine integrations", body: "Send a prescription straight to the pharmacy cart." },
  { icon: CreditCard, title: "Online payment", body: "UPI, cards and net banking, or pay at the clinic." },
  { icon: Star, title: "Patient reviews", body: "Collected after consultations, with your right of reply." },
  { icon: BarChart3, title: "Appointment analytics", body: "Load, revenue and satisfaction, month by month." },
  { icon: MessageCircle, title: "WhatsApp contact", body: "A contact button patients already know how to use." },
  { icon: Palette, title: "Clinic branding", body: "Your colours, your logo, your tone of voice." },
];

export default function ForDoctorsPage() {
  return (
    <div className="pt-18">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[linear-gradient(155deg,#0d1b45_0%,#23215f_52%,#3b2064_100%)] text-white">
        <span className="pointer-events-none absolute -top-32 -left-24 h-[30rem] w-[30rem] rounded-full bg-electric/30 blur-[120px]" />
        <span className="pointer-events-none absolute right-[-8%] -bottom-24 h-[26rem] w-[26rem] rounded-full bg-violet/30 blur-[120px]" />
        <EcgLine
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24 w-full opacity-25"
          stroke="var(--color-electric-light)"
          speed={5}
        />

        <div className="shell relative py-10 lg:py-16">
          <div className="[&_a]:text-white/60 [&_span]:text-white/40">
            <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "For doctors" }]} />
          </div>

          <div className="mt-8 grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold backdrop-blur-sm">
                <Stethoscope size={13} />
                For practices of any size
              </span>

              <h1 className="mt-6 font-display text-[clamp(2.25rem,6vw,3.75rem)] leading-[0.98] font-bold">
                Your practice.
                <br />
                <span className="bg-[linear-gradient(104deg,#9bc0ff,#c4a8ff)] bg-clip-text text-transparent">
                  Your digital presence.
                </span>
              </h1>

              <p className="mt-6 max-w-lg text-[1.0625rem] leading-relaxed text-white/70">
                Everything your patients need to discover, trust, and connect with your practice —
                in one beautifully designed platform.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href="#onboarding" size="lg" className="bg-white !text-electric hover:!text-electric-dark">
                  Build my website
                </ButtonLink>
                <ButtonLink href="/doctor/dashboard" variant="onDark" size="lg">
                  See the demo
                </ButtonLink>
              </div>

              <dl className="mt-10 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/12 pt-6">
                {[
                  { value: "7 days", label: "to go live" },
                  { value: "527", label: "doctors on the platform" },
                  { value: "4.9/5", label: "practice satisfaction" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <dd className="font-display text-2xl font-bold">{stat.value}</dd>
                    <dt className="mt-0.5 text-[0.8125rem] text-white/55">{stat.label}</dt>
                  </div>
                ))}
              </dl>
            </div>

            <div className="relative hidden lg:block">
              <Image
                src="/assets/healthcare/appointment/calendar.png"
                alt=""
                width={840}
                height={900}
                sizes="20rem"
                className="mx-auto w-60 rotate-[-6deg] drop-shadow-[0_30px_50px_rgb(10_26_60/0.5)] xl:w-72"
              />
              <div className="glass-dark absolute bottom-4 -left-2 w-52 rounded-card p-4">
                <p className="text-xs text-white/55">Today</p>
                <p className="mt-1 font-display text-lg font-semibold">14 appointments</p>
                <p className="mt-1 text-[0.6875rem] text-white/45">9 in clinic · 5 by video</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="shell py-16 lg:py-24">
        <SectionIntro
          title="Everything a modern practice runs on"
          lede="Not a brochure site. A working system your front desk, your patients and you all use every day."
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <Reveal key={feature.title} delay={0.03 * (i % 6)}>
                <div className="h-full rounded-card border hairline bg-white p-5 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lift">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-[color-mix(in_oklab,var(--color-electric)_10%,white)] text-electric">
                    <Icon size={18} />
                  </span>
                  <h3 className="mt-4 font-semibold text-ink">{feature.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{feature.body}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Onboarding form */}
      <section id="onboarding" className="scroll-mt-24 bg-mist py-16 lg:py-24">
        <div className="shell">
          <div className="mx-auto max-w-3xl">
            <SectionIntro
              align="center"
              title="Let's get your practice online"
              lede="Tell us a little about your clinic and we'll come back with a plan and a date."
            />
            <div className="mt-10">
              <DoctorOnboarding />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
