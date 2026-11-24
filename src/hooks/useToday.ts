"use client";

import { useSyncExternalStore } from "react";

const noSubscribe = () => () => {};

/**
 * Today's date as YYYY-MM-DD, resolved on the client only.
 * Reading the clock during prerender is not allowed with Cache Components,
 * so this returns null on the server and on the hydrating render.
 */
export function useTodayIso(): string | null {
  return useSyncExternalStore(
    noSubscribe,
    () => {
      const now = new Date();
      const month = `${now.getMonth() + 1}`.padStart(2, "0");
      const day = `${now.getDate()}`.padStart(2, "0");
      return `${now.getFullYear()}-${month}-${day}`;
    },
    () => null,
  );
}

export function isoToParts(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return { year, month: month - 1, day };
}

export function toIso(year: number, month: number, day: number): string {
  return `${year}-${`${month + 1}`.padStart(2, "0")}-${`${day}`.padStart(2, "0")}`;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function monthLabel(year: number, month: number): string {
  return `${MONTHS[month]} ${year}`;
}

export function formatLongDate(iso: string): string {
  const { year, month, day } = isoToParts(iso);
  const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
    new Date(Date.UTC(year, month, day)).getUTCDay()
  ];
  return `${weekday}, ${day} ${MONTHS[month].slice(0, 3)} ${year}`;
}

/** "Good morning" / "Good afternoon" / "Good evening", resolved client-side. */
export function useGreeting(): string {
  return useSyncExternalStore(
    noSubscribe,
    () => {
      const hour = new Date().getHours();
      if (hour < 12) return "Good morning";
      if (hour < 17) return "Good afternoon";
      return "Good evening";
    },
    () => "Hello",
  );
}
