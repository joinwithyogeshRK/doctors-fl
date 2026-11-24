"use client";

import { useSyncExternalStore } from "react";

const noSubscribe = () => () => {};

/**
 * Client-only value: reading the clock during prerender is not allowed with
 * Cache Components, and a hard-coded year goes stale.
 */
export function CurrentYear() {
  const year = useSyncExternalStore(
    noSubscribe,
    () => String(new Date().getFullYear()),
    () => "",
  );
  return <>{year}</>;
}
