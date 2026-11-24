"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/store/cart";

export function CartButton() {
  const { count } = useCart();

  return (
    <Link
      href="/cart"
      aria-label={count ? `Cart, ${count} items` : "Cart, empty"}
      className="relative grid h-10 w-10 place-items-center rounded-full text-ink-soft transition-colors hover:bg-ice hover:text-ink"
    >
      <ShoppingCart size={18} />
      {count > 0 && (
        <span className="absolute top-1 right-1 grid h-4 min-w-4 place-items-center rounded-full bg-electric px-1 text-[0.625rem] font-bold text-white ring-2 ring-white">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Link>
  );
}
