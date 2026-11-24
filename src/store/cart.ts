"use client";

import { createPersistentStore } from "@/lib/store";
import { coupons, medicineById } from "@/data/medicines";
import type { CartLine } from "@/types";

interface CartState {
  lines: CartLine[];
  coupon: string | null;
}

const store = createPersistentStore<CartState>("mh.cart", { lines: [], coupon: null });

export const MAX_QUANTITY = 10;

export function addToCart(id: string, quantity = 1) {
  store.set((prev) => {
    const existing = prev.lines.find((line) => line.id === id);
    const lines = existing
      ? prev.lines.map((line) =>
          line.id === id
            ? { ...line, quantity: Math.min(MAX_QUANTITY, line.quantity + quantity) }
            : line,
        )
      : [...prev.lines, { id, quantity: Math.min(MAX_QUANTITY, quantity) }];
    return { ...prev, lines };
  });
}

export function setQuantity(id: string, quantity: number) {
  const clamped = Math.max(0, Math.min(MAX_QUANTITY, quantity));
  store.set((prev) => ({
    ...prev,
    lines:
      clamped === 0
        ? prev.lines.filter((line) => line.id !== id)
        : prev.lines.map((line) => (line.id === id ? { ...line, quantity: clamped } : line)),
  }));
}

export function removeFromCart(id: string) {
  store.set((prev) => ({ ...prev, lines: prev.lines.filter((line) => line.id !== id) }));
}

export function clearCart() {
  store.set({ lines: [], coupon: null });
}

export function applyCoupon(code: string): { ok: boolean; message: string } {
  const found = coupons.find((c) => c.code.toUpperCase() === code.trim().toUpperCase());
  if (!found) return { ok: false, message: "That code isn't recognised. Try HEALTH10 or WELCOME15." };

  const subtotal = cartSubtotal(store.get().lines);
  if (subtotal < found.minSpend) {
    return {
      ok: false,
      message: `${found.code} applies to orders over ₹${found.minSpend}. Add ₹${found.minSpend - subtotal} more.`,
    };
  }

  store.set((prev) => ({ ...prev, coupon: found.code }));
  return { ok: true, message: `${found.code} applied — ${found.label}.` };
}

export function removeCoupon() {
  store.set((prev) => ({ ...prev, coupon: null }));
}

function cartSubtotal(lines: CartLine[]): number {
  return lines.reduce((sum, line) => {
    const item = medicineById[line.id];
    return item ? sum + item.price * line.quantity : sum;
  }, 0);
}

export interface CartTotals {
  lines: CartLine[];
  count: number;
  subtotal: number;
  savings: number;
  discount: number;
  deliveryFee: number;
  tax: number;
  total: number;
  coupon: string | null;
  needsPrescription: boolean;
}

export const FREE_DELIVERY_OVER = 499;
export const DELIVERY_FEE = 40;
export const TAX_RATE = 0.05;

export function useCart(): CartTotals {
  const state = store.useStore();
  const lines = state.lines.filter((line) => medicineById[line.id]);

  const subtotal = cartSubtotal(lines);
  const savings = lines.reduce((sum, line) => {
    const item = medicineById[line.id];
    return item ? sum + (item.mrp - item.price) * line.quantity : sum;
  }, 0);

  const activeCoupon = coupons.find((c) => c.code === state.coupon);
  const discount =
    activeCoupon && subtotal >= activeCoupon.minSpend
      ? Math.min(activeCoupon.maxDiscount, Math.round((subtotal * activeCoupon.percent) / 100))
      : 0;

  const deliveryFee = subtotal === 0 || subtotal >= FREE_DELIVERY_OVER ? 0 : DELIVERY_FEE;
  const tax = Math.round((subtotal - discount) * TAX_RATE);

  return {
    lines,
    count: lines.reduce((sum, line) => sum + line.quantity, 0),
    subtotal,
    savings,
    discount,
    deliveryFee,
    tax,
    total: Math.max(0, subtotal - discount + deliveryFee + tax),
    coupon: activeCoupon ? activeCoupon.code : null,
    needsPrescription: lines.some((line) => medicineById[line.id]?.prescriptionRequired),
  };
}
