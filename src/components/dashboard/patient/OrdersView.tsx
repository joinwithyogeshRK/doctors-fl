"use client";

import Link from "next/link";
import { Package, PackageSearch, RotateCcw } from "lucide-react";
import { medicineById } from "@/data/medicines";
import { formatFee } from "@/lib/format";
import { useOrders } from "@/store/orders";
import { addToCart } from "@/store/cart";
import { Card, EmptyState, PageHeader, StatusPill } from "@/components/ui/Surfaces";
import { Button, ButtonLink } from "@/components/ui/Button";
import { orderStages } from "@/data/orders";
import { useToast } from "@/components/providers/ToastProvider";

export function OrdersView() {
  const orders = useOrders();
  const { toast } = useToast();

  if (orders.length === 0) {
    return (
      <div className="mx-auto max-w-4xl">
        <PageHeader title="Medicine orders" lede="Your pharmacy orders and their delivery status." />
        <div className="mt-7">
          <EmptyState
            icon={<PackageSearch size={22} />}
            title="No orders yet"
            body="Order medicines from the pharmacy and they'll be tracked here from packing to doorstep."
            action={<ButtonLink href="/pharmacy">Browse the pharmacy</ButtonLink>}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Medicine orders"
        lede="Your pharmacy orders and their delivery status."
        action={<ButtonLink href="/pharmacy" variant="secondary">Order again</ButtonLink>}
      />

      <div className="mt-7 space-y-4">
        {orders.map((order) => {
          const stageIndex = orderStages.findIndex((s) => s.stage === order.stage);
          return (
            <Card key={order.id}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[color-mix(in_oklab,var(--color-violet)_12%,white)] text-violet">
                    <Package size={19} />
                  </span>
                  <div>
                    <p className="font-semibold text-ink tnum">{order.id}</p>
                    <p className="text-xs text-ink-faint">Placed {order.placedAt}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-display text-xl font-bold text-ink">{formatFee(order.total)}</p>
                  <StatusPill status={order.stage === "delivered" ? "completed" : "upcoming"}>
                    {orderStages[stageIndex]?.label ?? order.stage}
                  </StatusPill>
                </div>
              </div>

              <ul className="mt-5 space-y-2">
                {order.items.map((line) => {
                  const item = medicineById[line.medicineId];
                  if (!item) return null;
                  return (
                    <li key={line.medicineId} className="flex items-center justify-between gap-3 text-sm">
                      <span className="min-w-0 truncate text-ink-soft">
                        {item.name} <span className="text-ink-faint">× {line.quantity}</span>
                      </span>
                      <span className="shrink-0 font-medium text-ink tnum">
                        {formatFee(item.price * line.quantity)}
                      </span>
                    </li>
                  );
                })}
              </ul>

              <p className="mt-4 rounded-xl bg-mist px-4 py-2.5 text-xs text-ink-soft">{order.eta}</p>

              <div className="mt-5 flex flex-wrap gap-2 border-t hairline pt-5">
                <ButtonLink href={`/orders/${order.id}/tracking`} size="sm">
                  Track order
                </ButtonLink>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    order.items.forEach((line) => addToCart(line.medicineId, line.quantity));
                    toast("success", "Added to cart", `${order.items.length} items from ${order.id}`);
                  }}
                >
                  <RotateCcw size={14} />
                  Reorder
                </Button>
                <Link
                  href="/patient/payments"
                  className="inline-flex h-9 items-center rounded-full px-4 text-[0.8125rem] font-semibold text-ink-soft transition-colors hover:text-electric"
                >
                  View invoice
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
