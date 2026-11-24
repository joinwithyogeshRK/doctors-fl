"use client";

import { createPersistentStore } from "@/lib/store";

const store = createPersistentStore<string[]>("mh.wishlist", []);

export function toggleWishlist(id: string) {
  store.set((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
}

export function useWishlist(): string[] {
  return store.useStore();
}

/** Doctors the visitor has opened, most recent first. */
const recent = createPersistentStore<string[]>("mh.recentDoctors", []);

export function rememberDoctor(slug: string) {
  recent.set((prev) => [slug, ...prev.filter((s) => s !== slug)].slice(0, 6));
}

export function useRecentDoctors(): string[] {
  return recent.useStore();
}

/** Favourited doctors. */
const favourites = createPersistentStore<string[]>("mh.favouriteDoctors", []);

export function toggleFavouriteDoctor(slug: string) {
  favourites.set((prev) =>
    prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
  );
}

export function useFavouriteDoctors(): string[] {
  return favourites.useStore();
}
