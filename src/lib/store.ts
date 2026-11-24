"use client";

import { useSyncExternalStore } from "react";

/**
 * A tiny external store backed by localStorage.
 *
 * Using an external store rather than state-in-an-effect keeps hydration
 * honest: the first client render matches the server, then the subscription
 * swaps in whatever was persisted.
 */
export function createPersistentStore<T>(key: string, initial: T) {
  let state = initial;
  let hydrated = false;
  const listeners = new Set<() => void>();

  const read = (): T => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  };

  const write = () => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {
      /* storage can be unavailable in private mode — the demo still works */
    }
  };

  const emit = () => listeners.forEach((listener) => listener());

  const subscribe = (listener: () => void) => {
    // Hydrate once, on the first subscription after mount.
    if (!hydrated) {
      hydrated = true;
      state = read();
    }
    listeners.add(listener);

    const onStorage = (event: StorageEvent) => {
      if (event.key !== key) return;
      state = read();
      emit();
    };
    window.addEventListener("storage", onStorage);

    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  };

  const get = () => state;

  const set = (updater: T | ((previous: T) => T)) => {
    state = typeof updater === "function" ? (updater as (p: T) => T)(state) : updater;
    write();
    emit();
  };

  const useStore = (): T => useSyncExternalStore(subscribe, get, () => initial);

  return { useStore, get, set, subscribe };
}
