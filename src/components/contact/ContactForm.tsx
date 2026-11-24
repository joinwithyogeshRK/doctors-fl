"use client";

import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SelectField, TextAreaField, TextField } from "@/components/ui/Field";
import { Card, CardTitle } from "@/components/ui/Surfaces";
import { useToast } from "@/components/providers/ToastProvider";

interface Errors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

export function ContactForm() {
  const { toast } = useToast();
  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Appointments",
    message: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");

  const set = (key: keyof typeof values) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => setValues((prev) => ({ ...prev, [key]: e.target.value }));

  if (state === "sent") {
    return (
      <Card className="text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[color-mix(in_oklab,var(--color-mint)_14%,white)] text-mint">
          <CheckCircle2 size={28} />
        </span>
        <h2 className="mt-5 text-xl font-semibold text-ink">Message received</h2>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink-soft">
          Our team usually replies within one working day. For anything urgent, call
          +91 80 0000 0000.
        </p>
        <p className="mx-auto mt-5 max-w-sm rounded-xl bg-mist px-4 py-3 text-xs leading-relaxed text-ink-soft">
          This is an interactive demonstration — nothing was sent.
        </p>
        <Button variant="secondary" className="mt-5" onClick={() => setState("idle")}>
          Send another message
        </Button>
      </Card>
    );
  }

  return (
    <Card>
      <CardTitle>Send us a message</CardTitle>
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          const next: Errors = {};
          if (values.name.trim().length < 2) next.name = "Enter your name.";
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim()))
            next.email = "Enter an email we can reply to.";
          if (values.phone && !/^[+\d][\d\s-]{8,}$/.test(values.phone.trim()))
            next.phone = "Enter a valid phone number, or leave it blank.";
          if (values.message.trim().length < 10) next.message = "Tell us a little more — at least 10 characters.";
          setErrors(next);
          if (Object.keys(next).length) return;

          setState("sending");
          window.setTimeout(() => {
            setState("sent");
            toast("success", "Message sent", "Demo only — nothing left your browser.");
          }, 900);
        }}
        className="space-y-5"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField label="Name" required value={values.name} error={errors.name} placeholder="Alex Fernandes" onChange={set("name")} />
          <TextField label="Email" type="email" required value={values.email} error={errors.email} placeholder="you@example.com" onChange={set("email")} />
          <TextField label="Phone" hint="Optional" type="tel" value={values.phone} error={errors.phone} placeholder="+91 98450 11234" onChange={set("phone")} />
          <SelectField label="Subject" value={values.subject} onChange={set("subject")}>
            <option>Appointments</option>
            <option>Pharmacy and delivery</option>
            <option>Billing and payments</option>
            <option>Medical records</option>
            <option>Feedback or a complaint</option>
            <option>Something else</option>
          </SelectField>
        </div>

        <TextAreaField
          label="Message"
          required
          rows={5}
          value={values.message}
          error={errors.message}
          placeholder="How can we help?"
          onChange={set("message")}
        />

        <Button type="submit" size="lg" disabled={state === "sending"}>
          {state === "sending" ? (
            "Sending…"
          ) : (
            <>
              <Send size={16} />
              Send message
            </>
          )}
        </Button>
      </form>
    </Card>
  );
}
