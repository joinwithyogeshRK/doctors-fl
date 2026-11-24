"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, LogOut, Menu, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { cx } from "@/lib/format";
import { Logo } from "@/components/layout/Logo";
import { NotificationBell } from "@/components/dashboard/NotificationBell";
import { portalNav, roleLabel } from "@/components/dashboard/portalNav";
import { demoAccounts, signOut, useSession } from "@/store/session";
import { useToast } from "@/components/providers/ToastProvider";
import type { DemoRole } from "@/types";

export function PortalShell({ role, children }: { role: DemoRole; children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const session = useSession();
  const { toast } = useToast();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = portalNav[role];
  const account = demoAccounts[role];
  const displayName = session.role === role ? session.name : account.name;

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const leave = () => {
    signOut();
    toast("info", "Signed out of the demo");
    router.push("/");
  };

  const sidebar = (
    <nav className="flex h-full flex-col" aria-label={roleLabel[role]}>
      <div className="px-4 py-5">
        <Logo tone="dark" />
      </div>

      <div className="px-4 pb-4">
        <div className="rounded-card bg-white/[0.06] p-3">
          <p className="text-[0.6875rem] font-semibold tracking-wide text-electric-light">
            {roleLabel[role]}
          </p>
          <p className="mt-1 truncate text-sm font-semibold text-white">{displayName}</p>
          <p className="mt-0.5 truncate text-[0.6875rem] text-white/45">Demo account</p>
        </div>
      </div>

      <ul className="flex-1 space-y-0.5 overflow-y-auto px-3 pb-4">
        {links.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href;
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setMenuOpen(false)}
                aria-current={active ? "page" : undefined}
                className={cx(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-white/12 text-white"
                    : "text-white/55 hover:bg-white/[0.06] hover:text-white",
                )}
              >
                <Icon size={17} className="shrink-0" />
                <span className="truncate">{link.label}</span>
                {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-electric-light" />}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="space-y-1 border-t border-white/10 p-3">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/55 transition-colors hover:bg-white/[0.06] hover:text-white"
        >
          <ChevronLeft size={17} />
          Back to website
        </Link>
        <button
          type="button"
          onClick={leave}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/55 transition-colors hover:bg-white/[0.06] hover:text-white"
        >
          <LogOut size={17} />
          Sign out
        </button>
      </div>
    </nav>
  );

  const primary = links.filter((l) => l.primary).slice(0, 4);

  return (
    <div className="min-h-screen bg-mist">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 bg-[#0a1733] lg:block">{sidebar}</aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 350, damping: 36 }}
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              className="absolute inset-y-0 left-0 w-[min(17rem,85vw)] bg-[#0a1733]"
            >
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="absolute top-4 right-3 z-10 grid h-9 w-9 place-items-center rounded-full text-white/60 hover:bg-white/10 hover:text-white"
              >
                <X size={18} />
              </button>
              {sidebar}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 border-b hairline bg-white/85 backdrop-blur-xl">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="grid h-10 w-10 place-items-center rounded-full text-ink transition-colors hover:bg-ice lg:hidden"
            >
              <Menu size={20} />
            </button>

            <div className="relative hidden max-w-sm flex-1 sm:block">
              <Search size={16} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-ink-faint" />
              <input
                type="search"
                placeholder="Search"
                aria-label="Search the portal"
                className="h-10 w-full rounded-full border hairline bg-mist pr-4 pl-9 text-sm text-ink placeholder:text-ink-faint focus:border-electric focus:bg-white focus:outline-none"
              />
            </div>

            <div className="ml-auto flex items-center gap-1">
              <span className="mr-2 hidden rounded-full bg-ice px-3 py-1.5 text-[0.6875rem] font-semibold text-ink-soft sm:inline-flex">
                Interactive demo
              </span>
              <NotificationBell />
              <span className="ml-1 grid h-9 w-9 place-items-center rounded-full bg-[linear-gradient(140deg,var(--color-electric),var(--color-violet))] text-xs font-bold text-white">
                {displayName
                  .replace(/^Dr\.?\s+/i, "")
                  .split(" ")
                  .map((p) => p[0])
                  .slice(0, 2)
                  .join("")}
              </span>
            </div>
          </div>
        </header>

        <div className="px-4 pt-6 pb-24 sm:px-6 lg:pb-10">{children}</div>
      </div>

      {/* Mobile bottom bar */}
      <nav
        aria-label="Portal sections"
        className="fixed inset-x-0 bottom-0 z-40 border-t hairline bg-white/92 backdrop-blur-xl lg:hidden"
      >
        <ul className="grid grid-cols-4">
          {primary.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cx(
                    "flex flex-col items-center gap-1 py-2.5 text-[0.625rem] font-semibold transition-colors",
                    active ? "text-electric" : "text-ink-faint",
                  )}
                >
                  <Icon size={19} />
                  <span className="max-w-full truncate px-1">{link.label.split(" ").pop()}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
