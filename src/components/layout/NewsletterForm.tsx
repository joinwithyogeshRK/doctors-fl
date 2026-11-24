"use client";

import { ArrowRight, Check } from "lucide-react";
import { useState } from "react";
import { cx } from "@/lib/format";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setError("Enter an email address we can reach you at.");
      return;
    }
    setError(null);
    setDone(true);
  };

  if (done) {
    return (
      <p className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3 text-sm text-white/85">
        <Check size={16} className="text-mint" />
        You&rsquo;re on the list. This is a demo, so no email was stored.
      </p>
    );
  }

  return (
    <form onSubmit={submit} noValidate>
      <div className="flex gap-2">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "newsletter-error" : undefined}
          className={cx(
            "min-w-0 flex-1 rounded-xl border bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/45 focus:outline-none",
            error ? "border-coral" : "border-white/18 focus:border-white/45",
          )}
        />
        <button
          type="submit"
          aria-label="Subscribe"
          className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white text-electric transition-transform hover:-translate-y-0.5"
        >
          <ArrowRight size={18} />
        </button>
      </div>
      {error && (
        <p id="newsletter-error" className="mt-2 text-xs text-coral">
          {error}
        </p>
      )}
    </form>
  );
}
