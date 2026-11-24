"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Minus,
  Plus,
  ShieldAlert,
  ShoppingCart,
  Tag,
  Trash2,
  Truck,
  X,
} from "lucide-react";
import { coupons, medicineById } from "@/data/medicines";
import { cx, formatFee } from "@/lib/format";
import {
  DELIVERY_FEE,
  FREE_DELIVERY_OVER,
  MAX_QUANTITY,
  applyCoupon,
  removeCoupon,
  removeFromCart,
  setQuantity,
  useCart,
} from "@/store/cart";
import { Card, CardTitle, EmptyState, PageHeader } from "@/components/ui/Surfaces";
import { Button, ButtonLink } from "@/components/ui/Button";
import { ProductVisual } from "@/components/pharmacy/ProductVisual";
import { useToast } from "@/components/providers/ToastProvider";

export function CartView() {
  const cart = useCart();
  const { toast } = useToast();
  const [code, setCode] = useState("");
  const [couponError, setCouponError] = useState<string | null>(null);

  if (cart.lines.length === 0) {
    return (
      <div className="mx-auto max-w-3xl">
        <PageHeader title="Your cart" lede="Items you add from the pharmacy appear here." />
        <div className="mt-8">
          <EmptyState
            icon={<ShoppingCart size={22} />}
            title="Your cart is empty"
            body="Browse the pharmacy for medicines, vitamins and everyday health essentials."
            action={
              <div className="flex flex-wrap justify-center gap-2">
                <ButtonLink href="/pharmacy">Browse the pharmacy</ButtonLink>
                <ButtonLink href="/wellness" variant="secondary">
                  Wellness store
                </ButtonLink>
              </div>
            }
          />
        </div>
      </div>
    );
  }

  const toFreeDelivery = FREE_DELIVERY_OVER - cart.subtotal;

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Your cart"
        lede={`${cart.count} ${cart.count === 1 ? "item" : "items"} ready to check out.`}
        action={
          <ButtonLink href="/pharmacy" variant="secondary">
            Continue shopping
          </ButtonLink>
        }
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_1fr] lg:gap-8">
        {/* Lines */}
        <div className="space-y-3">
          {cart.needsPrescription && (
            <p className="flex gap-3 rounded-card bg-[color-mix(in_oklab,var(--color-amber)_12%,white)] p-4 text-sm leading-relaxed text-[#8a5a00]">
              <ShieldAlert size={17} className="mt-0.5 shrink-0" />
              Your cart contains prescription-only medicines. You&rsquo;ll be asked to upload a
              prescription at checkout before these can be dispatched.
            </p>
          )}

          {cart.lines.map((line) => {
            const item = medicineById[line.id];
            if (!item) return null;
            return (
              <Card key={line.id} className="flex flex-wrap gap-4">
                <Link href={`/pharmacy/${item.slug}`} className="shrink-0">
                  <ProductVisual item={item} size="sm" className="h-20 w-20 rounded-xl" />
                </Link>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link
                        href={`/pharmacy/${item.slug}`}
                        className="font-semibold text-ink hover:text-electric hover:underline"
                      >
                        {item.name}
                      </Link>
                      <p className="mt-0.5 text-xs text-ink-faint">
                        {item.brand} · {item.packSize}
                        {item.strength !== "—" && ` · ${item.strength}`}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        removeFromCart(line.id);
                        toast("info", "Removed from cart", item.name);
                      }}
                      aria-label={`Remove ${item.name}`}
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-ink-faint transition-colors hover:bg-ice hover:text-coral"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-1 rounded-full border hairline bg-white p-1">
                      <button
                        type="button"
                        onClick={() => setQuantity(line.id, line.quantity - 1)}
                        aria-label={`Decrease quantity of ${item.name}`}
                        className="grid h-8 w-8 place-items-center rounded-full text-ink-soft transition-colors hover:bg-ice"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold text-ink tnum">
                        {line.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity(line.id, line.quantity + 1)}
                        disabled={line.quantity >= MAX_QUANTITY}
                        aria-label={`Increase quantity of ${item.name}`}
                        className="grid h-8 w-8 place-items-center rounded-full text-ink-soft transition-colors hover:bg-ice disabled:opacity-35"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="font-display text-lg font-bold text-ink tnum">
                        {formatFee(item.price * line.quantity)}
                      </p>
                      {item.mrp > item.price && (
                        <p className="text-xs text-ink-faint line-through tnum">
                          {formatFee(item.mrp * line.quantity)}
                        </p>
                      )}
                    </div>
                  </div>

                  {line.quantity >= MAX_QUANTITY && (
                    <p className="mt-2 text-xs text-ink-faint">
                      {MAX_QUANTITY} is the maximum quantity per order.
                    </p>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Card>
            <CardTitle>Order summary</CardTitle>

            {/* Coupon */}
            {cart.coupon ? (
              <div className="mb-5 flex items-center gap-3 rounded-xl bg-[color-mix(in_oklab,var(--color-mint)_10%,white)] px-4 py-3">
                <Tag size={16} className="shrink-0 text-mint" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-ink">{cart.coupon} applied</p>
                  <p className="text-xs text-ink-soft">You saved {formatFee(cart.discount)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    removeCoupon();
                    setCode("");
                    toast("info", "Coupon removed");
                  }}
                  aria-label="Remove coupon"
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-ink-faint hover:bg-white hover:text-ink"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const result = applyCoupon(code);
                  setCouponError(result.ok ? null : result.message);
                  if (result.ok) toast("success", "Coupon applied", result.message);
                }}
                className="mb-5"
              >
                <label htmlFor="coupon" className="mb-1.5 block text-xs font-semibold text-ink-soft">
                  Have a coupon?
                </label>
                <div className="flex gap-2">
                  <input
                    id="coupon"
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value.toUpperCase());
                      setCouponError(null);
                    }}
                    placeholder="HEALTH10"
                    className={cx(
                      "min-w-0 flex-1 rounded-xl border bg-white px-4 py-2.5 text-sm text-ink uppercase placeholder:normal-case placeholder:text-ink-faint focus:outline-none",
                      couponError ? "border-coral" : "hairline focus:border-electric",
                    )}
                  />
                  <Button type="submit" variant="secondary" size="sm" disabled={!code.trim()}>
                    Apply
                  </Button>
                </div>
                {couponError && <p className="mt-1.5 text-xs text-coral">{couponError}</p>}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {coupons.map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => setCode(c.code)}
                      className="rounded-chip bg-ice px-2.5 py-1 text-[0.6875rem] font-semibold text-ink-soft transition-colors hover:bg-ice-deep"
                    >
                      {c.code} · {c.label}
                    </button>
                  ))}
                </div>
              </form>
            )}

            <dl className="space-y-2.5 border-t hairline pt-5 text-sm">
              <Line label={`Subtotal (${cart.count} items)`} value={formatFee(cart.subtotal)} />
              {cart.savings > 0 && (
                <Line label="Pack savings" value={`− ${formatFee(cart.savings)}`} tone="mint" />
              )}
              {cart.discount > 0 && (
                <Line label={`Coupon ${cart.coupon}`} value={`− ${formatFee(cart.discount)}`} tone="mint" />
              )}
              <Line
                label="Delivery"
                value={cart.deliveryFee === 0 ? "Free" : formatFee(cart.deliveryFee)}
                tone={cart.deliveryFee === 0 ? "mint" : undefined}
              />
              <Line label="GST (5%)" value={formatFee(cart.tax)} />
            </dl>

            <div className="mt-4 flex items-baseline justify-between border-t hairline pt-4">
              <span className="font-semibold text-ink">Total</span>
              <span className="font-display text-2xl font-bold text-ink tnum">
                {formatFee(cart.total)}
              </span>
            </div>

            {toFreeDelivery > 0 && (
              <div className="mt-4 rounded-xl bg-mist p-3.5">
                <p className="flex items-center gap-2 text-xs text-ink-soft">
                  <Truck size={14} className="shrink-0 text-electric" />
                  Add {formatFee(toFreeDelivery)} more for free delivery
                </p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ice-deep">
                  <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,var(--color-electric),var(--color-mint))] transition-[width] duration-500"
                    style={{ width: `${Math.min(100, (cart.subtotal / FREE_DELIVERY_OVER) * 100)}%` }}
                  />
                </div>
              </div>
            )}

            <ButtonLink href="/checkout" size="lg" className="mt-5 w-full">
              Checkout
              <ArrowRight size={17} />
            </ButtonLink>

            <p className="mt-3 text-center text-xs text-ink-faint">
              Delivery charged at {formatFee(DELIVERY_FEE)} below {formatFee(FREE_DELIVERY_OVER)}
            </p>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function Line({ label, value, tone }: { label: string; value: string; tone?: "mint" }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-ink-soft">{label}</dt>
      <dd className={cx("font-medium tnum", tone === "mint" ? "text-mint" : "text-ink")}>{value}</dd>
    </div>
  );
}
