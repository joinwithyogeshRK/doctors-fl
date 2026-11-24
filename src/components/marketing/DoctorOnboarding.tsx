"use client";

import { useState } from "react";
import { CheckCircle2, Sparkles } from "lucide-react";
import { specialties } from "@/data/specialties";
import { Button } from "@/components/ui/Button";
import { SelectField, TextAreaField, TextField } from "@/components/ui/Field";
import { Card, CardTitle } from "@/components/ui/Surfaces";
import { useToast } from "@/components/providers/ToastProvider";

interface Errors {
  name?: string;
  specialty?: string;
  clinic?: string;
  email?: string;
  phone?: string;
  experience?: string;
  city?: string;
}

export function DoctorOnboarding() {
  const { toast } = useToast();
  const [values, setValues] = useState({
    name: "",
    specialty: "",
    clinic: "",
    email: "",
    phone: "",
    experience: "",
    city: "",
    requirements: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");

  const set = (key: keyof typeof values) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => setValues((prev) => ({ ...prev, [key]: e.target.value }));

  if (state === "sent") {
    return (
      <Card className="text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[linear-gradient(140deg,var(--color-electric),var(--color-violet))] text-white">
          <Sparkles size={30} />
        </span>
        <h2 className="mt-6 font-display text-2xl font-bold text-ink">
          Thanks, {values.name.replace(/^Dr\.?\s+/i, "").split(" ")[0]}
        </h2>
        <p className="mx-auto mt-3 max-w-md text-[0.9375rem] leading-relaxed text-ink-soft">
          We&rsquo;ve got your details for {values.clinic || "your practice"}. Our onboarding team
          verifies credentials with the medical council, then builds your profile and booking page
          — usually within a week.
        </p>

        <ol className="mx-auto mt-7 max-w-sm space-y-3 text-left">
          {[
            "Credential verification with your medical council",
            "Profile, booking page and clinic dashboard set up",
            "A 30-minute walkthrough with your practice manager",
          ].map((step, i) => (
            <li key={step} className="flex items-start gap-3 rounded-card bg-mist p-3.5">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-electric text-[0.6875rem] font-bold text-white">
                {i + 1}
              </span>
              <span className="text-sm text-ink-soft">{step}</span>
            </li>
          ))}
        </ol>

        <p className="mx-auto mt-6 max-w-md rounded-xl bg-mist px-4 py-3 text-xs leading-relaxed text-ink-soft">
          This is an interactive demonstration — no enquiry was submitted and nothing was stored.
        </p>

        <Button variant="secondary" className="mt-5" onClick={() => setState("idle")}>
          Submit another enquiry
        </Button>
      </Card>
    );
  }

  return (
    <Card>
      <CardTitle>Tell us about your practice</CardTitle>
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          const next: Errors = {};
          if (values.name.trim().length < 2) next.name = "Enter your full name.";
          if (!values.specialty) next.specialty = "Choose your specialty.";
          if (values.clinic.trim().length < 2) next.clinic = "Enter your clinic or hospital name.";
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim()))
            next.email = "Enter a valid email address.";
          if (!/^[+\d][\d\s-]{8,}$/.test(values.phone.trim()))
            next.phone = "Enter a phone number with at least 9 digits.";
          const years = Number(values.experience);
          if (!values.experience || Number.isNaN(years) || years < 0 || years > 60)
            next.experience = "Enter years of experience between 0 and 60.";
          if (values.city.trim().length < 2) next.city = "Enter your city.";
          setErrors(next);
          if (Object.keys(next).length) return;

          setState("sending");
          window.setTimeout(() => {
            setState("sent");
            toast("success", "Enquiry received", "Demo only — nothing was submitted.");
          }, 1000);
        }}
        className="space-y-5"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField label="Your name" required value={values.name} error={errors.name} placeholder="Dr. Ananya Rao" onChange={set("name")} />
          <SelectField label="Specialty" required value={values.specialty} error={errors.specialty} onChange={set("specialty")}>
            <option value="">Select a specialty</option>
            {specialties.map((s) => (
              <option key={s.slug} value={s.name}>
                {s.name}
              </option>
            ))}
          </SelectField>
          <TextField label="Clinic or hospital" required value={values.clinic} error={errors.clinic} placeholder="Meridian Heart Institute" onChange={set("clinic")} />
          <TextField label="City" required value={values.city} error={errors.city} placeholder="Bengaluru" onChange={set("city")} />
          <TextField label="Email" type="email" required value={values.email} error={errors.email} placeholder="you@clinic.com" onChange={set("email")} />
          <TextField label="Phone" type="tel" required value={values.phone} error={errors.phone} placeholder="+91 98450 11234" onChange={set("phone")} />
          <TextField label="Years of experience" type="number" required min={0} max={60} value={values.experience} error={errors.experience} placeholder="12" onChange={set("experience")} />
        </div>

        <TextAreaField
          label="What do you need from your website?"
          hint="Optional"
          rows={4}
          value={values.requirements}
          placeholder="Online booking, a profile page, prescription writing, and something my front desk can actually use."
          onChange={set("requirements")}
        />

        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" size="lg" disabled={state === "sending"}>
            {state === "sending" ? (
              "Submitting…"
            ) : (
              <>
                <CheckCircle2 size={17} />
                Build my website
              </>
            )}
          </Button>
          <p className="text-xs text-ink-faint">No commitment. We reply within one working day.</p>
        </div>
      </form>
    </Card>
  );
}
