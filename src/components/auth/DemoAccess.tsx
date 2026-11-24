"use client";

import { useRouter } from "next/navigation";
import { Shield, Stethoscope, UserRound } from "lucide-react";
import { demoAccounts, signInAs } from "@/store/session";
import { useToast } from "@/components/providers/ToastProvider";
import type { DemoRole } from "@/types";

const icons = { patient: UserRound, doctor: Stethoscope, admin: Shield };

export function DemoAccess({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const { toast } = useToast();

  const enter = (role: DemoRole) => {
    signInAs(role);
    toast("success", `Signed in as ${demoAccounts[role].name}`, "Demo account — no real data.");
    router.push(demoAccounts[role].home);
  };

  return (
    <div>
      {!compact && (
        <div className="mb-4 flex items-center gap-3">
          <span className="h-px flex-1 bg-[color-mix(in_oklab,var(--color-ink)_10%,transparent)]" />
          <span className="text-xs font-medium text-ink-faint">or explore without an account</span>
          <span className="h-px flex-1 bg-[color-mix(in_oklab,var(--color-ink)_10%,transparent)]" />
        </div>
      )}

      <div className="grid gap-2">
        {(Object.keys(demoAccounts) as DemoRole[]).map((role) => {
          const Icon = icons[role];
          const account = demoAccounts[role];
          return (
            <button
              key={role}
              type="button"
              onClick={() => enter(role)}
              className="group flex items-center gap-3 rounded-card border hairline bg-white p-3.5 text-left transition-all hover:-translate-y-0.5 hover:border-electric/50 hover:shadow-soft"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-ice text-electric transition-colors group-hover:bg-electric group-hover:text-white">
                <Icon size={18} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-ink">
                  Continue as {role}
                </span>
                <span className="block truncate text-xs text-ink-faint">{account.blurb}</span>
              </span>
            </button>
          );
        })}
      </div>

      <p className="mt-4 rounded-xl bg-mist px-4 py-3 text-xs leading-relaxed text-ink-soft">
        These are demonstration accounts filled with fictional data. Nothing you do here affects a
        real patient record.
      </p>
    </div>
  );
}
