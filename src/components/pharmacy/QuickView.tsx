"use client";

import Link from "next/link";
import { useState } from "react";
import { Minus, Plus, ShieldAlert, Star } from "lucide-react";
import type { Medicine } from "@/types";
import { discountPercent } from "@/data/medicines";
import { formatFee } from "@/lib/format";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { ProductVisual } from "@/components/pharmacy/ProductVisual";
import { MAX_QUANTITY, addToCart } from "@/store/cart";
import { useToast } from "@/components/providers/ToastProvider";

export function QuickView({ item, onClose }: { item: Medicine | null; onClose: () => void }) {
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();

  return (
    <Dialog
      open={Boolean(item)}
      onClose={() => {
        setQuantity(1);
        onClose();
      }}
      title={item?.name ?? ""}
      description={item ? `${item.brand} · ${item.packSize}` : undefined}
      size="lg"
      footer={
        item && (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1 rounded-full border hairline bg-white p-1">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
                className="grid h-8 w-8 place-items-center rounded-full text-ink-soft transition-colors hover:bg-ice disabled:opacity-35"
              >
                <Minus size={14} />
              </button>
              <span className="w-7 text-center text-sm font-semibold text-ink tnum">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(MAX_QUANTITY, q + 1))}
                disabled={quantity >= MAX_QUANTITY}
                aria-label="Increase quantity"
                className="grid h-8 w-8 place-items-center rounded-full text-ink-soft transition-colors hover:bg-ice disabled:opacity-35"
              >
                <Plus size={14} />
              </button>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/pharmacy/${item.slug}`}
                className="inline-flex h-11 items-center rounded-full border hairline bg-white px-5 text-sm font-semibold text-ink transition-colors hover:border-electric hover:text-electric"
              >
                Full details
              </Link>
              <Button
                disabled={!item.inStock}
                onClick={() => {
                  addToCart(item.id, quantity);
                  toast("success", "Added to cart", `${quantity} × ${item.name}`);
                  setQuantity(1);
                  onClose();
                }}
              >
                Add {formatFee(item.price * quantity)}
              </Button>
            </div>
          </div>
        )
      }
    >
      {item && (
        <div className="grid gap-6 sm:grid-cols-[1fr_1.2fr]">
          <ProductVisual item={item} size="lg" className="aspect-square w-full rounded-card" />

          <div>
            <div className="flex items-center gap-2 text-sm">
              <Star size={14} strokeWidth={0} className="fill-amber" />
              <span className="font-semibold text-ink">{item.rating}</span>
              <span className="text-ink-faint">
                ({item.reviewCount.toLocaleString("en-IN")} reviews)
              </span>
            </div>

            <div className="mt-3 flex items-baseline gap-2.5">
              <span className="font-display text-2xl font-bold text-ink">{formatFee(item.price)}</span>
              {discountPercent(item) > 0 && (
                <>
                  <span className="text-sm text-ink-faint line-through">{formatFee(item.mrp)}</span>
                  <span className="rounded-full bg-[color-mix(in_oklab,var(--color-mint)_14%,white)] px-2 py-0.5 text-xs font-bold text-[color-mix(in_oklab,var(--color-mint)_80%,black)]">
                    {discountPercent(item)}% off
                  </span>
                </>
              )}
            </div>

            <p className="mt-4 text-sm leading-relaxed text-ink-soft">{item.description}</p>

            <dl className="mt-4 space-y-2 text-sm">
              <Row label="Strength" value={item.strength} />
              <Row label="Pack size" value={item.packSize} />
              <Row label="Manufacturer" value={item.manufacturer} />
              <Row label="Availability" value={item.inStock ? "In stock" : "Out of stock"} />
            </dl>

            {item.prescriptionRequired && (
              <p className="mt-4 flex gap-2.5 rounded-xl bg-[color-mix(in_oklab,var(--color-amber)_14%,white)] px-4 py-3 text-xs leading-relaxed text-[#8a5a00]">
                <ShieldAlert size={15} className="mt-0.5 shrink-0" />
                A valid prescription is required. You will be asked to upload one before this order
                can be dispatched.
              </p>
            )}
          </div>
        </div>
      )}
    </Dialog>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-ink-faint">{label}</dt>
      <dd className="text-right font-medium text-ink">{value}</dd>
    </div>
  );
}
