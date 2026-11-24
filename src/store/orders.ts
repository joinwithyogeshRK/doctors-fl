"use client";

import { createPersistentStore } from "@/lib/store";
import { orders as seedOrders } from "@/data/orders";
import type { Order, OrderStage } from "@/types";

const store = createPersistentStore<Order[]>("mh.orders", seedOrders);

export const stageOrder: OrderStage[] = [
  "placed",
  "confirmed",
  "preparing",
  "verified",
  "packed",
  "out-for-delivery",
  "delivered",
];

export function placeOrder(order: Order) {
  store.set((prev) => [order, ...prev]);
}

export function advanceOrder(id: string) {
  store.set((prev) =>
    prev.map((order) => {
      if (order.id !== id) return order;
      const next = stageOrder[Math.min(stageOrder.length - 1, stageOrder.indexOf(order.stage) + 1)];
      return { ...order, stage: next };
    }),
  );
}

export function resetOrder(id: string) {
  store.set((prev) => prev.map((o) => (o.id === id ? { ...o, stage: "placed" } : o)));
}

export function useOrders(): Order[] {
  return store.useStore();
}
