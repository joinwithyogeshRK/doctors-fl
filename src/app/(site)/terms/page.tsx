import type { Metadata } from "next";
import { Breadcrumbs, PageHeader } from "@/components/ui/Surfaces";

export const metadata: Metadata = { title: "Terms of use" };

const sections = [
  {
    title: "This is a demonstration",
    body: "Meridian Health is a fictional organisation. Every doctor, hospital, patient, review, product and price shown on this site is invented for the purpose of demonstrating software. Nothing here constitutes a real service.",
  },
  {
    title: "No medical advice",
    body: "Nothing on this site is medical advice, a diagnosis, or a treatment recommendation, and it is not a substitute for consulting a qualified healthcare professional who knows your history. Never disregard professional advice because of something you read here.",
  },
  {
    title: "No emergency cover",
    body: "This site is not monitored in real time and places no calls on your behalf. If you are experiencing a medical emergency, contact your local emergency service immediately.",
  },
  {
    title: "No real transactions",
    body: "Appointments booked here are not made with any clinic. Payments are simulated and no payment provider is contacted. Medicine orders are not dispensed and nothing is delivered.",
  },
  {
    title: "Acceptable use",
    body: "Use the demonstration to evaluate the software. Do not enter real personal or clinical information about yourself or anyone else — there is no need to, and this demonstration is not built to protect it.",
  },
  {
    title: "Liability",
    body: "The software is provided as-is for evaluation. A production deployment would carry its own terms, drafted for the operating practice and its jurisdiction.",
  },
];

export default function TermsPage() {
  return (
    <div className="pt-18">
      <div className="shell py-10 lg:py-16">
        <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Terms" }]} />
        <div className="mx-auto mt-6 max-w-2xl">
          <PageHeader title="Terms of use" lede="What this site is, and what it very much is not." />

          <div className="mt-10 space-y-8">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="font-display text-xl font-semibold text-ink">{section.title}</h2>
                <p className="mt-2.5 text-[1.0625rem] leading-relaxed text-ink-soft">{section.body}</p>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
