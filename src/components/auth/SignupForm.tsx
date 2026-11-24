"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/Field";
import { signInAs } from "@/store/session";
import { useToast } from "@/components/providers/ToastProvider";
import { cx } from "@/lib/format";

interface Errors {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirm?: string;
  terms?: string;
}

function strength(password: string): { score: number; label: string } {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return { score, label: ["Too short", "Weak", "Fair", "Good", "Strong"][score] };
}

export function SignupForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
  });
  const [terms, setTerms] = useState(false);
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);

  const meter = strength(values.password);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Errors = {};
    if (values.name.trim().length < 2) next.name = "Enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim()))
      next.email = "Enter a valid email address.";
    if (!/^[+\d][\d\s-]{8,}$/.test(values.phone.trim()))
      next.phone = "Enter a phone number with at least 9 digits.";
    if (values.password.length < 8) next.password = "Use at least 8 characters.";
    if (values.confirm !== values.password) next.confirm = "Passwords don't match.";
    if (!terms) next.terms = "Please accept the terms to continue.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setBusy(true);
    window.setTimeout(() => {
      signInAs("patient");
      toast("success", "Account created", "Demo account — nothing was stored.");
      router.push("/patient/dashboard");
    }, 900);
  };

  const set = (key: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setValues((prev) => ({ ...prev, [key]: e.target.value }));

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <TextField label="Full name" required value={values.name} error={errors.name} placeholder="Alex Fernandes" onChange={set("name")} />
      <TextField label="Email" type="email" required value={values.email} error={errors.email} placeholder="you@example.com" onChange={set("email")} />
      <TextField label="Phone" type="tel" required value={values.phone} error={errors.phone} placeholder="+91 98450 11234" onChange={set("phone")} />

      <div className="relative">
        <TextField
          label="Password"
          type={show ? "text" : "password"}
          required
          value={values.password}
          error={errors.password}
          placeholder="At least 8 characters"
          onChange={set("password")}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute top-[2.1rem] right-3 grid h-8 w-8 place-items-center rounded-lg text-ink-faint transition-colors hover:bg-ice hover:text-ink"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
        {values.password && (
          <div className="mt-2 flex items-center gap-2">
            <div className="flex flex-1 gap-1">
              {[1, 2, 3, 4].map((i) => (
                <span
                  key={i}
                  className={cx(
                    "h-1 flex-1 rounded-full transition-colors",
                    i <= meter.score
                      ? meter.score <= 1
                        ? "bg-coral"
                        : meter.score === 2
                          ? "bg-amber"
                          : "bg-mint"
                      : "bg-ice",
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-ink-faint">{meter.label}</span>
          </div>
        )}
      </div>

      <TextField
        label="Confirm password"
        type={show ? "text" : "password"}
        required
        value={values.confirm}
        error={errors.confirm}
        placeholder="Repeat your password"
        onChange={set("confirm")}
      />

      <div>
        <label className="flex cursor-pointer items-start gap-2.5 text-sm text-ink-soft">
          <input
            type="checkbox"
            checked={terms}
            onChange={(e) => setTerms(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-[var(--color-electric)]"
          />
          <span>
            I agree to the terms of use and privacy policy. I understand this is a demonstration
            and my details are not stored.
          </span>
        </label>
        {errors.terms && <p className="mt-1.5 text-xs text-coral">{errors.terms}</p>}
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={busy}>
        {busy ? (
          "Creating account…"
        ) : (
          <>
            <Check size={17} />
            Create account
          </>
        )}
      </Button>
    </form>
  );
}
