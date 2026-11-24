"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Check,
  Factory,
  Heart,
  Minus,
  Plus,
  ShieldAlert,
  ShoppingCart,
  Star,
  Truck,
} from "lucide-react";
import type { Medicine } from "@/types";
import { discountPercent, medicines } from "@/data/medicines";
import { cx, formatFee } from "@/lib/format";
import { Card, CardTitle } from "@/components/ui/Surfaces";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import { ProductVisual } from "@/components/pharmacy/ProductVisual";
import { MedicineCard } from "@/components/pharmacy/MedicineCard";
import { MAX_QUANTITY, addToCart } from "@/store/cart";
import { toggleWishlist, useWishlist } from "@/store/wishlist";
import { useToast } from "@/components/providers/ToastProvider";

export function ProductDetail({ item }: { item: Medicine }) {
  const [quantity, setQuantity] = useState(1);
  const [angle, setAngle] = useState(0);
  const wishlist = useWishlist();
  const { toast } = useToast();
  const saved = wishlist.includes(item.id);
  const off = discountPercent(item);

  const related = medicines
    .filter((m) => m.id !== item.id && m.category === item.category)
    .slice(0, 4);

  return (
    <div>
      <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
        {/* Gallery */}
        <div>
          <Card padded={false} className="overflow-hidden">
            <ProductVisual
              item={item}
              size="lg"
              className={cx(
                "aspect-square w-full transition-transform duration-500",
                angle === 1 && "scale-110",
                angle === 2 && "scale-95 -rotate-3",
                angle === 3 && "scale-105 rotate-2",
              )}
            />
          </Card>
          <div className="mt-3 grid grid-cols-4 gap-3">
            {[0, 1, 2, 3].map((i) => (
              <button
                key={i}
                type="button"
                onClick={() => setAngle(i)}
                aria-label={`View ${i + 1}`}
                aria-pressed={angle === i}
                className={cx(
                  "overflow-hidden rounded-xl border-2 transition-colors",
                  angle === i ? "border-electric" : "border-transparent hover:border-ice-deep",
                )}
              >
                <ProductVisual item={item} size="sm" className="aspect-square w-full" />
              </button>
            ))}
          </div>
        </div>

        {/* Buy box */}
        <div>
          {item.prescriptionRequired && (
            <span className="inline-flex items-center gap-1.5 rounded-chip bg-[color-mix(in_oklab,var(--color-amber)_18%,white)] px-3 py-1.5 text-xs font-bold text-[#8a5a00]">
              <ShieldAlert size={13} />
              Prescription required
            </span>
          )}

          <h1 className="mt-3 font-display text-[clamp(1.5rem,3.4vw,2.25rem)] leading-tight font-bold text-ink">
            {item.name}
          </h1>
          <p className="mt-2 text-sm text-ink-soft">
            {item.brand} · {item.strength} · {item.packSize}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5 text-sm">
              <Star size={15} strokeWidth={0} className="fill-amber" />
              <span className="font-semibold text-ink">{item.rating}</span>
              <span className="text-ink-faint">
                ({item.reviewCount.toLocaleString("en-IN")} reviews)
              </span>
            </span>
            <span
              className={cx(
                "inline-flex items-center gap-1.5 text-sm font-semibold",
                item.inStock ? "text-mint" : "text-coral",
              )}
            >
              <Check size={15} />
              {item.inStock ? "In stock" : "Out of stock"}
            </span>
          </div>

          <div className="mt-6 flex flex-wrap items-baseline gap-3">
            <span className="font-display text-3xl font-bold text-ink">{formatFee(item.price)}</span>
            {off > 0 && (
              <>
                <span className="text-base text-ink-faint line-through">{formatFee(item.mrp)}</span>
                <span className="rounded-full bg-[color-mix(in_oklab,var(--color-mint)_14%,white)] px-2.5 py-1 text-xs font-bold text-[color-mix(in_oklab,var(--color-mint)_80%,black)]">
                  Save {formatFee(item.mrp - item.price)}
                </span>
              </>
            )}
          </div>
          <p className="mt-1.5 text-xs text-ink-faint">Inclusive of all taxes</p>

          <p className="mt-6 text-[0.9375rem] leading-relaxed text-ink-soft">{item.description}</p>

          {/* Quantity + add */}
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 rounded-full border hairline bg-white p-1.5">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
                className="grid h-9 w-9 place-items-center rounded-full text-ink-soft transition-colors hover:bg-ice disabled:opacity-35"
              >
                <Minus size={15} />
              </button>
              <span className="w-9 text-center font-semibold text-ink tnum">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(MAX_QUANTITY, q + 1))}
                disabled={quantity >= MAX_QUANTITY}
                aria-label="Increase quantity"
                className="grid h-9 w-9 place-items-center rounded-full text-ink-soft transition-colors hover:bg-ice disabled:opacity-35"
              >
                <Plus size={15} />
              </button>
            </div>

            <Button
              size="lg"
              disabled={!item.inStock}
              onClick={() => {
                addToCart(item.id, quantity);
                toast("success", "Added to cart", `${quantity} × ${item.name}`);
              }}
            >
              <ShoppingCart size={17} />
              Add to cart · {formatFee(item.price * quantity)}
            </Button>

            <button
              type="button"
              onClick={() => {
                toggleWishlist(item.id);
                toast("success", saved ? "Removed from wishlist" : "Saved to wishlist", item.name);
              }}
              aria-pressed={saved}
              aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
              className={cx(
                "grid h-13 w-13 place-items-center rounded-full border transition-colors",
                saved ? "border-coral text-coral" : "hairline text-ink-soft hover:border-coral hover:text-coral",
              )}
            >
              <Heart size={19} className={saved ? "fill-coral" : ""} />
            </button>
          </div>

          {/* Delivery */}
          <div className="mt-6 flex items-start gap-3 rounded-card border hairline bg-mist p-4">
            <Truck size={18} className="mt-0.5 shrink-0 text-electric" />
            <div className="text-sm">
              <p className="font-semibold text-ink">Delivery to 560038</p>
              <p className="mt-0.5 text-ink-soft">
                Express within 3 hours, or free standard delivery on orders over ₹499.
              </p>
            </div>
          </div>

          {item.prescriptionRequired && (
            <p className="mt-3 flex gap-3 rounded-card bg-[color-mix(in_oklab,var(--color-amber)_12%,white)] p-4 text-sm leading-relaxed text-[#8a5a00]">
              <ShieldAlert size={17} className="mt-0.5 shrink-0" />
              You&rsquo;ll be asked to upload a valid prescription at checkout. Our pharmacist
              verifies it before the order is dispatched.
            </p>
          )}
        </div>
      </div>

      {/* Details */}
      <Tabs
        className="mt-12"
        items={[
          {
            id: "about",
            label: "Description",
            content: (
              <Card>
                <CardTitle>About this product</CardTitle>
                <p className="text-[0.9375rem] leading-relaxed text-ink-soft">{item.description}</p>
                {item.tags.length > 0 && (
                  <ul className="mt-5 flex flex-wrap gap-1.5">
                    {item.tags.map((tag) => (
                      <li key={tag} className="rounded-chip bg-ice px-3 py-1.5 text-xs font-semibold text-ink-soft">
                        {tag}
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
            ),
          },
          {
            id: "dosage",
            label: "Dosage",
            content: (
              <Card>
                <CardTitle>Dosage information</CardTitle>
                <p className="text-[0.9375rem] leading-relaxed text-ink-soft">{item.dosageNote}</p>
                <p className="mt-5 rounded-xl bg-[color-mix(in_oklab,var(--color-coral)_8%,white)] px-4 py-3.5 text-sm leading-relaxed text-ink-soft">
                  <span className="font-semibold text-coral">Important.</span> This demonstration
                  deliberately does not generate dosage recommendations. Dosage depends on your
                  weight, age, kidney and liver function and other medicines you take. Only a
                  qualified healthcare professional can advise on it.
                </p>
              </Card>
            ),
          },
          {
            id: "ingredients",
            label: "Ingredients",
            content: (
              <Card>
                <CardTitle>Composition</CardTitle>
                {item.ingredients.length === 0 ? (
                  <p className="text-sm text-ink-soft">
                    This product is a device or accessory and has no active ingredients.
                  </p>
                ) : (
                  <ul className="space-y-2.5">
                    {item.ingredients.map((ingredient) => (
                      <li key={ingredient} className="flex items-center gap-2.5 text-sm text-ink-soft">
                        <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[color-mix(in_oklab,var(--color-mint)_14%,white)] text-mint">
                          <Check size={11} />
                        </span>
                        {ingredient}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-6 flex items-center gap-3 border-t hairline pt-5">
                  <Factory size={17} className="shrink-0 text-ink-faint" />
                  <div className="text-sm">
                    <p className="text-xs text-ink-faint">Manufacturer</p>
                    <p className="font-medium text-ink">{item.manufacturer}</p>
                  </div>
                </div>
              </Card>
            ),
          },
        ]}
      />

      <p className="mt-6 rounded-card border hairline bg-white px-5 py-4 text-xs leading-relaxed text-ink-soft">
        Product information is for demonstration purposes only. Consult a qualified healthcare
        professional before using any medication.
      </p>

      {related.length > 0 && (
        <section className="mt-12">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-display text-2xl font-bold text-ink">Related products</h2>
            <Link href="/pharmacy" className="text-sm font-semibold text-electric hover:underline">
              All products
            </Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((product) => (
              <MedicineCard key={product.id} item={product} />
            ))}
          </div>
        </section>
      )}

      <div className="mt-10 flex justify-center">
        <ButtonLink href="/cart" variant="secondary">
          Go to cart
        </ButtonLink>
      </div>
    </div>
  );
}
