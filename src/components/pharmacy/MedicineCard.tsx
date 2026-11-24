"use client";

import Link from "next/link";
import { Eye, Heart, Plus, ShieldAlert, Star } from "lucide-react";
import type { Medicine } from "@/types";
import { discountPercent } from "@/data/medicines";
import { cx, formatFee } from "@/lib/format";
import { ProductVisual } from "@/components/pharmacy/ProductVisual";
import { addToCart } from "@/store/cart";
import { toggleWishlist, useWishlist } from "@/store/wishlist";
import { useToast } from "@/components/providers/ToastProvider";

export function MedicineCard({
  item,
  onQuickView,
}: {
  item: Medicine;
  onQuickView?: (item: Medicine) => void;
}) {
  const wishlist = useWishlist();
  const { toast } = useToast();
  const saved = wishlist.includes(item.id);
  const off = discountPercent(item);

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-card border border-[color-mix(in_oklab,var(--color-ink)_8%,transparent)] bg-white shadow-soft transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div className="relative">
        <Link href={`/pharmacy/${item.slug}`} aria-label={item.name}>
          <ProductVisual item={item} className="aspect-[4/3] w-full" />
        </Link>

        {off > 0 && (
          <span className="absolute top-3 left-3 rounded-full bg-coral px-2.5 py-1 text-[0.6875rem] font-bold text-white">
            {off}% off
          </span>
        )}

        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100 focus-within:opacity-100">
          <button
            type="button"
            onClick={() => {
              toggleWishlist(item.id);
              toast("success", saved ? "Removed from wishlist" : "Saved to wishlist", item.name);
            }}
            aria-label={saved ? `Remove ${item.name} from wishlist` : `Save ${item.name}`}
            aria-pressed={saved}
            className={cx(
              "grid h-9 w-9 place-items-center rounded-full bg-white/90 shadow-soft backdrop-blur-sm transition-colors",
              saved ? "text-coral" : "text-ink-soft hover:text-coral",
            )}
          >
            <Heart size={15} className={saved ? "fill-coral" : ""} />
          </button>
          {onQuickView && (
            <button
              type="button"
              onClick={() => onQuickView(item)}
              aria-label={`Quick view ${item.name}`}
              className="grid h-9 w-9 place-items-center rounded-full bg-white/90 text-ink-soft shadow-soft backdrop-blur-sm transition-colors hover:text-electric"
            >
              <Eye size={15} />
            </button>
          )}
        </div>

        {!item.inStock && (
          <div className="absolute inset-0 grid place-items-center bg-white/75 backdrop-blur-[2px]">
            <span className="rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-white">
              Out of stock
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        {item.prescriptionRequired && (
          <span className="mb-2 inline-flex w-fit items-center gap-1 rounded-chip bg-[color-mix(in_oklab,var(--color-amber)_18%,white)] px-2 py-0.5 text-[0.625rem] font-bold text-[#8a5a00]">
            <ShieldAlert size={10} />
            Prescription
          </span>
        )}

        <Link href={`/pharmacy/${item.slug}`} className="hover:text-electric">
          <h3 className="line-clamp-2 text-sm font-semibold text-ink">{item.name}</h3>
        </Link>
        <p className="mt-1 text-xs text-ink-faint">
          {item.brand} · {item.packSize}
        </p>

        <div className="mt-2 flex items-center gap-1 text-xs">
          <Star size={12} strokeWidth={0} className="fill-amber" />
          <span className="font-semibold text-ink">{item.rating}</span>
          <span className="text-ink-faint">({item.reviewCount.toLocaleString("en-IN")})</span>
        </div>

        <div className="mt-auto pt-4">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-lg font-bold text-ink">{formatFee(item.price)}</span>
            {off > 0 && (
              <span className="text-xs text-ink-faint line-through">{formatFee(item.mrp)}</span>
            )}
          </div>

          <button
            type="button"
            disabled={!item.inStock}
            onClick={() => {
              addToCart(item.id);
              toast("success", "Added to cart", item.name);
            }}
            className={cx(
              "mt-3 inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-full text-sm font-semibold transition-all",
              item.inStock
                ? "bg-[linear-gradient(104deg,var(--color-electric),var(--color-indigo))] text-white shadow-[0_8px_20px_-10px_rgb(27_99_255/0.8)] hover:-translate-y-0.5"
                : "cursor-not-allowed bg-ice text-ink-faint",
            )}
          >
            <Plus size={15} />
            {item.inStock ? "Add to cart" : "Notify me"}
          </button>
        </div>
      </div>
    </article>
  );
}
