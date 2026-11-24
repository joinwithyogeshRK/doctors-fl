import type { Metadata } from "next";
import { Breadcrumbs, PageHeader } from "@/components/ui/Surfaces";

export const metadata: Metadata = { title: "Privacy policy" };

const sections = [
  {
    title: "What this page is",
    body: "Meridian Health is a fictional organisation created to demonstrate a healthcare platform. This page describes how patient data would be handled in a production deployment of this software. No real policy is in force, because no real data is collected.",
  },
  {
    title: "What a live deployment would collect",
    body: "Identity and contact details, appointment history, clinical notes and prescriptions written by your doctors, diagnostic reports, pharmacy orders and payment records. Each of these exists because a specific part of your care needs it.",
  },
  {
    title: "What this demonstration actually stores",
    body: "Only what your browser keeps. Your cart, any bookings you make while exploring, saved doctors and notification states live in this browser's local storage and never leave your device. Clearing site data or using the reset control in Settings removes all of it.",
  },
  {
    title: "Who would see your record",
    body: "The clinicians directly involved in your care, the pharmacy team when dispensing against a prescription, and the administrative staff who need to arrange your appointment or billing. Access would be role-based and logged.",
  },
  {
    title: "How long data would be kept",
    body: "Clinical records for the period required by medical record retention rules in your jurisdiction; payment records for the statutory accounting period; everything else only for as long as it serves the purpose it was collected for.",
  },
  {
    title: "Your rights",
    body: "To see your record, to have errors corrected, to receive a copy in a portable format, to withdraw consent where processing relies on it, and to complain to the relevant supervisory authority. A production deployment would need to honour all of these.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="pt-18">
      <div className="shell py-10 lg:py-16">
        <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Privacy" }]} />
        <div className="mx-auto mt-6 max-w-2xl">
          <PageHeader
            title="Privacy policy"
            lede="How patient data would be handled if this platform were deployed for a real practice."
          />

          <div className="mt-10 space-y-8">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="font-display text-xl font-semibold text-ink">{section.title}</h2>
                <p className="mt-2.5 text-[1.0625rem] leading-relaxed text-ink-soft">{section.body}</p>
              </section>
            ))}
          </div>

          <p className="mt-10 rounded-card bg-mist px-5 py-4 text-xs leading-relaxed text-ink-soft">
            This document is illustrative and is not legal advice. A real deployment would need a
            policy drafted for its jurisdiction and reviewed by a qualified data protection adviser.
          </p>
        </div>
      </div>
    </div>
  );
}
