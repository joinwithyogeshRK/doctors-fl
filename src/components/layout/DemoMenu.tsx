"use client";

import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, Pill, Shield, Sparkles, Stethoscope, UserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { demoAccounts, signInAs } from "@/store/session";
import { useToast } from "@/components/providers/ToastProvider";
import type { DemoRole } from "@/types";

const entries: {
  label: string;
  detail: string;
  icon: typeof UserRound;
  role?: DemoRole;
  href?: string;
}[] = [
  {
    label: "Explore as a patient",
    detail: "Appointments, records and orders",
    icon: UserRound,
    role: "patient",
  },
  {
    label: "Explore as a doctor",
    detail: "Clinic schedule and prescriptions",
    icon: Stethoscope,
    role: "doctor",
  },
  {
    label: "Explore the pharmacy",
    detail: "Catalogue, cart and delivery",
    icon: Pill,
    href: "/pharmacy",
  },
  {
    label: "Explore as an admin",
    detail: "Platform analytics and management",
    icon: Shield,
    role: "admin",
  },
];

/** The unobtrusive demo badge and its entry points. */
export function DemoMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="Interactive demo options"
        className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-[color-mix(in_oklab,var(--color-violet)_30%,transparent)] bg-[color-mix(in_oklab,var(--color-violet)_8%,white)] px-3 text-xs font-semibold whitespace-nowrap text-indigo transition-colors hover:bg-[color-mix(in_oklab,var(--color-violet)_14%,white)]"
      >
        <Sparkles size={13} />
        <span className="hidden sm:inline">Demo</span>
        <ChevronDown size={12} className={open ? "rotate-180 transition-transform" : "transition-transform"} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 z-50 mt-2 w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-card border hairline bg-white shadow-float"
          >
            <div className="border-b hairline px-4 py-3">
              <p className="text-sm font-semibold text-ink">Explore without an account</p>
              <p className="mt-0.5 text-xs text-ink-faint">
                Demo accounts with fictional data. Nothing is saved to a server.
              </p>
            </div>

            <ul className="p-1.5">
              {entries.map((entry) => {
                const Icon = entry.icon;
                return (
                  <li key={entry.label}>
                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        if (entry.role) {
                          signInAs(entry.role);
                          toast("success", `Signed in as ${demoAccounts[entry.role].name}`, "Demo account");
                          router.push(demoAccounts[entry.role].home);
                        } else if (entry.href) {
                          router.push(entry.href);
                        }
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-ice"
                    >
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-ice text-electric">
                        <Icon size={16} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-ink">{entry.label}</span>
                        <span className="block truncate text-xs text-ink-faint">{entry.detail}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
