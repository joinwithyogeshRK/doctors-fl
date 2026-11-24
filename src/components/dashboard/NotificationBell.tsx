"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Bell, CalendarCheck, CheckCheck, CreditCard, Package, Pill } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cx } from "@/lib/format";
import { markAllRead, markRead, useNotifications } from "@/store/notifications";
import type { NotificationKind } from "@/types";

const icons: Record<NotificationKind, typeof Bell> = {
  appointment: CalendarCheck,
  order: Package,
  prescription: Pill,
  payment: CreditCard,
};

const tints: Record<NotificationKind, string> = {
  appointment: "bg-[color-mix(in_oklab,var(--color-electric)_12%,white)] text-electric",
  order: "bg-[color-mix(in_oklab,var(--color-violet)_12%,white)] text-violet",
  prescription: "bg-[color-mix(in_oklab,var(--color-mint)_14%,white)] text-mint",
  payment: "bg-[color-mix(in_oklab,var(--color-amber)_18%,white)] text-[#8a5a00]",
};

export function NotificationBell({ tone = "light" }: { tone?: "light" | "dark" }) {
  const { items, unread } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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
        aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}
        aria-expanded={open}
        className={cx(
          "relative grid h-10 w-10 place-items-center rounded-full transition-colors",
          tone === "dark"
            ? "text-white/70 hover:bg-white/10 hover:text-white"
            : "text-ink-soft hover:bg-ice hover:text-ink",
        )}
      >
        <Bell size={18} />
        {unread > 0 && (
          <span className="absolute top-1.5 right-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-coral px-1 text-[0.625rem] font-bold text-white ring-2 ring-white">
            {unread}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 z-50 mt-2 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-card border hairline bg-white shadow-float"
          >
            <div className="flex items-center justify-between border-b hairline px-4 py-3">
              <p className="text-sm font-semibold text-ink">Notifications</p>
              {unread > 0 && (
                <button
                  type="button"
                  onClick={markAllRead}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-electric hover:underline"
                >
                  <CheckCheck size={13} />
                  Mark all read
                </button>
              )}
            </div>

            <ul className="max-h-[22rem] divide-y divide-[color-mix(in_oklab,var(--color-ink)_7%,transparent)] overflow-y-auto">
              {items.slice(0, 8).map((item) => {
                const Icon = icons[item.kind];
                return (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      onClick={() => {
                        markRead(item.id);
                        setOpen(false);
                      }}
                      className={cx(
                        "flex gap-3 px-4 py-3.5 transition-colors hover:bg-mist",
                        !item.read && "bg-[color-mix(in_oklab,var(--color-electric)_4%,white)]",
                      )}
                    >
                      <span className={cx("grid h-9 w-9 shrink-0 place-items-center rounded-xl", tints[item.kind])}>
                        <Icon size={16} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span className="truncate text-sm font-semibold text-ink">{item.title}</span>
                          {!item.read && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-electric" />}
                        </span>
                        <span className="mt-0.5 block text-xs leading-relaxed text-ink-soft">{item.body}</span>
                        <span className="mt-1 block text-[0.6875rem] text-ink-faint">{item.time}</span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            <Link
              href="/notifications"
              onClick={() => setOpen(false)}
              className="block border-t hairline bg-mist px-4 py-3 text-center text-sm font-semibold text-electric transition-colors hover:bg-ice"
            >
              View all notifications
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
