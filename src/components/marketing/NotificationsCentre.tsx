"use client";

import Link from "next/link";
import { useState } from "react";
import { BellOff, CalendarCheck, CheckCheck, CreditCard, Package, Pill } from "lucide-react";
import { cx } from "@/lib/format";
import { markAllRead, markRead, useNotifications } from "@/store/notifications";
import { Card, EmptyState, PageHeader } from "@/components/ui/Surfaces";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/providers/ToastProvider";
import type { NotificationKind } from "@/types";

const icons: Record<NotificationKind, typeof CalendarCheck> = {
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

const filters: { id: "all" | "unread" | NotificationKind; label: string }[] = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
  { id: "appointment", label: "Appointments" },
  { id: "order", label: "Orders" },
  { id: "prescription", label: "Prescriptions" },
  { id: "payment", label: "Payments" },
];

export function NotificationsCentre() {
  const { items, unread } = useNotifications();
  const { toast } = useToast();
  const [filter, setFilter] = useState<(typeof filters)[number]["id"]>("all");

  const visible = items.filter((item) => {
    if (filter === "all") return true;
    if (filter === "unread") return !item.read;
    return item.kind === filter;
  });

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Notifications"
        lede={unread ? `${unread} unread of ${items.length}.` : "You're all caught up."}
        action={
          unread > 0 ? (
            <Button
              variant="secondary"
              onClick={() => {
                markAllRead();
                toast("success", "All notifications marked read");
              }}
            >
              <CheckCheck size={16} />
              Mark all read
            </Button>
          ) : undefined
        }
      />

      <div className="no-scrollbar mt-7 -mx-1 flex gap-1.5 overflow-x-auto px-1">
        {filters.map((option) => {
          const count =
            option.id === "all"
              ? items.length
              : option.id === "unread"
                ? unread
                : items.filter((i) => i.kind === option.id).length;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setFilter(option.id)}
              aria-pressed={filter === option.id}
              className={cx(
                "shrink-0 rounded-chip px-3.5 py-2 text-xs font-semibold transition-colors",
                filter === option.id ? "bg-electric text-white" : "bg-white text-ink-soft shadow-soft hover:bg-ice",
              )}
            >
              {option.label}
              <span className={cx("ml-1.5 tnum", filter === option.id ? "text-white/70" : "text-ink-faint")}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            icon={<BellOff size={22} />}
            title={filter === "unread" ? "Nothing unread" : "No notifications here"}
            body="New appointment confirmations, order updates and prescriptions will appear in this list."
          />
        </div>
      ) : (
        <Card className="mt-5" padded={false}>
          <ul className="divide-y divide-[color-mix(in_oklab,var(--color-ink)_7%,transparent)]">
            {visible.map((item) => {
              const Icon = icons[item.kind];
              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    onClick={() => markRead(item.id)}
                    className={cx(
                      "flex gap-4 p-5 transition-colors hover:bg-mist",
                      !item.read && "bg-[color-mix(in_oklab,var(--color-electric)_4%,white)]",
                    )}
                  >
                    <span className={cx("grid h-11 w-11 shrink-0 place-items-center rounded-xl", tints[item.kind])}>
                      <Icon size={19} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-ink">{item.title}</span>
                        {!item.read && (
                          <span className="rounded-full bg-electric px-2 py-0.5 text-[0.625rem] font-bold text-white">
                            New
                          </span>
                        )}
                      </span>
                      <span className="mt-1 block text-sm leading-relaxed text-ink-soft">{item.body}</span>
                      <span className="mt-1.5 block text-xs text-ink-faint">{item.time}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Card>
      )}
    </div>
  );
}
