"use client";

import Link from "next/link";
import { Check, Headphones, MapPin, Package, Phone, RotateCcw, SkipForward, Truck } from "lucide-react";
import { medicineById } from "@/data/medicines";
import { orderStages } from "@/data/orders";
import { cx, formatFee } from "@/lib/format";
import { advanceOrder, resetOrder, stageOrder, useOrders } from "@/store/orders";
import { Card, CardTitle, EmptyState, StatusPill } from "@/components/ui/Surfaces";
import { Button, ButtonLink } from "@/components/ui/Button";
import { ProductVisual } from "@/components/pharmacy/ProductVisual";
import { useToast } from "@/components/providers/ToastProvider";

export function OrderTracking({ orderId }: { orderId: string }) {
  const orders = useOrders();
  const { toast } = useToast();
  const order = orders.find((o) => o.id === orderId);

  if (!order) {
    return (
      <EmptyState
        icon={<Package size={22} />}
        title="We couldn't find that order"
        body="The reference may be wrong, or the order may belong to a different account."
        action={<ButtonLink href="/patient/orders">View your orders</ButtonLink>}
      />
    );
  }

  const currentIndex = stageOrder.indexOf(order.stage);
  const delivered = order.stage === "delivered";

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:gap-8">
      <div className="min-w-0 space-y-5">
        {/* Status header */}
        <Card>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm text-ink-soft">Order</p>
              <p className="font-display text-2xl font-bold text-ink tnum">{order.id}</p>
              <p className="mt-1 text-xs text-ink-faint">Placed {order.placedAt}</p>
            </div>
            <div className="text-right">
              <StatusPill status={delivered ? "completed" : "upcoming"}>
                {orderStages[currentIndex]?.label}
              </StatusPill>
              <p className="mt-2 text-sm font-semibold text-ink">{order.eta}</p>
            </div>
          </div>
        </Card>

        {/* Timeline */}
        <Card>
          <CardTitle>Progress</CardTitle>
          <ol className="relative">
            {orderStages.map((stage, i) => {
              const done = i <= currentIndex;
              const active = i === currentIndex;
              const last = i === orderStages.length - 1;
              return (
                <li key={stage.stage} className="relative flex gap-4 pb-6 last:pb-0">
                  {!last && (
                    <span
                      aria-hidden="true"
                      className={cx(
                        "absolute top-7 left-3.5 h-[calc(100%-1.75rem)] w-0.5 transition-colors",
                        i < currentIndex ? "bg-mint" : "bg-ice-deep",
                      )}
                    />
                  )}
                  <span
                    className={cx(
                      "relative z-10 grid h-7 w-7 shrink-0 place-items-center rounded-full transition-colors",
                      done ? "bg-mint text-white" : "bg-ice text-ink-faint",
                      active && !delivered && "ring-4 ring-[color-mix(in_oklab,var(--color-mint)_18%,transparent)]",
                    )}
                  >
                    {done ? <Check size={14} /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
                  </span>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <p className={cx("text-sm font-semibold", done ? "text-ink" : "text-ink-faint")}>
                      {stage.label}
                    </p>
                    <p className="mt-0.5 text-xs text-ink-faint">{stage.note}</p>
                  </div>
                </li>
              );
            })}
          </ol>

          {/* Demo controls */}
          <div className="mt-6 flex flex-wrap items-center gap-2 border-t hairline pt-5">
            <span className="mr-1 text-xs font-semibold text-ink-faint">Demo controls</span>
            <Button
              size="sm"
              variant="secondary"
              disabled={delivered}
              onClick={() => {
                advanceOrder(order.id);
                const next = orderStages[Math.min(orderStages.length - 1, currentIndex + 1)];
                toast("success", "Status advanced", next.label);
              }}
            >
              <SkipForward size={14} />
              Advance status
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                resetOrder(order.id);
                toast("info", "Tracking reset", "Back to order placed.");
              }}
            >
              <RotateCcw size={14} />
              Reset
            </Button>
          </div>
        </Card>

        {/* Map */}
        <Card padded={false} className="overflow-hidden">
          <div className="relative h-56 bg-[linear-gradient(160deg,#e8effd,#f1ecfd)]">
            {/* Stylised street grid */}
            <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
              <defs>
                <pattern id="streets" width="48" height="48" patternUnits="userSpaceOnUse">
                  <path d="M48 0H0V48" fill="none" stroke="rgb(27 99 255 / 0.1)" strokeWidth="1.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#streets)" />
              <path
                d="M40 190 C 120 150, 150 120, 230 110 S 340 70, 420 54"
                fill="none"
                stroke="var(--color-electric)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="7 7"
              />
            </svg>

            <span className="absolute bottom-8 left-8 grid h-9 w-9 place-items-center rounded-full bg-white text-electric shadow-lift">
              <Truck size={17} />
            </span>
            <span className="absolute top-8 right-10 grid h-9 w-9 place-items-center rounded-full bg-electric text-white shadow-lift">
              <MapPin size={17} />
            </span>

            <p className="absolute inset-x-0 bottom-0 bg-white/80 px-4 py-2 text-center text-[0.6875rem] text-ink-soft backdrop-blur-sm">
              Illustrative map — live tracking would render here in a deployment
            </p>
          </div>
        </Card>

        {/* Items */}
        <Card>
          <CardTitle>Items in this order</CardTitle>
          <ul className="divide-y divide-[color-mix(in_oklab,var(--color-ink)_7%,transparent)]">
            {order.items.map((line) => {
              const item = medicineById[line.medicineId];
              if (!item) return null;
              return (
                <li key={line.medicineId} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                  <ProductVisual item={item} size="sm" className="h-14 w-14 shrink-0 rounded-xl" />
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/pharmacy/${item.slug}`}
                      className="truncate font-medium text-ink hover:text-electric hover:underline"
                    >
                      {item.name}
                    </Link>
                    <p className="text-xs text-ink-faint">
                      {item.packSize} · Qty {line.quantity}
                    </p>
                  </div>
                  <p className="shrink-0 font-semibold text-ink tnum">
                    {formatFee(item.price * line.quantity)}
                  </p>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>

      {/* Side */}
      <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
        <Card>
          <CardTitle>Delivery partner</CardTitle>
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[linear-gradient(140deg,var(--color-electric),var(--color-violet))] text-sm font-bold text-white">
              {order.rider.name
                .split(" ")
                .map((p) => p[0])
                .join("")}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-ink">{order.rider.name}</p>
              <p className="truncate text-xs text-ink-faint">{order.rider.vehicle}</p>
            </div>
          </div>
          <a
            href={`tel:${order.rider.phone.replace(/\s/g, "")}`}
            className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-full border hairline bg-white text-sm font-semibold text-ink transition-colors hover:border-electric hover:text-electric"
          >
            <Phone size={15} />
            Call the rider
          </a>
        </Card>

        <Card>
          <CardTitle>Delivery address</CardTitle>
          <p className="text-sm leading-relaxed text-ink-soft">
            <span className="font-medium text-ink">{order.address.name}</span>
            <br />
            {order.address.line1}
            <br />
            {order.address.landmark && (
              <>
                {order.address.landmark}
                <br />
              </>
            )}
            {order.address.city} {order.address.pincode}
            <br />
            {order.address.phone}
          </p>
        </Card>

        <Card>
          <CardTitle>Payment</CardTitle>
          <dl className="space-y-2.5 text-sm">
            <Line label="Subtotal" value={formatFee(order.subtotal)} />
            {order.discount > 0 && <Line label="Discount" value={`− ${formatFee(order.discount)}`} />}
            <Line label="Delivery" value={order.deliveryFee === 0 ? "Free" : formatFee(order.deliveryFee)} />
            <Line label="GST" value={formatFee(order.tax)} />
          </dl>
          <div className="mt-3 flex items-baseline justify-between border-t hairline pt-3">
            <span className="font-semibold text-ink">Total</span>
            <span className="font-display text-xl font-bold text-ink tnum">{formatFee(order.total)}</span>
          </div>
          <div className="mt-3">
            <StatusPill status={order.paid ? "paid" : "unpaid"}>
              {order.paid ? `Paid by ${order.payment.toUpperCase()}` : "Cash on delivery"}
            </StatusPill>
          </div>
        </Card>

        <Card>
          <CardTitle>Need help?</CardTitle>
          <p className="text-sm leading-relaxed text-ink-soft">
            Our pharmacy desk is open 8 AM to 10 PM for anything about this order.
          </p>
          <div className="mt-4 space-y-2">
            <a
              href="tel:+918000000000"
              className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-full border hairline bg-white text-sm font-semibold text-ink transition-colors hover:border-electric hover:text-electric"
            >
              <Headphones size={15} />
              +91 80 0000 0000
            </a>
            <ButtonLink href="/contact" variant="secondary" size="sm" className="w-full">
              Message support
            </ButtonLink>
          </div>
        </Card>
      </aside>
    </div>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-ink-soft">{label}</dt>
      <dd className="font-medium text-ink tnum">{value}</dd>
    </div>
  );
}
