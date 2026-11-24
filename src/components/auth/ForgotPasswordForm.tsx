"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/Field";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>();
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  if (sent) {
    return (
      <div>
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[color-mix(in_oklab,var(--color-mint)_14%,white)] text-mint">
          <MailCheck size={26} />
        </span>
        <h2 className="mt-5 text-lg font-semibold text-ink">Check your inbox</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          If an account exists for <span className="font-medium text-ink">{email}</span>, a reset
          link is on its way. It expires in 30 minutes.
        </p>
        <p className="mt-4 rounded-xl bg-mist px-4 py-3 text-xs leading-relaxed text-ink-soft">
          This is a demonstration — no email was sent.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => setSent(false)}>
            Use a different address
          </Button>
          <Link
            href="/auth/login"
            className="inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold text-ink-soft transition-colors hover:text-electric"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
          setError("Enter the email address on your account.");
          return;
        }
        setError(undefined);
        setBusy(true);
        window.setTimeout(() => setSent(true), 800);
      }}
      className="space-y-5"
    >
      <TextField
        label="Email"
        type="email"
        required
        value={email}
        error={error}
        placeholder="you@example.com"
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button type="submit" size="lg" className="w-full" disabled={busy}>
        {busy ? "Sending…" : "Send reset link"}
      </Button>
      <Link
        href="/auth/login"
        className="inline-flex items-center gap-2 text-sm font-semibold text-ink-soft transition-colors hover:text-electric"
      >
        <ArrowLeft size={15} />
        Back to sign in
      </Link>
    </form>
  );
}
