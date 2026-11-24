import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ShieldCheck } from "lucide-react";
import { Logo } from "@/components/layout/Logo";

export function AuthShell({
  title,
  lede,
  children,
  footer,
}: {
  title: string;
  lede: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_1.05fr]">
      {/* Form side */}
      <div className="flex min-w-0 flex-col px-5 py-8 sm:px-10 lg:px-14">
        <Logo />
        <div className="mx-auto flex w-full max-w-sm min-w-0 flex-1 flex-col justify-center py-10">
          <h1 className="font-display text-[clamp(1.75rem,4vw,2.25rem)] leading-tight font-bold text-ink">
            {title}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">{lede}</p>
          <div className="mt-8">{children}</div>
        </div>
        <div className="mx-auto w-full max-w-sm text-sm text-ink-soft">{footer}</div>
      </div>

      {/* Brand side */}
      <div className="relative hidden overflow-hidden bg-[linear-gradient(155deg,#0d1b45_0%,#23215f_52%,#3b2064_100%)] lg:block">
        <span className="absolute -top-24 -left-20 h-96 w-96 rounded-full bg-electric/30 blur-3xl" />
        <span className="absolute right-[-10%] bottom-[-10%] h-96 w-96 rounded-full bg-violet/30 blur-3xl" />

        <div className="relative flex h-full flex-col justify-between p-12 text-white xl:p-16">
          <div className="max-w-sm">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold backdrop-blur-sm">
              <ShieldCheck size={13} />
              Interactive demo
            </span>
            <p className="mt-8 font-display text-[2rem] leading-[1.15] font-bold">
              Every appointment, record and prescription in one account.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-white/65">
              Explore the platform as a patient, a doctor or an administrator. No registration,
              no real data.
            </p>
          </div>

          <div className="relative">
            <Image
              src="/assets/healthcare/hero/holographic-heart.png"
              alt=""
              width={788}
              height={927}
              sizes="20rem"
              className="pointer-events-none absolute -top-40 right-0 w-48 opacity-90 xl:w-60"
            />
            <div className="glass-dark relative max-w-xs rounded-card p-5">
              <p className="text-sm leading-relaxed text-white/85">
                &ldquo;The whole recovery plan was in one place. That made a frightening month far
                less frightening.&rdquo;
              </p>
              <p className="mt-3 text-xs text-white/55">Arvind M., Kochi · Orthopedics patient</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AuthFooterLink({
  prompt,
  label,
  href,
}: {
  prompt: string;
  label: string;
  href: string;
}) {
  return (
    <p>
      {prompt}{" "}
      <Link href={href} className="font-semibold text-electric hover:underline">
        {label}
      </Link>
    </p>
  );
}
