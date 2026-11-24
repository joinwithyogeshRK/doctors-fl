"use client";

import { createPersistentStore } from "@/lib/store";
import { seedNotifications } from "@/data/notifications";
import type { AppNotification } from "@/types";

const store = createPersistentStore<AppNotification[]>("mh.notifications", seedNotifications);

export function markRead(id: string) {
  store.set((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
}

export function markAllRead() {
  store.set((prev) => prev.map((n) => ({ ...n, read: true })));
}

export function pushNotification(notification: AppNotification) {
  store.set((prev) => [notification, ...prev]);
}

export function resetNotifications() {
  store.set(seedNotifications);
}

export function useNotifications() {
  const items = store.useStore();
  return { items, unread: items.filter((n) => !n.read).length };
}
