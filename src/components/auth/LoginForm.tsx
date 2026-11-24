"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/Field";
import { signInAs } from "@/store/session";
import { useToast } from "@/components/providers/ToastProvider";
import { SocialRow } from "@/components/auth/SocialRow";

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [busy, setBusy] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) next.email = "Enter a valid email address.";
    if (password.length < 6) next.password = "Passwords are at least 6 characters.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setBusy(true);
    window.setTimeout(() => {
      signInAs("patient");
      toast("success", "Signed in", "Demo account — no credentials were checked.");
      router.push("/patient/dashboard");
    }, 800);
  };

  return (
    <>
      <form onSubmit={submit} noValidate className="space-y-5">
        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          error={errors.email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="relative">
          <TextField
            label="Password"
            type={show ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            error={errors.password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Hide password" : "Show password"}
            className="absolute top-[2.1rem] right-3 grid h-8 w-8 place-items-center rounded-lg text-ink-faint transition-colors hover:bg-ice hover:text-ink"
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-ink-soft">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 accent-[var(--color-electric)]"
            />
            Remember me
          </label>
          <Link href="/auth/forgot-password" className="text-sm font-semibold text-electric hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={busy}>
          {busy ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <SocialRow />
    </>
  );
}
